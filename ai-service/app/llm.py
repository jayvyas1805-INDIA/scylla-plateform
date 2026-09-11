"""
LLM provider abstraction.

Every provider we care about (Groq, Together AI, Fireworks, OpenRouter,
local Ollama) speaks the same OpenAI-compatible chat-completions API, so
one LangChain client class covers all of them. Which provider is active
is purely a config.py/.env concern — this file should never need to
change when you switch providers or models.
"""

from langchain_openai import ChatOpenAI
from app.config import settings


def get_llm(temperature: float | None = None) -> ChatOpenAI:
    if not settings.LLM_API_KEY:
        raise RuntimeError(
            "LLM_API_KEY is not set. Add it to ai-service/.env "
            "(see .env.example)."
        )

    return ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.LLM_API_KEY,
        base_url=settings.LLM_BASE_URL,
        temperature=temperature if temperature is not None else settings.LLM_TEMPERATURE,
        timeout=30,
        max_retries=2,
    )
