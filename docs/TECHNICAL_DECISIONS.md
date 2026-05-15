# Technical Decisions

## Why FastAPI

FastAPI gives the project a clean API layer for workflow orchestration. It is lightweight, typed with Pydantic, easy to run locally, and straightforward to deploy on Render or Railway.

## Why Next.js

Next.js is a good fit for a polished operations console. The project uses route-based pages for the Copilot, dashboard, knowledge base, tickets, and workflow lab, while keeping interactive workflow surfaces in client components.

## Why SQLite For The MVP

SQLite keeps the demo easy to clone and run. It is enough for documents, demo tickets, workflow logs, and dashboard statistics. The schema is intentionally simple so it can move to PostgreSQL without changing the frontend contract.

## Why Deterministic Fallback Exists

Hackathon demos should not fail because an API key is missing or rate-limited. Gemini is supported through `GEMINI_API_KEY`, but the backend can still produce grounded, policy-based responses from retrieved context.

## Scaling Path

For a production version:

- PostgreSQL for persistent ticket, user, and workflow data
- Redis or a queue worker for document ingestion jobs
- Chroma, FAISS, Pinecone, or pgvector for retrieval
- Object storage for uploaded documents
- Authentication and tenant isolation for admin routes
- WebSockets or polling for live dashboard updates
