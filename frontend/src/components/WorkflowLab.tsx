"use client";

import { CheckCircle2, Clipboard, GitBranch, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QueryResponse, submitQuery } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";
import { WorkflowSteps } from "./WorkflowSteps";

const demoScenarios = [
  {
    label: "Refund",
    value: "We were charged twice and need a refund before renewal.",
  },
  {
    label: "Pricing",
    value: "A 250 person company wants pricing for a pilot with CRM integration.",
  },
  {
    label: "Escalation",
    value: "Our dashboard automation failed three times and the customer is threatening to escalate.",
  },
];

export function WorkflowLab() {
  const searchParams = useSearchParams();
  const demoStarted = useRef(false);
  const [message, setMessage] = useState(demoScenarios[2].value);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runReplay() {
    setError("");
    setLoading(true);
    setCopied(false);
    try {
      setResult(await submitQuery(message, "Workflow Lab Demo"));
    } catch {
      setError("Backend API is not reachable. Start FastAPI on port 8000 and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (demoStarted.current || searchParams.get("demo") !== "timeline") {
      return;
    }
    demoStarted.current = true;
    void runReplay();
  }, [searchParams]);

  async function copySummary() {
    if (!result) {
      return;
    }
    const summary = [
      `Ticket: ${result.ticket_id}`,
      `Intent: ${result.intent}`,
      `Confidence: ${Math.round(result.confidence * 100)}%`,
      `Action: ${result.workflow.action}`,
      `Owner: ${result.workflow.owner}`,
      `Priority: ${result.workflow.priority}`,
      `Reason: ${result.workflow.reason}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setError("Could not copy summary from this browser context.");
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
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="surface rounded-md p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Live workflow replay</p>
          <h2 className="mt-2 text-lg font-semibold">Customer issue</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Run a real query through the same API used by the Copilot. FlowPilot will replay how the issue becomes a routed workflow.
          </p>

          <label className="mt-5 block text-sm font-semibold text-gray-700" htmlFor="message">Message context</label>
          <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-32 w-full rounded-md border border-line bg-panel p-3 outline-none focus:border-accent focus:bg-white" />
          <div className="mt-3 flex flex-wrap gap-2">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.label}
                type="button"
                onClick={() => setMessage(scenario.value)}
                className="rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-accent hover:text-accent"
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={runReplay} disabled={loading || !message.trim()} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">
              <Play className="h-4 w-4" aria-hidden="true" />
              {loading ? "Running replay" : "Run workflow replay"}
            </button>
            <button type="button" onClick={runReplay} disabled={loading || !message.trim()} className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Replay Workflow
            </button>
          </div>
          {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </div>
        <div className="surface rounded-md p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Decision Timeline</h2>
              <p className="mt-1 text-sm text-gray-600">A visual audit trail from customer issue to routed workflow.</p>
            </div>
            <button
              type="button"
              onClick={copySummary}
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              {copied ? "Copied" : "Copy Decision Summary"}
            </button>
          </div>

          {result ? (
            <div className="mt-4 space-y-4">
              <WorkflowSteps />
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Workflow action</p>
                  <div className="mt-2"><StatusBadge value={result.workflow.action} /></div>
                </div>
                <div className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Confidence</p>
                  <p className="mt-2 font-mono text-lg font-semibold">{Math.round(result.confidence * 100)}%</p>
                </div>
                <div className="rounded-md border border-line bg-panel p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Owner</p>
                  <p className="mt-2 text-sm font-semibold">{result.workflow.owner}</p>
                </div>
              </div>
              <div className="rounded-md border border-line bg-panel p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge value={result.workflow.priority} />
                  <span className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {result.ticket_id}
                  </span>
                </div>
                <p className="text-sm leading-6 text-gray-700">{result.response}</p>
                <p className="mt-3 text-xs text-gray-500">{result.workflow.reason}</p>
              </div>
              <div className="relative space-y-3 border-l border-line pl-4">
                {result.decision_timeline.map((item) => (
                  <article key={item.step} className="relative rounded-md border border-line bg-white p-4 transition hover:border-accent/60">
                    <span className="absolute -left-[23px] top-5 flex h-4 w-4 rounded-full border-2 border-white bg-accent shadow-sm" />
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-accent">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">{item.step}. {item.title}</p>
                          <StatusBadge value={item.status} />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {Object.entries(item.metadata).map(([key, value]) => (
                            <div key={key} className="rounded-md bg-panel px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wide text-gray-500">{key.replaceAll("_", " ")}</p>
                              <p className="mt-1 truncate text-sm font-medium text-gray-800">
                                {Array.isArray(value) ? value.join(", ") : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 font-mono text-xs text-gray-400">{item.timestamp}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Retrieved source cards</p>
                <div className="mt-2 grid gap-3">
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
            <p className="mt-4 rounded-md border border-dashed border-line bg-panel p-5 text-sm leading-6 text-gray-600">
              Run a workflow replay to see each decision step, retrieved context, confidence score, route selection, ticket creation, and dashboard update.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
