# Deployment Notes

FlowPilot AI is prepared for split deployment: frontend on Vercel and backend on Render or Railway.

## Frontend: Vercel

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `frontend`.
3. Add the backend URL as `NEXT_PUBLIC_API_URL`.
4. Deploy.

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

1. Create a new Render web service from the GitHub repository.
2. Use `backend` as the root directory.
3. Use the build and start commands below.
4. Set `FLOWPILOT_ALLOWED_ORIGINS` to the deployed Vercel URL.
5. Add `GEMINI_API_KEY` only if live Gemini responses are needed.

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

Health check:

```text
/health
```

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
