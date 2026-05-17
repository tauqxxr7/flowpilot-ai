import { BarChart3 } from "lucide-react";
import { getStats } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const stats = await getStats().catch(() => null);

  if (!stats) {
    return <EmptyApiState title="Dashboard unavailable" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-md border border-line bg-white p-2">
          <BarChart3 className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div>
          <p className="page-kicker">Operations view</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Support workload, routes, and review risk</h1>
          <p className="mt-1 text-sm text-gray-600">Demo data plus live tickets created through the workflow API.</p>
        </div>
      </div>
      <div className="grid metric-grid gap-4">
        <MetricCard label="Total tickets" value={stats.total_tickets} detail="Created through the query workflow" />
        <MetricCard label="Resolved by AI" value={stats.resolved_by_ai} detail="Auto-resolved with enough context" />
        <MetricCard label="Escalated" value={stats.escalated_tickets} detail="Human or high-risk workflow needed" />
        <MetricCard label="Avg confidence" value={`${Math.round(stats.average_confidence * 100)}%`} detail="Mean confidence across routed tickets" />
        <MetricCard label="Avg response time" value={`${stats.average_response_time_seconds}s`} detail="Measured by backend workflow run" />
      </div>
      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="Category breakdown">
          <Breakdown data={stats.category_breakdown} />
        </Panel>
        <Panel title="Confidence distribution">
          <Breakdown data={stats.confidence_distribution} />
        </Panel>
      </section>
      <Panel title="Recent workflow activity">
        <div className="space-y-3">
          {stats.recent_activity.length ? stats.recent_activity.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-md border border-line bg-panel p-3 transition hover:border-gray-300 hover:bg-white md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                <div>
                  <p className="font-mono text-sm font-semibold">{item.id}</p>
                  <p className="text-sm capitalize text-gray-700">{item.intent}</p>
                  <p className="mt-1 text-xs text-gray-500">Workflow event recorded at {item.created_at}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={item.action} />
                <StatusBadge value={item.priority} />
              </div>
            </div>
          )) : <p className="text-sm text-gray-600">No tickets yet. Run a case from the intake page to populate this feed.</p>}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="surface rounded-md p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Breakdown({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  if (!total) {
    return <p className="text-sm text-gray-600">No data recorded yet.</p>;
  }
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="capitalize text-gray-700">{label}</span>
            <span className="font-mono">{value}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${Math.max(8, (value / total) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyApiState({ title }: { title: string }) {
  return (
    <section className="rounded-md border border-line bg-white p-6 shadow-soft">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">Backend is waking up. Please wait 30-60 seconds and try again.</p>
    </section>
  );
}
