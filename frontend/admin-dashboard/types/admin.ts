export type JobStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "published"
  | "expired"
  | "archived";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface JobAd {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
  category: string;
  employmentType: "full_time" | "part_time" | "contract" | "internship";
  location: string;
  salaryRange: string;
  postedDate: string;
  expiryDate: string;
  status: JobStatus;
  priority: Priority;
  assignedReviewer: string;
  featured: boolean;
  applicants: number;
  description: string;
  requirements: string[];
  benefits: string[];
  notes: string[];
}

export interface Company {
  id: string;
  name: string;
  verified: boolean;
  status: "active" | "suspended";
  totalAds: number;
  activeListings: number;
  approvalRate: number;
  rejectionRate: number;
  lastActivity: string;
  primaryRecruiter: string;
}

export interface AdminTask {
  id: string;
  title: string;
  linkedJobId: string;
  assignedAdmin: string;
  priority: Priority;
  dueDate: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  comments: number;
}

export interface ActivityItem {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
  type: "job" | "review" | "company" | "task";
}

export interface DashboardStats {
  totalJobAds: number;
  activeJobAds: number;
  draftJobAds: number;
  pendingApproval: number;
  expiredAds: number;
  rejectedAds: number;
  archivedAds: number;
  totalRecruiters: number;
  totalApplicants: number;
}

export interface ChartPoint {
  label: string;
  value: number;
  approved?: number;
  rejected?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "submission" | "approval" | "expiring" | "company" | "task";
  unread: boolean;
}
