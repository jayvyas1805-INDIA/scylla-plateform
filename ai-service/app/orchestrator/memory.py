"""
Conversation memory management.

The Client already sends the visible message history on every request
(see schemas.ChatRequest.history, capped at 20 turns). That alone is
"unlimited history" if we just forward all of it — this module is what
implements the master prompt's "do not send unlimited history to the
LLM; use sensible context management" requirement:

- Short conversations: pass turns through as-is.
- Long conversations: collapse everything except the most recent turns
  into one short LLM-generated summary, so entities mentioned earlier
  ("the engineering department", "that vehicle") are still resolvable
  without re-sending every prior message on every turn.
"""

from langchain_core.messages import HumanMessage

from app.llm import get_llm
from app.schemas import ChatTurn

SUMMARY_PROMPT = """Summarize the following conversation between a user and the \
Scylla AI Assistant in 2-3 short sentences. Preserve any concrete named entities \
(team names, vehicle names, vendor names, member names) mentioned, since later \
turns may refer back to them by pronoun. Do not add any information that wasn't \
in the conversation.

Conversation:
{convo}
"""


async def summarize_turns(turns: list[ChatTurn]) -> str:
    convo = "\n".join(f"{t.role}: {t.content}" for t in turns)
    llm = get_llm(temperature=0)
    result = await llm.ainvoke([HumanMessage(content=SUMMARY_PROMPT.format(convo=convo))])
    return result.content


async def build_memory_context(history: list[ChatTurn], recent_turns_kept: int) -> tuple[str | None, list[ChatTurn]]:
    """Returns (summary_or_none, turns_to_render_in_full)."""
    if len(history) <= recent_turns_kept + 4:
        # Short enough that summarizing would cost more than it saves.
        return None, history

    older, recent = history[:-recent_turns_kept], history[-recent_turns_kept:]
    summary = await summarize_turns(older)
    return summary, recent
