from __future__ import annotations

import os
import time
import uuid
from collections import Counter
from datetime import datetime, timezone
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .schemas import DecisionTimelineItem, QueryRequest, SourceSnippet, WorkflowDecision
from .storage import insert_ticket, list_documents, list_tickets

INTENT_KEYWORDS = {
    "refund": ["refund", "cancel", "charged", "billing", "invoice", "duplicate", "money"],
    "pricing": ["price", "pricing", "plan", "subscription", "cost", "enterprise"],
    "product support": ["bug", "broken", "error", "integration", "dashboard", "automation", "failed"],
    "onboarding": ["onboard", "setup", "invite", "import", "training", "activate"],
    "complaint": ["angry", "delay", "unhappy", "complaint", "escalate", "churn", "trust"],
    "sales inquiry": ["demo", "sales", "quote", "buy", "evaluate", "procurement", "pilot"],
}


def classify_intent(message: str) -> tuple[str, float]:
    text = message.lower()
    scores = {
        intent: sum(1 for keyword in keywords if keyword in text)
        for intent, keywords in INTENT_KEYWORDS.items()
    }
    intent, hits = max(scores.items(), key=lambda item: item[1])
    if hits == 0:
        return "product support", 0.52
    return intent, min(0.96, 0.58 + hits * 0.12)


def retrieve_sources(message: str, limit: int = 3) -> list[SourceSnippet]:
    docs = list_documents()
    if not docs:
        return []

    corpus = [doc["content"] for doc in docs]
    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(corpus + [message])
    similarities = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    ranked = sorted(enumerate(similarities), key=lambda item: item[1], reverse=True)[:limit]

    snippets: list[SourceSnippet] = []
    for index, score in ranked:
        doc = docs[index]
        snippet = doc["content"][:280].strip()
        snippets.append(
            SourceSnippet(
                id=doc["id"],
                title=doc["title"],
                source=doc["source"],
                category=doc["category"],
                snippet=snippet,
                score=round(float(score), 3),
            )
        )
    return snippets


def route_workflow(intent: str, confidence: float, message: str) -> WorkflowDecision:
    text = message.lower()
    high_risk_terms = ["churn", "legal", "angry", "unacceptable", "escalate", "executive", "outage"]

    if any(term in text for term in high_risk_terms) or confidence < 0.58:
        return WorkflowDecision(
            action="escalate_to_human",
            confidence=round(max(confidence - 0.08, 0.45), 2),
            reason="Customer risk language or low automation confidence requires a human owner.",
            owner="Support Lead",
            priority="high",
        )
    if intent == "refund":
        return WorkflowDecision(
            action="create_ticket",
            confidence=round(confidence, 2),
            reason="Refund requests need billing validation before a final promise is made.",
            owner="Finance Operations",
            priority="medium",
        )
    if intent in {"sales inquiry", "pricing"}:
        return WorkflowDecision(
            action="send_follow_up",
            confidence=round(confidence, 2),
            reason="Commercial context should be captured and routed to sales with the source message.",
            owner="Sales",
            priority="medium",
        )
    if intent == "complaint":
        return WorkflowDecision(
            action="mark_high_risk_customer",
            confidence=round(confidence, 2),
            reason="Complaint language should be tracked until closure to reduce churn risk.",
            owner="Customer Success",
            priority="high",
        )
    return WorkflowDecision(
        action="auto_resolve",
        confidence=round(confidence, 2),
        reason="The retrieved support context is enough to give a grounded first response.",
        owner="AI Operations Queue",
        priority="low",
    )


def build_response(message: str, intent: str, sources: list[SourceSnippet], workflow: WorkflowDecision) -> str:
    source_context = " ".join(source.snippet for source in sources[:2])
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                "Write a concise business support response grounded only in this context. "
                f"Intent: {intent}. Customer message: {message}. Context: {source_context}. "
                f"Workflow action: {workflow.action}. Avoid unsupported claims."
            )
            generated = model.generate_content(prompt)
            if generated.text:
                return generated.text.strip()
        except Exception:
            pass

    if not sources:
        return "I could not find enough verified company context for this issue. I have routed it for human review."

    return (
        f"Thanks for sharing the details. I matched this as a {intent} case and checked the relevant "
        f"FlowZint operations context. Based on {sources[0].title}, the next step is: "
        f"{workflow.reason} We will keep the response grounded in the saved policy notes and avoid making "
        "commitments that need manual approval."
    )


def timeline_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def build_decision_timeline(
    payload: QueryRequest,
    ticket_id: str,
    intent: str,
    confidence: float,
    sources: list[SourceSnippet],
    workflow: WorkflowDecision,
) -> list[DecisionTimelineItem]:
    source_titles = [source.title for source in sources]
    return [
        DecisionTimelineItem(
            step=1,
            title="Customer Query Received",
            description=f"A customer issue was received from the {payload.channel} channel.",
            status="completed",
            metadata={"channel": payload.channel, "customer": payload.customer_name},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=2,
            title="Intent Detected",
            description=f"The message was classified as a {intent} workflow.",
            status="completed",
            metadata={"intent": intent, "confidence": round(confidence, 2)},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=3,
            title="Knowledge Sources Retrieved",
            description="Relevant policy snippets were retrieved from the knowledge base.",
            status="completed",
            metadata={"sources": len(sources), "source_titles": source_titles},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=4,
            title="AI Decision Generated",
            description="FlowPilot prepared a grounded support response using retrieved business context.",
            status="completed",
            metadata={"response_mode": "gemini" if os.getenv("GEMINI_API_KEY") else "deterministic_fallback"},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=5,
            title="Confidence Scored",
            description="The workflow confidence was scored before selecting an operational action.",
            status="completed",
            metadata={"confidence": round(confidence, 2), "decision_confidence": workflow.confidence},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=6,
            title="Workflow Route Selected",
            description=workflow.reason,
            status="completed",
            metadata={"action": workflow.action, "priority": workflow.priority, "owner": workflow.owner},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=7,
            title="Ticket Created / Escalated",
            description=f"Ticket {ticket_id} was created with owner {workflow.owner}.",
            status="completed",
            metadata={"ticket_id": ticket_id, "owner": workflow.owner, "priority": workflow.priority},
            timestamp=timeline_timestamp(),
        ),
        DecisionTimelineItem(
            step=8,
            title="Dashboard Updated",
            description="The ticket and workflow event are now available to operational dashboard views.",
            status="completed",
            metadata={"dashboard_metric": "ticket_count", "workflow_log": "recorded"},
            timestamp=timeline_timestamp(),
        ),
    ]


def handle_query(payload: QueryRequest) -> dict[str, Any]:
    started = time.perf_counter()
    intent, confidence = classify_intent(payload.message)
    sources = retrieve_sources(payload.message)
    workflow = route_workflow(intent, confidence, payload.message)
    response = build_response(payload.message, intent, sources, workflow)
    ticket_id = f"FP-{uuid.uuid4().hex[:8].upper()}"
    decision_timeline = build_decision_timeline(payload, ticket_id, intent, confidence, sources, workflow)
    elapsed = round(time.perf_counter() - started, 3)

    insert_ticket(
        {
            "id": ticket_id,
            "customer_name": payload.customer_name,
            "channel": payload.channel,
            "message": payload.message,
            "intent": intent,
            "confidence": confidence,
            "response": response,
            "action": workflow.action,
            "priority": workflow.priority,
            "owner": workflow.owner,
            "response_time_seconds": elapsed,
        },
        workflow.reason,
    )

    return {
        "ticket_id": ticket_id,
        "intent": intent,
        "confidence": round(confidence, 2),
        "response": response,
        "sources": sources,
        "workflow": workflow,
        "decision_timeline": decision_timeline,
    }


def dashboard_stats() -> dict[str, Any]:
    tickets = list_tickets()
    total = len(tickets)
    resolved = sum(1 for ticket in tickets if ticket["action"] == "auto_resolve")
    escalated = sum(1 for ticket in tickets if ticket["action"] in {"escalate_to_human", "mark_high_risk_customer"})
    avg_response = round(
        sum(ticket["response_time_seconds"] for ticket in tickets) / total,
        3,
    ) if total else 0.0
    avg_confidence = round(
        sum(ticket["confidence"] for ticket in tickets) / total,
        2,
    ) if total else 0.0

    buckets = Counter()
    for ticket in tickets:
        confidence = ticket["confidence"]
        if confidence >= 0.8:
            buckets["high"] += 1
        elif confidence >= 0.6:
            buckets["medium"] += 1
        else:
            buckets["low"] += 1

    categories = Counter(ticket["intent"] for ticket in tickets)
    recent = [
        {
            "id": ticket["id"],
            "intent": ticket["intent"],
            "action": ticket["action"],
            "priority": ticket["priority"],
            "created_at": ticket["created_at"],
        }
        for ticket in tickets[:6]
    ]

    return {
        "total_tickets": total,
        "resolved_by_ai": resolved,
        "escalated_tickets": escalated,
        "average_response_time_seconds": avg_response,
        "average_confidence": avg_confidence,
        "confidence_distribution": dict(buckets),
        "category_breakdown": dict(categories),
        "recent_activity": recent,
    }
