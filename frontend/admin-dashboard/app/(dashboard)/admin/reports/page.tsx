"use client";

import { Download } from "lucide-react";
import { useAdminData } from "@/context/admin-data-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
  const { chartCategories, chartJobsByWeek, chartStatusDistribution } = useAdminData();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Reports & Analytics" }]} />

      <section className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-4">
        <div className="flex gap-2">
          <Input type="date" aria-label="Report start date" />
          <Input type="date" aria-label="Report end date" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export PDF</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle>Monthly growth</CardTitle></CardHeader><CardContent>+18.4%</CardContent></Card>
        <Card><CardHeader><CardTitle>Approval ratio</CardTitle></CardHeader><CardContent>86%</CardContent></Card>
        <Card><CardHeader><CardTitle>Expired trend</CardTitle></CardHeader><CardContent>Down 7%</CardContent></Card>
        <Card><CardHeader><CardTitle>Featured ads CTR</CardTitle></CardHeader><CardContent>12.9%</CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Jobs by category" description="Most active categories" data={chartCategories} type="bar" />
        <ChartCard title="Jobs by lifecycle" description="Approval/rejection/archived split" data={chartStatusDistribution} type="pie" />
        <ChartCard title="Monthly growth" description="Jobs created over time" data={chartJobsByWeek} type="line" />
        <ChartCard title="Featured ads statistics" description="Performance overview by month" data={chartJobsByWeek} type="bar" />
      </section>
    </div>
  );
}
