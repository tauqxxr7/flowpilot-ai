# Deployment Notes

FlowPilot AI is prepared for split deployment: frontend on Vercel and backend on Render or Railway.

## Deployment Order

Deploy the backend first, copy its public URL, then deploy the frontend with that URL as `NEXT_PUBLIC_API_URL`.

## Frontend: Vercel

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `frontend`.
3. Keep the framework preset as Next.js.
4. Add the backend URL as `NEXT_PUBLIC_API_URL`.
5. Deploy.

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
NEXT_PUBLIC_API_URL=https://flowpilot-ai-zndh.onrender.com
```

The frontend reads `NEXT_PUBLIC_API_URL`. If it is not set, it falls back to `http://localhost:8000` for local development only.

After deployment, open the Vercel URL and confirm the browser can reach:

```text
/dashboard
/workflow-lab
/tickets
```

## Backend: Render

The backend includes `backend/render.yaml`.

Option A: use the Blueprint flow from `backend/render.yaml`.

Option B: create a Render Web Service manually:

1. Create a new Render Web Service from the GitHub repository.
2. Set root directory to `backend`.
3. Set environment to Python.
4. Use the build and start commands below.
5. Set `FLOWPILOT_ALLOWED_ORIGINS` to the deployed Vercel URL.
6. Add `GEMINI_API_KEY` only if live Gemini responses are needed.

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
PYTHON_VERSION=3.11.9
FLOWPILOT_ALLOWED_ORIGINS=https://flowpilot-ai-one.vercel.app
GEMINI_API_KEY=optional
```

`GEMINI_API_KEY` is optional. The backend has a deterministic fallback response path so the demo works without a model key.
Render should use Python `3.11.9`. The repository includes both `.python-version` and `runtime.txt`, but also set `PYTHON_VERSION=3.11.9` in Render's Environment tab.

Health check:

```text
https://your-render-service.onrender.com/health
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
- Render free services can sleep after inactivity; open `/health` once before a live demo.
