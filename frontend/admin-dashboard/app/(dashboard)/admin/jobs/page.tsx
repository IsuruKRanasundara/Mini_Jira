"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, FileCheck2, ShieldAlert } from "lucide-react";
import { ConfirmActionDialog } from "@/components/dashboard/confirm-action-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobDataTable } from "@/components/jobs/job-data-table";
import { JobFilterToolbar, JobFilters } from "@/components/jobs/job-filter-toolbar";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAdminData } from "@/context/admin-data-context";

const defaultFilters: JobFilters = {
  query: "",
  status: "all",
  category: "",
  location: "",
  company: "",
};

export default function JobsManagementPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { jobs } = useAdminData();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const textMatch = `${job.title} ${job.companyName} ${job.category}`.toLowerCase().includes(filters.query.toLowerCase());
      const statusMatch = filters.status === "all" || job.status === filters.status;
      const categoryMatch = !filters.category || job.category.toLowerCase().includes(filters.category.toLowerCase());
      const locationMatch = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const companyMatch = !filters.company || job.companyName.toLowerCase().includes(filters.company.toLowerCase());
      return textMatch && statusMatch && categoryMatch && locationMatch && companyMatch;
    });
  }, [filters, jobs]);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Job Advertisement Management" }]} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Approval & Moderation Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-medium">Duplicate detection warning</p>
                <p className="text-xs text-muted-foreground">JOB-1049 has matching title and salary pattern with a previous archived listing.</p>
              </div>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                  <p className="text-sm font-semibold">Policy flags</p>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Compensation language requires normalization</li>
                  <li>Potential discriminatory wording detected</li>
                  <li>Missing legal entity contact for one submission</li>
                </ul>
              </div>

              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-success" />
                  <p className="text-sm font-semibold">Validation checklist</p>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">Completion score</p>
                <Progress value={82} />
                <p className="mt-2 text-xs text-muted-foreground">8/10 mandatory checks passed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => toast.success("Selected ads approved")}>Approve</Button>
            <Button className="w-full" variant="destructive" onClick={() => toast.error("Selected ads rejected")}>Reject with reason</Button>
            <Button className="w-full" variant="outline" onClick={() => toast("Sent back for revision")}>Send back for revision</Button>
            <Button className="w-full" variant="outline" onClick={() => toast("Escalated to compliance lead")}>Escalate</Button>
            <Button className="w-full" variant="secondary" onClick={() => setConfirmOpen(true)}>Archive selected</Button>
            <div className="pt-2">
              <Badge variant="secondary">Internal note: review high-priority queue before EOD.</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <JobFilterToolbar filters={filters} onFiltersChange={setFilters} onReset={() => setFilters(defaultFilters)} />

      {filteredJobs.length ? (
        <JobDataTable
          data={filteredJobs}
          onBulkArchive={(ids) => {
            toast.success(`Archived ${ids.length} job ads`);
          }}
        />
      ) : (
        <EmptyState
          title="No job ads match your filters"
          description="Try removing one or more filters or search with broader keywords."
          actionLabel="Reset filters"
          onAction={() => setFilters(defaultFilters)}
        />
      )}

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Archive selected ads"
        description="Selected ads will be moved to archived status."
        confirmLabel="Archive"
        onConfirm={() => toast.success("Ads archived")}
      />
    </div>
  );
}
