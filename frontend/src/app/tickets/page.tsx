import { Inbox } from "lucide-react";
import { getTickets } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default async function TicketsPage() {
  const tickets = await getTickets().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-md border border-line bg-white p-2">
          <Inbox className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div>
          <p className="page-kicker">Routed cases</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Ticket history and owner handoff</h1>
          <p className="mt-1 text-sm text-gray-600">Each workflow run creates a ticket record with intent, route, owner, and confidence.</p>
        </div>
      </div>
      <section className="surface overflow-hidden rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-panel text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="align-top transition hover:bg-panel/80">
                  <td className="px-4 py-4 font-mono font-semibold">{ticket.id}</td>
                  <td className="px-4 py-4">{ticket.customer_name}</td>
                  <td className="px-4 py-4 capitalize">{ticket.intent}</td>
                  <td className="px-4 py-4"><StatusBadge value={ticket.action} /></td>
                  <td className="px-4 py-4">{ticket.owner}</td>
                  <td className="px-4 py-4"><StatusBadge value={ticket.priority} /></td>
                  <td className="px-4 py-4 font-mono">{Math.round(ticket.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!tickets.length ? <p className="p-5 text-sm text-gray-600">No tickets yet. Run the Copilot workflow to create the first one.</p> : null}
      </section>
    </div>
  );
}
