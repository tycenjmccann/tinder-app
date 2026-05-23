import { HistorySidebar } from "@/components/workflow/HistorySidebar";
import { WorkflowBoard } from "@/components/workflow/WorkflowBoard";

export default function WorkflowPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <HistorySidebar />
      <WorkflowBoard />
    </div>
  );
}
