"""
Application-level rate limiting.

This protects the LLM endpoint from excessive requests.

Note:
This is separate from Groq's token-per-minute limit.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[]
)