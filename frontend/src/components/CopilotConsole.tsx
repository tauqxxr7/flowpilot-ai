"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { QueryResponse, submitQuery } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";

const samplePrompts = [
  { label: "Refund", value: "We were charged twice and the client is asking for a refund before renewal." },
  { label: "Escalation", value: "Our dashboard automation failed three times and the customer is threatening to escalate." },
  { label: "Sales", value: "A 250 person company wants pricing for a pilot with CRM integration." },
];

export function CopilotConsole() {
  const [message, setMessage] = useState(samplePrompts[0].value);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runQuery() {
    setLoading(true);
    setError("");
    try {
      const response = await submitQuery(message);
      setResult(response);
    } catch {
      setError("Backend API is not reachable. Start FastAPI on port 8000 and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="surface rounded-md p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Workflow intake</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Operations Copilot</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Most business bots answer questions. FlowPilot AI goes further: it understands the customer issue,
              retrieves business context, decides the next workflow action, and updates operations analytics.
            </p>
          </div>
        </div>

        <label className="mt-6 block text-sm font-semibold text-gray-700" htmlFor="customer-message">
          Customer issue
        </label>
        <textarea
          id="customer-message"
          className="mt-2 min-h-40 w-full resize-y rounded-md border border-line bg-panel p-4 text-sm leading-6 outline-none transition focus:border-accent focus:bg-white"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runQuery}
            disabled={loading || !message.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            Run workflow
          </button>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => setMessage(prompt.value)}
              className="rounded-md border border-line bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-accent hover:text-accent"
            >
              {prompt.label}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="surface rounded-md p-5">
        <h2 className="text-lg font-semibold">Decision Output</h2>
        {result ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-panel p-3">
                <p className="text-xs text-gray-500">Intent</p>
                <p className="mt-1 font-semibold capitalize">{result.intent}</p>
              </div>
              <div className="rounded-md bg-panel p-3">
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="mt-1 font-mono font-semibold">{Math.round(result.confidence * 100)}%</p>
              </div>
            </div>
            <div className="rounded-md border border-line p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={result.workflow.action} />
                <StatusBadge value={result.workflow.priority} />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-700">{result.response}</p>
              <p className="mt-3 text-xs text-gray-500">Owner: {result.workflow.owner} | Ticket: {result.ticket_id}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Cited source snippets</p>
              <div className="mt-2 space-y-2">
                {result.sources.map((source) => (
                  <article key={source.id} className="rounded-md border border-line bg-panel p-3">
                    <p className="text-sm font-semibold">{source.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{source.source} | score {source.score}</p>
                    <p className="mt-2 text-sm leading-5 text-gray-700">{source.snippet}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-line bg-panel p-5 text-sm leading-6 text-gray-600">
            Submit a customer issue to see classification, retrieval, workflow routing, ticket creation, and source citations.
          </div>
        )}
      </div>
    </section>
  );
}
