"""
In-memory rate limiting via slowapi. Deliberately not backed by Redis or
any external store — for a single-instance deployment this is the
simplest thing that provides real protection against someone hammering
the (paid, per-token) LLM endpoint. If you scale to multiple instances
later, swap the storage_uri to a shared Redis without touching callers.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=[])
