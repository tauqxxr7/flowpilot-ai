# Known Limitations

FlowPilot AI is a hackathon MVP, so the scope is intentionally honest.

- Demo data is seeded locally to make the dashboard useful during judging.
- SQLite is used for local persistence; production should use PostgreSQL.
- Uploaded documents are treated as text-like files. PDF parsing is not implemented yet.
- There is no production authentication or multi-tenant isolation.
- Gemini is optional; without `GEMINI_API_KEY`, the deterministic fallback is used.
- Retrieval uses TF-IDF rather than a production vector database.
- Dashboard updates after API requests and page refreshes; WebSocket live updates are future work.
