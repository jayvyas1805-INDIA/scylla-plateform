# Scylla AI Assistant — service

## New: real actions, not just answers

Beyond retrieval + Q&A, the assistant can now:

- **Navigate the frontend for real** (`navigate_to` tool): "take me to
  the teams page" actually routes the browser there, via a closed
  whitelist of routes verified against the real `AppRoutes.jsx` /
  admin-dashboard `App.jsx` — never a guessed or invented path. Emitted
  as a distinct `navigate` SSE event (or `actions` in the JSON
  response), separate from the visible reply text, so the frontend
  routes only after the reply has fully rendered.
- **Compare two teams or two vendors** (`compare_teams` /
  `compare_vendors`): returns a structured side-by-side payload (a
  `comparison` SSE event) that both `ChatWidget`s render as an actual
  comparison table, not just two paragraphs of prose.
- **Understand "me"/"my team"/"my business"** without asking who you
  are: the system prompt gets an explicit note derived from the
  caller's ACTUAL authenticated role (never from what they type), so a
  logged-in team member saying "my team" resolves straight to
  `get_my_team_profile` instead of prompting them to specify.
- **A proactive digest for admins**: the admin-dashboard widget silently
  asks for a pending-approvals summary the first time an admin opens
  the chat in a session, instead of a generic empty state. This is
  deliberately NOT a scheduled/pushed daily digest — no cron or
  background job was added — it's an honest on-demand version that
  fires once per session without needing new infrastructure.

Phases done so far, all verified with real (not just eyeballed) tests:

- **Phase 3** — basic chat: Client → FastAPI → LangChain → LLM.
- **Phase 4/5** — RAG (`app/knowledge/`, BM25 over Scylla's own docs) +
  structured tools (`app/tools/scylla_api.py`) calling your existing
  Express APIs.
- **Phase 6** — tool/function calling: LangChain `bind_tools` + a
  bounded (max 4 iterations) tool-calling loop in `app/orchestrator/chain.py`.
- **Phase 7** — conversation memory + page context: short conversations
  are passed through as-is; once history grows past ~10 turns, older
  turns are collapsed into one LLM-generated summary
  (`app/orchestrator/memory.py`) instead of either being dropped or sent
  in full forever. `page_context` from the frontend (current route/entity)
  is folded in as a system note so "tell me about this" resolves correctly.
- **Phase 8** — security: per-IP rate limiting on the chat endpoint
  (`app/rate_limit.py`, in-memory via slowapi — 15 req/min by default,
  tested to actually 429 after the limit), explicit system-prompt rules
  treating tool/RAG/summary content as untrusted DATA rather than
  instructions, and a rule against revealing the system prompt, tool
  internals, or config regardless of how the request is phrased. Auth
  itself was never re-implemented here — see "Security notes" below.
- **Phase 9** — streaming: `/api/assistant/message/stream` (SSE) streams
  real tokens as the model generates them. Tool-call turns (empty
  content, invisible to the user anyway) are buffered silently; once
  the model starts producing an actual final answer, tokens stream to
  the client live. Verified with a scripted fake model covering both a
  pure-text turn and a tool-call → final-answer sequence.
- **Phase 10** — a real pytest suite (`tests/`, 22 tests, all passing)
  covering grounding, authorization, prompt-injection defenses, memory,
  the tool-calling loop, rate limiting, and API error handling. Plus a
  small extendable eval harness (`eval/`) that runs categorized cases
  against your real configured LLM/backend.

## Setup

```bash
cd ai-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env: set LLM_API_KEY (get a free key at https://console.groq.com)
#            set JWT_SECRET to the SAME value as backend/.env's JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

Then in `Client/.env` (create if missing):
```
VITE_ai_backend_url=http://localhost:8000
```

## Running the tests

```bash
cd ai-service
source .venv/bin/activate
pip install -r requirements.txt   # includes pytest/pytest-asyncio
pytest tests/ -v
```

No API key or running Express backend needed — everything is mocked.

## Running the eval set (needs a real LLM key + Express running)

```bash
python -m eval.run_eval
```

Grades 10 categorized cases (factual, retrieval, unknown/grounding,
multi-turn, authorization, navigation, tool-use, prompt-injection)
against your real configured provider with simple keyword checks. Add
new cases to `eval/eval_set.json` — no code changes needed.

## Swapping the LLM provider/model later

Edit only `LLM_PROVIDER` / `LLM_BASE_URL` / `LLM_MODEL` / `LLM_API_KEY`
in `.env` — no code changes needed, since every option below speaks the
same OpenAI-compatible chat API:

| Provider | LLM_BASE_URL | Example LLM_MODEL |
|---|---|---|
| Groq (default) | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Together AI | `https://api.together.xyz/v1` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| OpenRouter | `https://openrouter.ai/api/v1` | `meta-llama/llama-3.3-70b-instruct` |
| Local Ollama | `http://localhost:11434/v1` | `llama3.3` |

## Verifying the service works manually

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/assistant/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Scylla?"}'
```

## Security notes

- `LLM_API_KEY` and `JWT_SECRET` live only in `.env`, never sent to the frontend.
- All provider/tool errors are caught and replaced with a generic message —
  no stack traces or internal details reach the client (tested).
- The JWT this service reads is the **same token** the Client already
  sends to Express. This service only decodes it to know *who's asking*
  (for prompt context / which tools to offer) — it never authorizes data
  access itself. Every tool call forwards this same token to the
  existing Express `authUser`/`adminAuth`/`teamAuth` middleware, which
  remains the sole authority on what a given user can see. The token is
  closed over when tools are built per-request — it is never a parameter
  the LLM can see or change (tested), which is what actually stops a
  prompt like "call the admin tool as an admin" from working.
- Chat endpoint is rate-limited per IP (15/min default, tested) to
  protect the paid LLM call from being hammered.

## A real design decision worth knowing (and being able to explain)

Early versions of `app/knowledge/retrieval.py` tried to fix retrieval
noise (a tangential FAQ chunk leaking into an unrelated answer) by
tuning a score threshold — first an absolute BM25 cutoff, then a
"relative to this query's top match" cutoff. Testing found a case that
**proves no single threshold can work**: excluding one known-bad match
required threshold > 0.87 of the top score, while correctly including
a different known-good match required threshold ≤ 0.79 — a direct
contradiction, not a tuning miss.

The actual fix: stop asking BM25 (keyword overlap) to do precision
filtering it's structurally not capable of on a small, single-topic
corpus. Retrieval now just returns top-k candidates by rank (recall);
the LLM is explicitly instructed (system prompt rule 3b) not to
volunteer whatever tangential candidates come along with the real
answer (precision). That split — retrieval for recall, generation for
precision — is also how most production RAG systems are actually
structured; the failure mode came from trying to make a keyword
scorer do a job that needs either an LLM's judgment or real semantic
(embedding) similarity instead. See `retrieve()`'s docstring in
`app/knowledge/retrieval.py` for the worked numbers.

**If you want to go further than this repo does today**: swap BM25 for
embedding-based retrieval (e.g. a local `sentence-transformers` model,
or your LLM provider's embeddings endpoint if it has one) and RAG noise
like this mostly stops happening at the retrieval layer instead of
needing to be patched at the prompt layer. That wasn't done here
because this sandbox can't reach the model-weight download host to
verify it end-to-end — worth doing yourself once you're running
locally, and worth being able to explain the tradeoff either way in an
interview.

## Not built yet

- Navigation *actions* (the assistant currently tells the user where a
  page is, but doesn't programmatically route the frontend there).
- A production-grade rate-limit store (current one is in-memory,
  per-instance — fine for a single deployment, not for multiple
  instances behind a load balancer).
