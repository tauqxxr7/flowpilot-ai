"use client";

import { GitBranch, Play } from "lucide-react";
import { useState } from "react";
import { WorkflowDecision, routeWorkflow } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";

const intents = ["refund", "pricing", "product support", "onboarding", "complaint", "sales inquiry"];

export function WorkflowLab() {
  const [intent, setIntent] = useState("product support");
  const [confidence, setConfidence] = useState(0.72);
  const [message, setMessage] = useState("Customer says the integration failed twice and asks what happens next.");
  const [decision, setDecision] = useState<WorkflowDecision | null>(null);
  const [error, setError] = useState("");

  async function runRoute() {
    setError("");
    try {
      setDecision(await routeWorkflow({ intent, confidence, message }));
    } catch {
      setError("Backend API is not reachable. Start FastAPI on port 8000 and try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-accent" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workflow Lab</h1>
          <p className="text-sm text-gray-600">Test routing decisions without creating a full customer ticket.</p>
        </div>
      </div>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface rounded-md p-5">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="intent">Intent</label>
          <select id="intent" value={intent} onChange={(event) => setIntent(event.target.value)} className="mt-2 w-full rounded-md border border-line bg-panel p-3 outline-none focus:border-accent focus:bg-white">
            {intents.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="mt-5 block text-sm font-semibold text-gray-700" htmlFor="confidence">Confidence: {Math.round(confidence * 100)}%</label>
          <input id="confidence" type="range" min="0.4" max="0.98" step="0.01" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-2 w-full" />
          <label className="mt-5 block text-sm font-semibold text-gray-700" htmlFor="message">Message context</label>
          <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-32 w-full rounded-md border border-line bg-panel p-3 outline-none focus:border-accent focus:bg-white" />
          <button type="button" onClick={runRoute} className="mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent">
            <Play className="h-4 w-4" aria-hidden="true" />
            Route workflow
          </button>
          {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </div>
        <div className="surface rounded-md p-5">
          <h2 className="text-lg font-semibold">Routing result</h2>
          {decision ? (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={decision.action} />
                <StatusBadge value={decision.priority} />
              </div>
              <p className="text-sm leading-6 text-gray-700">{decision.reason}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-panel p-3">
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="mt-1 font-semibold">{decision.owner}</p>
                </div>
                <div className="rounded-md bg-panel p-3">
                  <p className="text-xs text-gray-500">Decision confidence</p>
                  <p className="mt-1 font-mono font-semibold">{Math.round(decision.confidence * 100)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-line bg-panel p-5 text-sm text-gray-600">Run a route test to inspect the workflow decision.</p>
          )}
        </div>
      </section>
    </div>
  );
}
