import { Inbox } from "lucide-react";
import { getTickets } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default async function TicketsPage() {
  const tickets = await getTickets().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-6 w-6 text-accent" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ticket History</h1>
          <p className="text-sm text-gray-600">Every copilot run creates an auditable workflow record.</p>
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
                <th className="px-4 py-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="align-top transition hover:bg-panel">
                  <td className="px-4 py-4 font-mono font-semibold">{ticket.id}</td>
                  <td className="px-4 py-4">{ticket.customer_name}</td>
                  <td className="px-4 py-4 capitalize">{ticket.intent}</td>
                  <td className="px-4 py-4"><StatusBadge value={ticket.action} /></td>
                  <td className="px-4 py-4">{ticket.owner}</td>
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
