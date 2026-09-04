from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(max_length=4000)


class PageContext(BaseModel):
    """Optional, non-sensitive info about where the user currently is."""
    route: str | None = None
    entity_type: str | None = None  # e.g. "team", "vehicle", "vendor"
    entity_id: str | None = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)
    page_context: PageContext | None = None


class ChatResponse(BaseModel):
    reply: str
    role_used: str | None = None
