# Submission Notes

## Repository

Suggested public repository name: `flowpilot-ai`

Suggested GitHub description:

> AI-powered business workflow orchestration platform with RAG-based support automation, intelligent ticket routing, multi-agent decision flows, and operational analytics.

## What Is Implemented

- Query intake
- Intent classification
- Knowledge retrieval with cited snippets
- Gemini integration hook with local fallback
- Workflow routing
- Ticket persistence
- Dashboard analytics
- Admin-style knowledge and ticket views

## What Is Honest MVP Scope

- Uploaded files are decoded as text in the first version. PDF parsing can be added with `pypdf`.
- Retrieval uses TF-IDF for dependable local setup. FAISS or Chroma can replace this layer without changing the API contract.
- Authentication is not included in this hackathon MVP.
- Screenshots should be generated from a local run before final submission.

## Submission Checklist

- [ ] Push public GitHub repo
- [ ] Add screenshots in `assets/screenshots`
- [ ] Confirm backend `/health`
- [ ] Confirm `/api/query` with at least two demo prompts
- [ ] Confirm frontend build
- [ ] Confirm frontend dev routes: `/`, `/dashboard`, `/knowledge-base`, `/tickets`, `/workflow-lab`
- [ ] Add deployed frontend/backend URLs if deployed

## Verified Locally

Local verification completed on Windows:

- `npm run build` completed successfully
- `uvicorn main:app --port 8000` served `/health`, `/api/query`, `/api/tickets`, and `/api/dashboard/stats`
- `uvicorn main:app --reload --port 8000` worked outside the restricted sandbox launcher
- `npm run dev` served all five frontend routes on `127.0.0.1:3000`
- frontend server-side pages reached the backend through `NEXT_PUBLIC_API_URL`
