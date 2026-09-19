"""
Central configuration for the Scylla AI Assistant service.

All environment-specific values and secrets come from .env / deployment
environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def _split_origins(raw: str) -> list[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]


def _load_llm_fallbacks(max_fallbacks: int = 5) -> list[dict]:
    """
    Reads:
        LLM_FALLBACK_1_BASE_URL
        LLM_FALLBACK_1_MODEL
        LLM_FALLBACK_1_API_KEY

    etc.

    A fallback is enabled only when all three values exist.
    """
    fallbacks = []

    for n in range(1, max_fallbacks + 1):
        base_url = os.getenv(
            f"LLM_FALLBACK_{n}_BASE_URL",
            ""
        ).strip()

        model = os.getenv(
            f"LLM_FALLBACK_{n}_MODEL",
            ""
        ).strip()

        api_key = os.getenv(
            f"LLM_FALLBACK_{n}_API_KEY",
            ""
        ).strip()

        if base_url and model and api_key:
            fallbacks.append(
                {
                    "base_url": base_url,
                    "model": model,
                    "api_key": api_key,
                }
            )

    return fallbacks


class Settings:
    # ---------------------------------------------------------
    # Primary LLM
    # ---------------------------------------------------------

    LLM_PROVIDER: str = os.getenv(
        "LLM_PROVIDER",
        "groq"
    )

    LLM_MODEL: str = os.getenv(
        "LLM_MODEL",
        "openai/gpt-oss-120b"
    )

    LLM_API_KEY: str = os.getenv(
        "LLM_API_KEY",
        ""
    )

    LLM_BASE_URL: str = os.getenv(
        "LLM_BASE_URL",
        "https://api.groq.com/openai/v1"
    )

    LLM_TEMPERATURE: float = float(
        os.getenv("LLM_TEMPERATURE", "0.3")
    )

    # ---------------------------------------------------------
    # Timeout
    # ---------------------------------------------------------

    LLM_TIMEOUT: float = float(
        os.getenv("LLM_TIMEOUT", "30")
    )

    # ---------------------------------------------------------
    # Groq reasoning effort
    # ---------------------------------------------------------

    LLM_REASONING_EFFORT: str = os.getenv(
        "LLM_REASONING_EFFORT",
        ""
    ).strip().lower()

    # ---------------------------------------------------------
    # Fallback providers
    # ---------------------------------------------------------

    LLM_FALLBACKS: list[dict] = _load_llm_fallbacks()

    # ---------------------------------------------------------
    # Scylla backend
    # ---------------------------------------------------------

    SCYLLA_BACKEND_URL: str = os.getenv(
        "SCYLLA_BACKEND_URL",
        "http://localhost:5000"
    )

    # ---------------------------------------------------------
    # JWT
    # ---------------------------------------------------------

    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        ""
    )

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------

    ALLOWED_ORIGINS: list[str] = _split_origins(
        os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://localhost:5174"
        )
    )

    # ---------------------------------------------------------
    # Conversation memory
    # ---------------------------------------------------------

    MAX_HISTORY_TURNS: int = int(
        os.getenv(
            "MAX_HISTORY_TURNS",
            "4"
        )
    )

    # Maximum characters of retrieved DB/context information
    MAX_CONTEXT_CHARS: int = int(
        os.getenv(
            "MAX_CONTEXT_CHARS",
            "8000"
        )
    )

    # ---------------------------------------------------------
    # API rate limiting
    # ---------------------------------------------------------

    RATE_LIMIT: str = os.getenv(
        "RATE_LIMIT",
        "10/minute"
    )

    # ---------------------------------------------------------
    # Environment
    # ---------------------------------------------------------

    ENV: str = os.getenv(
        "ENV",
        "development"
    )

    # --- Document-review (RAG) endpoint ---
    # Server-to-server only (Express -> ai-service, right after a doc is
    # uploaded). Must match backend/.env's INTERNAL_SERVICE_SECRET.
    INTERNAL_SERVICE_SECRET: str = os.getenv("INTERNAL_SERVICE_SECRET", "")


settings = Settings()