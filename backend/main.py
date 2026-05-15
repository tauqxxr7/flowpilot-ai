from __future__ import annotations

import uuid
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.engine import dashboard_stats, handle_query, route_workflow
from app.schemas import DashboardStats, QueryRequest, QueryResponse, RouteRequest, WorkflowDecision
from app.storage import add_document, init_db, list_documents, list_tickets, list_workflow_logs


def allowed_origins() -> list[str]:
    configured = os.getenv("FLOWPILOT_ALLOWED_ORIGINS")
    if configured:
        return [origin.strip() for origin in configured.split(",") if origin.strip()]
    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="FlowPilot AI API",
    description="Business workflow orchestration API for RAG support automation and ticket routing.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "flowpilot-ai-api"}


@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)) -> dict[str, str]:
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    doc_id = f"upload-{uuid.uuid4().hex[:8]}"
    add_document(
        {
            "id": doc_id,
            "title": file.filename or "Uploaded document",
            "source": "Admin upload",
            "category": "uploaded",
            "content": text[:8000],
        }
    )
    return {"id": doc_id, "status": "indexed", "filename": file.filename or "document.txt"}


@app.get("/api/documents")
def documents() -> list[dict]:
    return list_documents()


@app.post("/api/query", response_model=QueryResponse)
def query(payload: QueryRequest) -> dict:
    return handle_query(payload)


@app.get("/api/tickets")
def tickets() -> list[dict]:
    return list_tickets()


@app.get("/api/dashboard/stats", response_model=DashboardStats)
def stats() -> dict:
    return dashboard_stats()


@app.post("/api/workflows/route", response_model=WorkflowDecision)
def workflow_route(payload: RouteRequest) -> WorkflowDecision:
    return route_workflow(payload.intent, payload.confidence, payload.message)


@app.get("/api/workflows/logs")
def workflow_logs() -> list[dict]:
    return list_workflow_logs()
