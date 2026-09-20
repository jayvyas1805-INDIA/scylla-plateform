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
    """The compliance verdict for a single verification document."""

    suggestion: str = Field(
        pattern="^(approve|reject|review)$",
        description="'approve' if the document satisfies every applicable rule, "
        "'reject' if it clearly fails a mandatory rule, 'review' if you are not "
        "confident either way and a human should look at it.",
    )
    confidence: float = Field(ge=0, le=1, description="How confident you are in this suggestion, 0-1.")
    reasoning: str = Field(description="2-4 sentences an admin can read quickly explaining why.")
    flaggedRules: list[str] = Field(
        default_factory=list,
        description="Exact text of every rule the document failed or could not be verified against.",
    )
