# Deployment Notes

FlowPilot AI is prepared for split deployment: frontend on Vercel and backend on Render or Railway.

## Frontend: Vercel

Root directory:

```text
frontend
```

Build command:

```bash
npm run build
```

Install command:

```bash
npm install
```

Environment variable:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.example.com
```

The frontend reads `NEXT_PUBLIC_API_URL` first and falls back to `NEXT_PUBLIC_API_BASE_URL`, then `http://localhost:8000`.

## Backend: Render

The backend includes `backend/render.yaml`.

Root directory:

```text
backend
```

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Environment variables:

```text
FLOWPILOT_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
GEMINI_API_KEY=optional
```

`GEMINI_API_KEY` is optional. The backend has a deterministic fallback response path so the demo works without a model key.

## Backend: Railway

Set the backend service root to `backend` and use:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set the same environment variables as Render.

## Production Notes

- Use a managed PostgreSQL database for persistent production data.
- Replace TF-IDF retrieval with a vector database for larger knowledge bases.
- Add authentication before exposing admin upload routes publicly.
- Keep `FLOWPILOT_ALLOWED_ORIGINS` restricted to the deployed frontend URL.
