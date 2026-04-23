"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminData } from "@/context/admin-data-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CompaniesPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const { companies, jobs } = useAdminData();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Companies & Recruiters" }]} />

      <Card>
        <CardHeader>
          <CardTitle>Companies table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Total ads</TableHead>
                <TableHead>Active listings</TableHead>
                <TableHead>Approval rate</TableHead>
                <TableHead>Rejection rate</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">Recruiter: {company.primaryRecruiter}</p>
                    </div>
                  </TableCell>
                  <TableCell>{company.totalAds}</TableCell>
                  <TableCell>{company.activeListings}</TableCell>
                  <TableCell>{company.approvalRate}%</TableCell>
                  <TableCell>{company.rejectionRate}%</TableCell>
                  <TableCell>{company.lastActivity}</TableCell>
                  <TableCell>
                    <Badge variant={company.status === "active" ? "success" : "danger"}>{company.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View company</Button>
                      <Button size="sm" variant="outline">Verify</Button>
                      <Button size="sm" variant="outline" onClick={() => toast("Account suspended")}>Suspend</Button>
                      <Button size="sm" variant="secondary" onClick={() => setContactOpen(true)}>Contact</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recruiter accounts snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Most active companies this week: {companies.map((c) => c.name).join(", ")}.</p>
          <p>Total active job ads from managed companies: {jobs.filter((job) => ["published", "under_review", "submitted"].includes(job.status)).length}.</p>
        </CardContent>
      </Card>

      <Sheet open={contactOpen} onOpenChange={setContactOpen} title="Contact recruiter">
        <p className="text-sm text-muted-foreground">Compose a message to the selected recruiter. Integration can connect this panel to internal messaging or email APIs.</p>
      </Sheet>
    </div>
  );
}
