from pydantic import BaseModel, Field


class RuleInput(BaseModel):
    text: str
    mandatory: bool = True


class DocumentReviewRequest(BaseModel):
    docType: str = Field(pattern="^(team|vendor)$")
    docUrl: str
    # The Express backend fetches these from MongoDB (ApprovalRule) and
    # sends them here rather than ai-service calling back into Express —
    # one direction of server-to-server traffic, one thing that can fail.
    rules: list[RuleInput] = Field(default_factory=list)


class DocumentReviewResponse(BaseModel):
    suggestion: str = Field(pattern="^(approve|reject|review)$")
    confidence: float = Field(ge=0, le=1)
    reasoning: str
    flaggedRules: list[str] = Field(default_factory=list)
