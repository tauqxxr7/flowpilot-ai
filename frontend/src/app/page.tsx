import { CopilotConsole } from "@/components/CopilotConsole";
import { FlowDiagram } from "@/components/FlowDiagram";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <CopilotConsole />
      <FlowDiagram />
    </div>
  );
}
