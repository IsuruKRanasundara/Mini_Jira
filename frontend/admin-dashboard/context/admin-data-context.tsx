"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  activities,
  approvalTrend,
  categories,
  companies as mockCompanies,
  dashboardStats,
  jobs as mockJobs,
  jobsByWeek,
  notifications as mockNotifications,
  statusDistribution,
  tasks as mockTasks,
} from "@/lib/mock-data";
import { fetchAdminResources, mapApiJobs } from "@/lib/admin-api";
import {
  ActivityItem,
  AdminTask,
  ChartPoint,
  Company,
  DashboardStats,
  JobAd,
  NotificationItem,
} from "@/types/admin";

interface AdminDataState {
  jobs: JobAd[];
  companies: Company[];
  tasks: AdminTask[];
  notifications: NotificationItem[];
  activities: ActivityItem[];
  stats: DashboardStats;
  chartJobsByWeek: ChartPoint[];
  chartStatusDistribution: ChartPoint[];
  chartCategories: ChartPoint[];
  chartApprovalTrend: ChartPoint[];
  loading: boolean;
  error: string | null;
}

const defaultState: AdminDataState = {
  jobs: mockJobs,
  companies: mockCompanies,
  tasks: mockTasks,
  notifications: mockNotifications,
  activities,
  stats: dashboardStats,
  chartJobsByWeek: jobsByWeek,
  chartStatusDistribution: statusDistribution,
  chartCategories: categories,
  chartApprovalTrend: approvalTrend,
  loading: true,
  error: null,
};

const AdminDataContext = createContext<AdminDataState>(defaultState);

function toWeekLabel(dateString: string): string {
  const date = new Date(dateString);
  const day = Math.max(1, date.getDate());
  const week = Math.ceil(day / 7);
  return `W${Math.min(week, 5)}`;
}

function buildStats(jobs: JobAd[], companies: Company[], applicantsCount: number): DashboardStats {
  return {
    totalJobAds: jobs.length,
    activeJobAds: jobs.filter((item) => item.status === "published" || item.status === "approved").length,
    draftJobAds: jobs.filter((item) => item.status === "draft").length,
    pendingApproval: jobs.filter((item) => item.status === "submitted" || item.status === "under_review").length,
    expiredAds: jobs.filter((item) => item.status === "expired").length,
    rejectedAds: jobs.filter((item) => item.status === "rejected").length,
    archivedAds: jobs.filter((item) => item.status === "archived").length,
    totalRecruiters: companies.length,
    totalApplicants: applicantsCount,
  };
}

function buildCharts(jobs: JobAd[]) {
  const weekMap = new Map<string, number>();
  const statusMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  jobs.forEach((job) => {
    const week = toWeekLabel(job.postedDate);
    weekMap.set(week, (weekMap.get(week) ?? 0) + 1);

    const status = job.status.replace("_", " ");
    statusMap.set(status, (statusMap.get(status) ?? 0) + 1);

    categoryMap.set(job.category, (categoryMap.get(job.category) ?? 0) + 1);
  });

  return {
    chartJobsByWeek: [...weekMap.entries()].map(([label, value]) => ({ label, value })),
    chartStatusDistribution: [...statusMap.entries()].map(([label, value]) => ({ label, value })),
    chartCategories: [...categoryMap.entries()].map(([label, value]) => ({ label, value })),
  };
}

function mapCompanies(records: Record<string, unknown>[], jobs: JobAd[]): Company[] {
  return records.map((record, index) => {
    const companyId = String(record._id ?? record.id ?? `CMP-${100 + index}`);
    const companyJobs = jobs.filter((item) => item.companyId === companyId || item.companyName === String(record.companyName ?? record.name ?? ""));
    const totalAds = companyJobs.length;
    const approved = companyJobs.filter((item) => item.status === "approved" || item.status === "published").length;
    const rejected = companyJobs.filter((item) => item.status === "rejected").length;

    return {
      id: companyId,
      name: String(record.companyName ?? record.name ?? "Unknown Company"),
      verified: Boolean(record.verified ?? true),
      status: String(record.status ?? "active").toLowerCase().includes("suspend") ? "suspended" : "active",
      totalAds,
      activeListings: companyJobs.filter((item) => item.status === "published" || item.status === "under_review").length,
      approvalRate: totalAds ? Math.round((approved / totalAds) * 100) : 0,
      rejectionRate: totalAds ? Math.round((rejected / totalAds) * 100) : 0,
      lastActivity: String(record.updatedAt ?? record.createdAt ?? new Date().toISOString().slice(0, 10)).slice(0, 10),
      primaryRecruiter: String(record.ownerName ?? "Recruiter"),
    };
  });
}

function mapNotifications(records: Record<string, unknown>[]): NotificationItem[] {
  return records.slice(0, 10).map((record, index) => ({
    id: String(record._id ?? record.id ?? `NOT-${index + 1}`),
    title: String(record.message ?? record.title ?? "Notification"),
    time: String(record.createdAt ?? "now").slice(0, 16),
    type: "submission",
    unread: String(record.status ?? "Unread").toLowerCase() !== "read",
  }));
}

function mapTasksFromApplications(records: Record<string, unknown>[]): AdminTask[] {
  return records.slice(0, 8).map((record, index) => ({
    id: `TASK-${400 + index}`,
    title: `Review application ${String(record._id ?? record.id ?? index + 1)}`,
    linkedJobId: String(record.jobId ?? "Unknown Job"),
    assignedAdmin: "Moderation Team",
    priority: "medium",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "todo",
    comments: 0,
  }));
}

function mapActivitiesFromJobs(jobs: JobAd[]): ActivityItem[] {
  return jobs.slice(0, 6).map((job, index) => ({
    id: `ACT-API-${index + 1}`,
    label: `${job.title} moved to ${job.status.replace("_", " ")}`,
    actor: job.companyName,
    timestamp: job.postedDate,
    type: "job",
  }));
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminDataState>(defaultState);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const resources = await fetchAdminResources();
        if (!mounted) return;

        const mappedJobs = mapApiJobs(resources.jobs);
        const mappedCompanies = mapCompanies(resources.companies, mappedJobs);
        const mappedNotifications = mapNotifications(resources.notifications);
        const mappedTasks = mapTasksFromApplications(resources.applications);
        const mappedActivities = mapActivitiesFromJobs(mappedJobs);
        const applicantsCount = resources.applications.length;
        const chartBundle = buildCharts(mappedJobs);

        setState({
          jobs: mappedJobs.length ? mappedJobs : mockJobs,
          companies: mappedCompanies.length ? mappedCompanies : mockCompanies,
          tasks: mappedTasks.length ? mappedTasks : mockTasks,
          notifications: mappedNotifications.length ? mappedNotifications : mockNotifications,
          activities: mappedActivities.length ? mappedActivities : activities,
          stats: mappedJobs.length ? buildStats(mappedJobs, mappedCompanies, applicantsCount) : dashboardStats,
          chartJobsByWeek: chartBundle.chartJobsByWeek.length ? chartBundle.chartJobsByWeek : jobsByWeek,
          chartStatusDistribution: chartBundle.chartStatusDistribution.length ? chartBundle.chartStatusDistribution : statusDistribution,
          chartCategories: chartBundle.chartCategories.length ? chartBundle.chartCategories : categories,
          chartApprovalTrend: approvalTrend,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load admin data",
        }));
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataState {
  return useContext(AdminDataContext);
}
