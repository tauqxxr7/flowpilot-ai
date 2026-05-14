# Final Submission Checklist

Repository: https://github.com/tauqxxr7/flowpilot-ai

## Run Instructions

Backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'
npm run dev
```

Production build check:

```powershell
cd frontend
npm run build
```

## Demo Flow

1. Open `/` and introduce FlowPilot AI as a workflow orchestration platform, not a chatbot.
2. Open `/knowledge-base` and show seeded company context. Optionally upload a small `.txt` policy note.
3. Run the refund prompt and point out intent, confidence, source snippets, ticket ID, owner, and workflow action.
4. Run the escalation prompt and show that risk language routes to a human owner.
5. Open `/dashboard` and show category, confidence, escalation, and recent activity metrics.
6. Open `/tickets` and show persisted ticket history.
7. Open `/workflow-lab` and test a routing decision without creating a full ticket.

## Architecture Summary

FlowPilot AI follows this pipeline:

```text
Customer Query
-> Intent Detection
-> Knowledge Retrieval
-> AI Decision Engine
-> Workflow Router
-> Ticket / Escalation
-> Dashboard Analytics
```

The backend owns the workflow logic and persistence. The frontend presents the workflow as an operations console for support, sales, and customer success teams.

## Evaluation Criteria Mapping

- Innovation & Creativity: The project combines retrieval, routing, tickets, and analytics into one workflow system.
- Real-World Problem Solving: It reduces repetitive support triage while escalating risky cases to humans.
- Technical Architecture: It uses Next.js, FastAPI, SQLite, retrieval, Gemini integration hook, and API-driven dashboard pages.
- Documentation & Presentation: README, screenshots, architecture notes, setup docs, demo script, and this checklist are included.

## Screenshots Checklist

Stored in `assets/screenshots`:

- `copilot.png`
- `dashboard.png`
- `workflow-lab.png`
- `tickets.png`
- `knowledge-base.png`

## Final Repo Hygiene

- [ ] Repository is public
- [ ] `README.md` renders correctly on GitHub
- [ ] Screenshots render in README
- [ ] `.env.example` exists for backend and frontend
- [ ] `venv`, `node_modules`, `.next`, `__pycache__`, and SQLite DB files are ignored
- [ ] `npm run build` passes
- [ ] Backend `/health` returns OK
- [ ] Backend `/api/query` returns `ticket_id`, `intent`, `confidence`, `workflow`, and `sources`
