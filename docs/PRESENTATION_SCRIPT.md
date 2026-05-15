# Presentation Script

## 30-Second Intro

Most AI support bots only reply. FlowPilot AI converts a customer issue into an explainable business workflow.

For a growing SaaS business, that means a refund request, pricing question, onboarding blocker, or support escalation does not stop at a generated answer. FlowPilot detects intent, retrieves business context, scores confidence, selects a workflow route, creates or escalates the ticket, and updates the operations dashboard.

## 2-Minute Demo Script

1. Open `/dashboard`.
   - "This is the operations view. Before we type anything, FlowPilot already shows ticket volume, escalation load, confidence, categories, and recent activity from seeded demo workflows."

2. Open `/knowledge-base`.
   - "These are the business documents used for grounding. The system is designed around company context, not generic answers."

3. Open `/workflow-lab`.
   - Enter: `We were charged twice and need a refund before renewal.`
   - Click `Run workflow replay`.

4. Show the result.
   - "The intent is detected as refund."
   - "The response is grounded in retrieved billing and refund policy sources."
   - "Confidence is scored before action is selected."
   - "The workflow route is ticket creation for Finance Operations, because refund cases need validation."

5. Zoom into Live Workflow Replay.
   - "This is the main point of the product. FlowPilot shows the whole decision path: customer query, intent detection, knowledge retrieval, AI decision, confidence scoring, workflow routing, ticket creation, and dashboard update."
   - "A normal chatbot hides this process. FlowPilot makes it inspectable."

6. Open `/tickets`.
   - "The workflow output is persisted as an operational ticket, not just a chat message."

7. Return to `/dashboard`.
   - "The dashboard reflects the workflow activity so an operations lead can track what AI resolved, what was escalated, and where risk is building."

## Architecture Explanation

Customer query -> retrieval -> decision engine -> workflow router -> ticket or escalation -> dashboard analytics.

The frontend is a Next.js operations console. The backend is a FastAPI workflow API. SQLite stores demo documents, tickets, and workflow logs. Retrieval uses TF-IDF for a stable MVP, Gemini is optional through `GEMINI_API_KEY`, and a deterministic fallback keeps demos reliable.

## Closing Statement

FlowPilot AI is not a chatbot. It is an AI workflow orchestration layer for business operations.
