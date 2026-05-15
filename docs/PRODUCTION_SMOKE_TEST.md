# Production Smoke Test

Use this checklist after deploying the FastAPI backend on Render and the Next.js frontend on Vercel.

## Backend

1. Open the health endpoint:

```text
https://your-render-service.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "flowpilot-ai-api"
}
```

2. Confirm CORS is configured:

```text
FLOWPILOT_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## Frontend

1. Open the live Vercel URL.
2. Visit `/dashboard` and confirm dashboard cards load.
3. Visit `/knowledge-base` and confirm documents are visible.
4. Visit `/workflow-lab`.
5. Submit this query:

```text
We were charged twice and need a refund before renewal.
```

6. Confirm the response shows:

- detected intent
- confidence score
- retrieved sources
- workflow route
- Live Workflow Replay / decision timeline

7. Visit `/tickets` and confirm the new ticket appears.
8. Return to `/dashboard` and confirm ticket totals or recent activity update.

## Before Recording The Demo

- Wake the Render backend by opening `/health`.
- Confirm Vercel has `NEXT_PUBLIC_API_URL` set to the Render backend URL.
- Keep browser zoom at 90% or 100% so the workflow timeline is readable.
- Do not expose `.env` files or API keys during recording.
