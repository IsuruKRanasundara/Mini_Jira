"use client";

import { useMemo, useState } from "react";
import { useAdminData } from "@/context/admin-data-context";
import { JobStatus } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const columns: { key: JobStatus; title: string }[] = [
  { key: "draft", title: "Draft" },
  { key: "submitted", title: "Submitted" },
  { key: "under_review", title: "Under Review" },
  { key: "approved", title: "Approved" },
  { key: "rejected", title: "Rejected" },
  { key: "published", title: "Published" },
  { key: "expired", title: "Expired" },
  { key: "archived", title: "Archived" },
];

export function WorkflowBoard() {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const { jobs } = useAdminData();

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const queryMatch = `${job.title} ${job.companyName}`.toLowerCase().includes(query.toLowerCase());
      const priorityMatch = priority === "all" || job.priority === priority;
      return queryMatch && priorityMatch;
    });
  }, [query, priority, jobs]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by title/company" />
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 2xl:grid-cols-8">
        {columns.map((column) => {
          const columnJobs = filtered.filter((job) => job.status === column.key);

          return (
            <Card key={column.key}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{column.title}</span>
                  <Badge variant="secondary">{columnJobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnJobs.map((job) => (
                  <article key={job.id} className="rounded-lg border bg-background p-3">
                    <p className="text-sm font-semibold">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.companyName}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="secondary">{job.priority}</Badge>
                      <Badge variant="outline">{job.expiryDate}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Reviewer: {job.assignedReviewer}</p>
                  </article>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
