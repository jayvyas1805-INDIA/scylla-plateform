"""
Practical evaluation harness.

Runs every case in eval_set.json against the REAL configured LLM
(reads LLM_API_KEY from .env same as the app) and the REAL tool layer
(which will call your actual Express backend — make sure it's running
locally, or expect the "unavailable" tool-error paths to fire instead,
which most of the grounding/authorization cases are checking for
anyway).

Grading is deliberately simple (substring/keyword checks), not a
separate LLM-as-judge, so the harness itself doesn't need its own
extra provider call or API key — good enough to catch a real
regression (e.g. the model suddenly inventing a sponsor name) without
adding cost or flakiness. Extend by adding more cases to eval_set.json;
no code changes needed for a new case.

Usage:
    cd ai-service
    source .venv/bin/activate
    python -m eval.run_eval
"""

import asyncio
import json
import time
from pathlib import Path

from app.orchestrator.chain import run_chat
from app.schemas import ChatRequest, ChatTurn
from app.security import Caller

EVAL_SET_PATH = Path(__file__).parent / "eval_set.json"

CALLERS = {
    "public": Caller(raw_token=None, role=None, user_id=None),
    "member": Caller(raw_token="fake-token-not-verifiable-here", role="MEMBER", user_id="eval-user"),
    "admin": Caller(raw_token="fake-token-not-verifiable-here", role="admin", user_id="eval-admin"),
}


def _grade(reply: str, case: dict) -> tuple[bool, str]:
    lower = reply.lower()

    for phrase in case.get("must_include_any", []):
        if phrase.lower() in lower:
            break
    else:
        if case.get("must_include_any"):
            return False, f"missing any of: {case['must_include_any']}"

    for phrase in case.get("must_not_include_any", []):
        if phrase.lower() in lower:
            return False, f"contained forbidden phrase: {phrase!r}"

    return True, "ok"


async def run_case(case: dict) -> dict:
    history = [ChatTurn(**turn) for turn in case.get("history", [])]
    request = ChatRequest(message=case["query"], history=history)
    caller = CALLERS[case.get("caller", "public")]

    start = time.monotonic()
    try:
        reply = await run_chat(request, caller)
        error = None
    except Exception as exc:  # eval harness itself must not crash on one bad case
        reply = ""
        error = str(exc)
    latency_s = time.monotonic() - start

    passed, reason = (False, error) if error else _grade(reply, case)

    return {
        "id": case["id"],
        "category": case["category"],
        "passed": passed,
        "reason": reason,
        "latency_s": round(latency_s, 2),
        "reply_preview": reply[:200],
    }


async def main():
    cases = json.loads(EVAL_SET_PATH.read_text())
    results = [await run_case(case) for case in cases]

    print(f"\n{'ID':<28} {'CATEGORY':<14} {'RESULT':<6} {'LATENCY':<8} REASON")
    print("-" * 100)
    for r in results:
        status = "PASS" if r["passed"] else "FAIL"
        print(f"{r['id']:<28} {r['category']:<14} {status:<6} {r['latency_s']:<8} {r['reason']}")

    passed = sum(1 for r in results if r["passed"])
    print("-" * 100)
    print(f"{passed}/{len(results)} passed\n")

    for r in results:
        if not r["passed"]:
            print(f"[{r['id']}] reply preview: {r['reply_preview']!r}\n")


if __name__ == "__main__":
    asyncio.run(main())
