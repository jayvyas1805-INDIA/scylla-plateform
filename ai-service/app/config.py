"""
Central configuration for the Scylla AI Assistant service.

Every value that could change between environments (dev/staging/prod) or
that is a secret lives in .env — nothing is hardcoded here. This is what
lets you swap LLM providers/models later without touching code.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def _split_origins(raw: str) -> list[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]


def _load_llm_fallbacks(max_fallbacks: int = 5) -> list[dict]:
    """
    Reads LLM_FALLBACK_1_*, LLM_FALLBACK_2_*, ... from the environment.
    A fallback is only used if its BASE_URL, MODEL and API_KEY are all set,
    so unused slots (or providers you haven't signed up for yet) are
    silently skipped.
    """
    fallbacks = []
    for n in range(1, max_fallbacks + 1):
        base_url = os.getenv(f"LLM_FALLBACK_{n}_BASE_URL", "").strip()
        model = os.getenv(f"LLM_FALLBACK_{n}_MODEL", "").strip()
        api_key = os.getenv(f"LLM_FALLBACK_{n}_API_KEY", "").strip()
        if base_url and model and api_key:
            fallbacks.append({"base_url": base_url, "model": model, "api_key": api_key})
    return fallbacks


class Settings:
    # --- LLM provider (OpenAI-compatible endpoint) ---
    # Works unchanged for Groq, Together AI, Fireworks, OpenRouter, or a
    # local Ollama server — they all expose an OpenAI-compatible
    # /chat/completions API. Swapping providers = editing these 3 values.
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))

    # Seconds to wait on a provider before giving up on it and failing over.
    # For streaming this is the max silence between chunks, which includes
    # the model's "thinking" time before its first token. Raise it if a
    # slow-but-working provider keeps getting skipped.
    LLM_TIMEOUT: float = float(os.getenv("LLM_TIMEOUT", "20"))

    # Optional: "low" / "medium" / "high". Sent ONLY to Groq gpt-oss models
    # (the reasoning-effort knob); lower = faster first token, possibly
    # weaker tool selection. Empty = provider default. Re-run the eval
    # (python -m eval.run_eval) after changing it.
    LLM_REASONING_EFFORT: str = os.getenv("LLM_REASONING_EFFORT", "").strip().lower()

    # Tried in order when the primary above fails (rate limit, outage,
    # timeout, retired model). Same three values per slot, see .env.example.
    LLM_FALLBACKS: list[dict] = _load_llm_fallbacks()

    # --- Existing Scylla backend (source of truth for data + auth) ---
    SCYLLA_BACKEND_URL: str = os.getenv("SCYLLA_BACKEND_URL", "http://localhost:5000")

    # Must be the SAME secret as the Express backend's JWT_SECRET.
    # Used ONLY to read who is talking to us (for prompt/role context and
    # routing decisions) — it is never used to mint tokens, and it never
    # replaces Express's own verification when a tool call actually hits
    # a protected Express route. Express remains the sole authority on
    # whether a request is allowed to see data.
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")

    # --- CORS ---
    ALLOWED_ORIGINS: list[str] = _split_origins(
        os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174")
    )

    # --- Conversation memory ---
    MAX_HISTORY_TURNS: int = int(os.getenv("MAX_HISTORY_TURNS", "6"))

    # --- Misc ---
    ENV: str = os.getenv("ENV", "development")


settings = Settings()
