import { CheckCircle2 } from "lucide-react";

const steps = [
  "Intent detected",
  "Knowledge retrieved",
  "Decision scored",
  "Workflow routed",
  "Ticket logged",
];

export function WorkflowSteps() {
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {steps.map((step) => (
        <div key={step} className="rounded-md border border-line bg-panel p-3">
          <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
          <p className="mt-2 text-xs font-semibold text-gray-700">{step}</p>
        </div>
      ))}
    </div>
  );
}
