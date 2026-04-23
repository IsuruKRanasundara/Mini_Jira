import { WorkflowBoard } from "@/components/jobs/workflow-board";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function WorkflowPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Workflow Management" }]} />
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Mini Jira workflow board</h1>
        <p className="text-sm text-muted-foreground">Architecture is prepared for drag-and-drop handoff using status columns and immutable card IDs.</p>
      </section>
      <WorkflowBoard />
    </div>
  );
}
