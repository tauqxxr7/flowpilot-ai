# FlowPilot AI Architecture

FlowPilot AI is structured as a small but complete business operations system. The frontend is a Next.js console for operators, and the backend is a FastAPI service that owns knowledge retrieval, intent detection, workflow routing, ticket persistence, and dashboard analytics.

```mermaid
flowchart LR
    A[Customer Query] --> B[Intent Classifier]
    B --> C[Knowledge Retrieval]
    C --> D[AI Decision Engine]
    D --> E[Workflow Router]
    E --> F[Ticket / Escalation]
    F --> G[Analytics Dashboard]
```

## Backend

The backend starts with seeded FlowZint-style support, pricing, onboarding, sales, complaint, and refund content. Documents are stored in SQLite and retrieved using TF-IDF vector search for the MVP. This keeps the local demo stable without hiding the retrieval layer behind a fake response.

The query pipeline is:

1. Receive customer issue through `POST /api/query`
2. Detect business intent from the message
3. Retrieve relevant knowledge snippets
4. Generate a grounded response with Gemini when `GEMINI_API_KEY` is configured
5. Fall back to a deterministic policy-based response when Gemini is unavailable
6. Route the workflow action
7. Store the ticket and workflow log
8. Expose updated dashboard metrics

## Frontend

The frontend exposes five judge-facing routes:

- `/` for the main operations copilot
- `/dashboard` for metrics and recent activity
- `/knowledge-base` for indexed policy data
- `/tickets` for ticket history
- `/workflow-lab` for testing routing decisions directly

## Data Model

SQLite tables:

- `documents`: indexed business knowledge
- `tickets`: customer messages, classifier output, responses, owners, and priorities
- `workflow_logs`: routing action history

The shape is intentionally PostgreSQL-ready: IDs are explicit, rows are normalized enough for a demo, and routing logs are separated from tickets.
