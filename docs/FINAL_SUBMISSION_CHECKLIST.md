# Final Submission Checklist

Live Demo: https://flowpilot-ai-one.vercel.app  
Backend Health: https://flowpilot-ai-zndh.onrender.com/health  
Backend API: https://flowpilot-ai-zndh.onrender.com  
GitHub: https://github.com/tauqxxr7/flowpilot-ai

## Confirmed Production Routes

- [x] Dashboard: https://flowpilot-ai-one.vercel.app/dashboard
- [x] Tickets: https://flowpilot-ai-one.vercel.app/tickets
- [x] Knowledge Base: https://flowpilot-ai-one.vercel.app/knowledge-base
- [x] Workflow Lab: https://flowpilot-ai-one.vercel.app/workflow-lab

## Confirmed Workflow Test

Prompt:

```text
We were charged twice and need a refund before renewal.
```

Verified on production:

- [x] intent appears
- [x] confidence appears
- [x] ticket ID appears
- [x] source snippets appear
- [x] workflow replay appears
- [x] no visible frontend error
- [x] no backend/CORS error

Backend API evidence:

```text
GET /health -> ok
POST /api/query -> refund intent, create_ticket action, 0.82 confidence, ticket ID, 3 sources, 8 replay steps
```

## Demo Flow

1. Open dashboard.
2. Open knowledge base.
3. Open workflow lab.
4. Run the refund query.
5. Zoom into routing result.
6. Show workflow replay / decision trail.
7. Open tickets.
8. Close with: "Intent detection -> source lookup -> decision engine -> workflow router -> ticket/escalation -> dashboard review."

## Final Repo Hygiene

- [x] Repository is public
- [x] README contains live demo and backend health links
- [x] `.env.example` exists for backend and frontend
- [x] `NEXT_PUBLIC_API_URL` points to `https://flowpilot-ai-zndh.onrender.com` in Vercel
- [x] `FLOWPILOT_ALLOWED_ORIGINS` includes `https://flowpilot-ai-one.vercel.app` in Render
- [x] `venv`, `node_modules`, `.next`, `__pycache__`, and SQLite DB files are ignored

## Freeze Warning

No more feature changes unless something is broken. From here, only deploy fixes, documentation corrections, or emergency bug fixes should be made.
