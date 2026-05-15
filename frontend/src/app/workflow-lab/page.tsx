import { WorkflowLab } from "@/components/WorkflowLab";
import { Suspense } from "react";

export default function WorkflowLabPage() {
  return (
    <Suspense fallback={<div className="surface rounded-md p-5 text-sm text-gray-600">Loading workflow lab...</div>}>
      <WorkflowLab />
    </Suspense>
  );
}
