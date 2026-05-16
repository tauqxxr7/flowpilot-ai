import { ArrowRight } from "lucide-react";

const stages = ["Customer Issue", "Intent", "Knowledge", "Decision", "Route", "Ticket / Review", "Analytics"];

export function FlowDiagram() {
  return (
    <div className="surface overflow-x-auto rounded-md p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="page-kicker">Pipeline</p>
          <h2 className="mt-1 text-base font-semibold">How one message becomes an operations record</h2>
        </div>
      </div>
      <div className="flex min-w-[860px] items-center gap-3">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center gap-3">
            <div className="flex h-16 w-28 items-center justify-center rounded-md border border-line bg-panel px-3 text-center text-sm font-semibold text-gray-800">
              {stage}
            </div>
            {index < stages.length - 1 ? <ArrowRight className="h-5 w-5 text-accent" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
