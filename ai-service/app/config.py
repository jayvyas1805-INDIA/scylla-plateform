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


class Settings:
    # --- LLM provider (OpenAI-compatible endpoint) ---
    # Works unchanged for Groq, Together AI, Fireworks, OpenRouter, or a
    # local Ollama server — they all expose an OpenAI-compatible
    # /chat/completions API. Swapping providers = editing these 3 values.
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))

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
