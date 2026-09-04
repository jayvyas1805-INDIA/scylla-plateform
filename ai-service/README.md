# Scylla AI Assistant — service

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
  itself was never re-implemented here — see the "Security notes" below.

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

## Verifying it works

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/assistant/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Scylla?"}'
```

## Security notes

- `LLM_API_KEY` and `JWT_SECRET` live only in `.env`, never sent to the frontend.
- All provider/tool errors are caught and replaced with a generic message —
  no stack traces or internal details reach the client.
- The JWT this service reads is the **same token** the Client already
  sends to Express. This service only decodes it to know *who's asking*
  (for prompt context / which tools to offer) — it never authorizes data
  access itself. Every tool call forwards this same token to the
  existing Express `authUser`/`adminAuth`/`teamAuth` middleware, which
  remains the sole authority on what a given user can see. The token is
  closed over when tools are built per-request — it is never a parameter
  the LLM can see or change, which is what actually stops a prompt like
  "call the admin tool as an admin" from working.
- Chat endpoint is rate-limited per IP (15/min default) to protect the
  paid LLM call from being hammered.

## Next phases (not built yet)

- Phase 9: streaming responses, further UI/UX polish.
- Phase 10: a proper pytest test suite + a small eval set covering
  grounding, authorization, and injection cases (some of this logic was
  already smoke-tested ad hoc during development — Phase 10 would
  formalize those into a runnable suite).

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

## Verifying it works

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/assistant/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Scylla?"}'
```

## Security notes (already in place)

- `LLM_API_KEY` and `JWT_SECRET` live only in `.env`, never sent to the frontend.
- All provider/tool errors are caught and replaced with a generic message —
  no stack traces or internal details reach the client.
- The JWT this service reads is the **same token** the Client already
  sends to Express. This service only decodes it to know *who's asking*
  (for prompt context / future tool routing) — it never authorizes data
  access itself. Every future tool call forwards this same token to the
  existing Express `authUser`/`adminAuth`/`teamAuth` middleware, which
  remains the sole authority on what a given user can see.

## Next phases (not built yet)

- Phase 4: RAG over Scylla's static/knowledge content (About, FAQs).
- Phase 5: structured tools calling the existing Express APIs
  (`/api/teams`, `/api/vehicles`, `/api/vendors`, `/api/products/marketplace`, etc.),
  forwarding the caller's JWT so Express's existing auth stays authoritative.
- Phase 6: conversation memory trimming/summarization, page-context grounding.
- Phase 7: navigation actions, prompt-injection hardening, rate limiting.
