# Windows Setup And Smoke Test

These are the exact commands used to verify the local MVP on Windows.

## Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open a second PowerShell terminal for checks:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/query `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"customer_name":"Demo","message":"Our dashboard automation failed three times and the customer is threatening to escalate.","channel":"web"}'
```

Expected result:

- `health.status` is `ok`
- query response includes `ticket_id`
- query response includes `intent`
- query response includes `confidence`
- query response includes `workflow.action`
- query response includes `sources`
- `/api/tickets` includes the new ticket
- `/api/dashboard/stats` total increases after a query

## Reload Note

The command `uvicorn main:app --reload --port 8000` works from a normal PowerShell terminal. In restricted automation environments, the Windows reload supervisor can fail while creating multiprocessing named pipes with `PermissionError: [WinError 5] Access is denied`. If that happens during automated verification, run without reload:

```powershell
uvicorn main:app --port 8000
```

This does not change application behavior; it only disables hot reload.

## Frontend

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'
npm run dev
```

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/dashboard`
- `http://127.0.0.1:3000/knowledge-base`
- `http://127.0.0.1:3000/tickets`
- `http://127.0.0.1:3000/workflow-lab`

## Screenshot Checklist

Save final submission screenshots in `assets/screenshots`.

- Copilot page after a successful refund or escalation query
- Dashboard after multiple queries
- Knowledge base with seeded policy documents
- Ticket history with workflow actions
- Workflow Lab routing decision
