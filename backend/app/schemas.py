from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    customer_name: str = Field(default="Demo Customer")
    message: str
    channel: str = Field(default="web")


class RouteRequest(BaseModel):
    intent: str
    confidence: float
    message: str


class SourceSnippet(BaseModel):
    id: str
    title: str
    source: str
    category: str
    snippet: str
    score: float


class WorkflowDecision(BaseModel):
    action: str
    confidence: float
    reason: str
    owner: str
    priority: str


class QueryResponse(BaseModel):
    ticket_id: str
    intent: str
    confidence: float
    response: str
    sources: list[SourceSnippet]
    workflow: WorkflowDecision


class DashboardStats(BaseModel):
    total_tickets: int
    resolved_by_ai: int
    escalated_tickets: int
    average_response_time_seconds: float
    confidence_distribution: dict[str, int]
    category_breakdown: dict[str, int]
    recent_activity: list[dict]
