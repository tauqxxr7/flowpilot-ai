import { ArrowRight } from "lucide-react";

const stages = ["Customer Query", "Intent Detection", "Knowledge Retrieval", "AI Decision Engine", "Workflow Router", "Ticket / Escalation", "Dashboard Analytics"];

export function FlowDiagram() {
  return (
    <div className="surface overflow-x-auto rounded-md p-4">
      <div className="flex min-w-[920px] items-center gap-3">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center gap-3">
            <div className="flex h-20 w-32 items-center justify-center rounded-md border border-line bg-panel px-3 text-center text-sm font-semibold text-gray-800">
              {stage}
            </div>
            {index < stages.length - 1 ? <ArrowRight className="h-5 w-5 text-accent" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
