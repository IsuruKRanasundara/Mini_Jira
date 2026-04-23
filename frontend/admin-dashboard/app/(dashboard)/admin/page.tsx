"use client";

import { Archive, BadgeAlert, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Users2, UserRoundSearch, XCircle } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ChartCard } from "@/components/dashboard/chart-card";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAdminData } from "@/context/admin-data-context";

export default function AdminOverviewPage() {
  const { stats, chartJobsByWeek, chartStatusDistribution, chartCategories, chartApprovalTrend } = useAdminData();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin" }, { label: "Overview" }]} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard title="Total job advertisements" value={stats.totalJobAds} helper="Across all companies" icon={BriefcaseBusiness} />
        <StatCard title="Active job ads" value={stats.activeJobAds} helper="Currently visible" icon={CheckCircle2} />
        <StatCard title="Draft job ads" value={stats.draftJobAds} helper="Pending submit" icon={FileText} />
        <StatCard title="Pending approval" value={stats.pendingApproval} helper="Needs admin action" icon={Clock3} />
        <StatCard title="Expired ads" value={stats.expiredAds} helper="Auto-hidden" icon={BadgeAlert} />
        <StatCard title="Rejected ads" value={stats.rejectedAds} helper="Policy or quality issues" icon={XCircle} />
        <StatCard title="Archived ads" value={stats.archivedAds} helper="Closed campaigns" icon={Archive} />
        <StatCard title="Recruiters / Companies" value={stats.totalRecruiters} helper="Active recruiter accounts" icon={Users2} />
        <StatCard title="Total applicants" value={stats.totalApplicants} helper="Applicants from active ads" icon={UserRoundSearch} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ChartCard title="Job ads created" description="Weekly creation trend" data={chartJobsByWeek} type="line" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Status distribution" description="Current lifecycle spread" data={chartStatusDistribution} type="pie" />
            <ChartCard title="Category distribution" description="Top job categories" data={chartCategories} type="bar" />
          </div>
          <ChartCard title="Approval vs rejection trend" description="Monthly moderation trend" data={chartApprovalTrend} type="dual-line" />
        </div>

        <div className="space-y-4">
          <QuickActionsPanel />
          <ActivityFeed />
        </div>
      </section>
    </div>
  );
}
