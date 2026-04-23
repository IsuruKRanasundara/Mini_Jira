"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  const [workflow, setWorkflow] = useState("standard");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Settings & Configuration" }]} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Job category management</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Add new category" />
            <Button variant="outline" onClick={() => toast.success("Category added")}>Add category</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status workflow settings</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Select value={workflow} onChange={(e) => setWorkflow(e.target.value)}>
              <option value="standard">Standard workflow</option>
              <option value="strict">Strict compliance workflow</option>
              <option value="fast">Fast-track workflow</option>
            </Select>
            <Button onClick={() => toast.success("Workflow updated")}>Save workflow</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Approval & featured rules</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Configure approval SLA, auto-archive intervals, and featured listing thresholds.</p>
            <Button variant="outline">Open rule editor</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notification and role permissions</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Manage email, in-app notification triggers, and admin role scopes.</p>
            <Button variant="outline">Manage permissions</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
