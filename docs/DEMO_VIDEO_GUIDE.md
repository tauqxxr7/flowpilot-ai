# Demo Video Guide

Target length: 60-90 seconds.

Final video: recorded and stored at `assets/demo/flowpilot-ai-demo.mp4`.

## Opening Line

"Most AI support bots only reply. FlowPilot AI routes a customer issue through an explainable support workflow."

## Recording Plan

1. Open dashboard: `https://flowpilot-ai-one.vercel.app/dashboard`
   - Show ticket volume, escalations, confidence, category mix, and recent workflow activity.
2. Open knowledge base: `https://flowpilot-ai-one.vercel.app/knowledge-base`
   - Show the business context used for source-backed responses.
3. Open workflow lab: `https://flowpilot-ai-one.vercel.app/workflow-lab`
   - Enter: `We were charged twice and need a refund before renewal.`
   - Click `Run replay`.
4. Zoom into the routing result.
   - Point out intent, confidence, ticket ID, route/action, owner, and source count.
5. Show Workflow Replay / decision trail.
   - Explain that each step is visible: query received, intent detected, source lookup, decision, confidence, route, ticket, dashboard update.
6. Open tickets: `https://flowpilot-ai-one.vercel.app/tickets`
   - Show the persisted ticket handoff.
7. Close with the architecture line:
   - "Intent detection -> source lookup -> decision engine -> workflow router -> ticket/escalation -> dashboard review."

## What To Emphasize

- This is not a chatbot screen.
- Workflow Replay makes the route explainable and auditable.
- Confidence is visible before action is taken.
- Source snippets show the response is grounded in business context.
- Demo data is honest MVP seed data, not fake production usage.

## Recording Tips

- Keep browser zoom at 90% or 100%.
- Make `https://flowpilot-ai-one.vercel.app/workflow-lab` the main visual moment.
- Avoid setup screens.
- Do not add features during recording; the project is in final freeze.
