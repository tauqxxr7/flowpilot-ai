# Judge Quickstart

Repository: https://github.com/tauqxxr7/flowpilot-ai

## What To Look At First

1. `README.md` for the product story, screenshots, and architecture.
2. `/dashboard` for operational value.
3. `/workflow-lab` for the Live Workflow Replay.
4. `/tickets` for persisted workflow output.
5. `docs/ARCHITECTURE.md` and `docs/TECHNICAL_DECISIONS.md` for engineering depth.

## Local Run

Backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

Frontend:

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Best Demo Prompt

```text
We were charged twice and need a refund before renewal.
```

This shows intent detection, source lookup, confidence scoring, ticket routing, source citations, workflow replay, and dashboard impact.
