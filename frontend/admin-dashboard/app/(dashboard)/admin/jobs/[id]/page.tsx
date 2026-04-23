"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminData } from "@/context/admin-data-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { jobs } = useAdminData();
  const job = jobs.find((item) => item.id === params.id);

  if (!job) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Jobs", href: "/admin/jobs" }, { label: "Not found" }]} />
        <Card>
          <CardHeader>
            <CardTitle>Job advertisement not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">The requested job ID does not exist or is not available yet from the API response.</p>
            <Link href="/admin/jobs" className="mt-3 inline-flex h-10 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
              Return to jobs list
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentJob = job;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Jobs", href: "/admin/jobs" }, { label: currentJob.id }]} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{currentJob.title}</h1>
          <p className="text-sm text-muted-foreground">{currentJob.companyName} • {currentJob.location}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>Approve</Button>
          <Button variant="destructive">Reject</Button>
          <Button variant="outline">Request changes</Button>
          <Button variant="secondary">Archive</Button>
          <Link href="/admin/jobs" className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Return to list
          </Link>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job advertisement details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p><span className="font-semibold">Category:</span> {currentJob.category}</p>
              <p><span className="font-semibold">Employment type:</span> {currentJob.employmentType}</p>
              <p><span className="font-semibold">Salary:</span> {currentJob.salaryRange}</p>
              <p><span className="font-semibold">Posted:</span> {currentJob.postedDate}</p>
              <p><span className="font-semibold">Expiry:</span> {currentJob.expiryDate}</p>
              <p><span className="font-semibold">Reviewer:</span> {currentJob.assignedReviewer}</p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-1 text-base font-semibold">Description</h3>
              <p className="text-muted-foreground">{currentJob.description}</p>
            </div>

            <div>
              <h3 className="mb-1 text-base font-semibold">Requirements</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {currentJob.requirements.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="mb-1 text-base font-semibold">Benefits</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {currentJob.benefits.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline & review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <JobStatusBadge status={currentJob.status} />
              <Badge variant="secondary">Priority: {currentJob.priority}</Badge>
            </div>
            <p className="text-muted-foreground">Submitted by: {currentJob.companyName} recruiter team</p>
            <p className="text-muted-foreground">Review history:</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Initial review assigned to {currentJob.assignedReviewer}</li>
              <li>Policy scan completed</li>
              <li>Final decision pending admin action</li>
            </ul>
            <p className="font-medium">Internal notes/comments</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {currentJob.notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
            <p className="text-xs text-muted-foreground">Attachments/media: no file attachments in current record.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
