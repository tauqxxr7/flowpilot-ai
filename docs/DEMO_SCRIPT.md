# Demo Script

Target duration: 3 minutes.

## 1. Open With The Problem

"Most business bots only answer the latest message. In real operations, the important question is what should happen next: can AI resolve it, should finance review it, should sales follow up, or should a human owner step in?"

## 2. Show Knowledge Ingestion

Open `/knowledge-base`.

Upload a small `.txt` or `.md` policy note if you want to demonstrate ingestion live. Explain that the MVP stores the uploaded document and makes it available to retrieval alongside the seeded FlowZint-style policies.

## 3. Show The Copilot

Open `/`.

Use this prompt:

> We were charged twice and the client is asking for a refund before renewal.

Point out:

- intent classification as refund
- source snippets from refund or billing policy
- workflow action is ticket creation instead of unsafe auto-refund
- owner is finance operations

## 4. Show A High-Risk Escalation

Use this prompt:

> Our dashboard automation failed three times and the customer is threatening to escalate.

Point out:

- the message is product support
- risk language changes the route
- the system escalates to a human owner
- the dashboard updates after the workflow run

## 5. Show Dashboard And Tickets

Open `/dashboard`, then `/tickets`.

Explain that each run leaves an operational record. This is the difference between a generic chatbot and a workflow copilot.

## 6. Show Knowledge Base

Open `/knowledge-base`.

Explain that the response is grounded in indexed business knowledge and can be extended by uploading policies, SOPs, FAQs, and PDFs.

## 7. Close

"FlowPilot AI is a hackathon MVP, but the architecture is production-minded: API-first backend, retrievable knowledge, auditable workflow decisions, and a dashboard for operations teams."

## Pre-Demo Checklist

- Backend running with `uvicorn main:app --reload --port 8000`
- Frontend running with `npm run dev`
- `NEXT_PUBLIC_API_URL` set to `http://127.0.0.1:8000` or `http://localhost:8000`
- At least two demo prompts submitted before showing dashboard metrics
- Screenshots captured in `assets/screenshots` if the submission form asks for images
