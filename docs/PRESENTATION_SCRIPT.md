# Presentation Script

## 30-Second Intro

Hi, we are CodingGiants. Our project is FlowPilot AI, an AI-powered business workflow orchestration platform for the FlowZint AI Hackathon 2026.

The key idea is simple: most business bots answer questions, but real operations teams need the next workflow action. FlowPilot AI classifies the issue, retrieves business context, decides what should happen next, creates or routes the ticket, and updates the dashboard.

## Problem

Support and sales teams repeatedly handle refund requests, pricing questions, onboarding blockers, product issues, complaints, and escalation risks. A generic chatbot can draft a reply, but it usually cannot decide whether the case should be auto-resolved, sent to finance, escalated to a support lead, or routed to sales.

That is the gap FlowPilot AI addresses.

## 3-Minute Demo Narration

First, open the Knowledge Base page. This shows the business context FlowPilot can retrieve from. For the live demo, we can upload a small text policy note, but the repository also ships with seeded FlowZint-style support, pricing, onboarding, complaint, refund, and sales policies.

Now open the Copilot page.

Submit this customer issue:

```text
We were charged twice and the client is asking for a refund before renewal.
```

FlowPilot detects the refund intent, retrieves relevant policy context, creates a ticket, assigns the right owner, and shows cited snippets. The important part is that it does not blindly promise a refund; it routes the request for billing validation.

Next, submit:

```text
Our dashboard automation failed three times and the customer is threatening to escalate.
```

This time, FlowPilot detects product support context and escalation risk. The workflow action changes to human escalation, with high priority.

Now open the dashboard. The dashboard shows total tickets, escalations, confidence distribution, category breakdown, and recent workflow activity.

Open the ticket history page. Each workflow run leaves an auditable ticket record.

Open the knowledge base. These are the FlowZint-style policies used by retrieval.

Finally, open Workflow Lab. This lets an operator test routing decisions without creating a full ticket.

## Technical Architecture

The system uses a Next.js frontend and FastAPI backend. The backend owns the workflow pipeline:

```text
Customer Query
-> Intent Detection
-> Knowledge Retrieval
-> AI Decision Engine
-> Workflow Router
-> Ticket / Escalation
-> Dashboard Analytics
```

SQLite stores documents, tickets, and workflow logs. Retrieval is implemented with TF-IDF for a stable local MVP, and Gemini can be enabled through `GEMINI_API_KEY`.

## Closing

FlowPilot AI is not a chatbot demo. It is a practical AI operations MVP that shows how retrieval, routing, tickets, and analytics can work together to reduce repetitive support work while keeping risky cases in human control.
