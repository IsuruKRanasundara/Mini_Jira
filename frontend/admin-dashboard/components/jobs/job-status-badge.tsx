import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/admin";

const map: Record<JobStatus, { label: string; variant: "secondary" | "success" | "warning" | "danger" | "default" }> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "warning" },
  under_review: { label: "Under Review", variant: "default" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  published: { label: "Published", variant: "success" },
  expired: { label: "Expired", variant: "warning" },
  archived: { label: "Archived", variant: "secondary" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = map[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
