import { JobAd } from "@/types/admin";

const DEFAULT_API_BASE_URL = "https://mini-jira-three.vercel.app/api";
const MIN_ATTEMPTS = 5;

function normalizeBaseUrl(url?: string): string {
  const candidate = (url || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
  return candidate.endsWith("/api") ? candidate : `${candidate}/api`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWithRetry<T>(endpoint: string, attempts = MIN_ATTEMPTS): Promise<T> {
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  const url = `${baseUrl}${endpoint}`;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(250 * attempt);
      }
    }
  }

  throw lastError;
}

function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }

    const maybeItems = (payload as { items?: unknown }).items;
    if (Array.isArray(maybeItems)) {
      return maybeItems as T[];
    }
  }

  return [];
}

function inferStatus(raw: unknown): JobAd["status"] {
  const value = String(raw ?? "").toLowerCase();
  if (value.includes("draft")) return "draft";
  if (value.includes("submit")) return "submitted";
  if (value.includes("review")) return "under_review";
  if (value.includes("approve")) return "approved";
  if (value.includes("reject")) return "rejected";
  if (value.includes("publish") || value.includes("active")) return "published";
  if (value.includes("expire")) return "expired";
  if (value.includes("archive")) return "archived";
  return "submitted";
}

function inferPriority(raw: unknown): JobAd["priority"] {
  const value = String(raw ?? "").toLowerCase();
  if (value.includes("urgent")) return "urgent";
  if (value.includes("high")) return "high";
  if (value.includes("low")) return "low";
  return "medium";
}

function inferEmploymentType(raw: unknown): JobAd["employmentType"] {
  const value = String(raw ?? "").toLowerCase();
  if (value.includes("part")) return "part_time";
  if (value.includes("contract")) return "contract";
  if (value.includes("intern")) return "internship";
  return "full_time";
}

function toIsoDate(value: unknown): string {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export interface AdminApiResources {
  users: Record<string, unknown>[];
  jobs: Record<string, unknown>[];
  applications: Record<string, unknown>[];
  companies: Record<string, unknown>[];
  notifications: Record<string, unknown>[];
  skills: Record<string, unknown>[];
  learningResources: Record<string, unknown>[];
}

export async function fetchAdminResources(): Promise<AdminApiResources> {
  const [usersRes, jobsRes, applicationsRes, companiesRes, notificationsRes, skillsRes, learningResRes] = await Promise.allSettled([
    requestWithRetry<unknown>("/users", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/jobs", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/applications", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/companies", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/notifications", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/skills", MIN_ATTEMPTS),
    requestWithRetry<unknown>("/learning-resources", MIN_ATTEMPTS),
  ]);

  return {
    users: usersRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(usersRes.value) : [],
    jobs: jobsRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(jobsRes.value) : [],
    applications: applicationsRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(applicationsRes.value) : [],
    companies: companiesRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(companiesRes.value) : [],
    notifications: notificationsRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(notificationsRes.value) : [],
    skills: skillsRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(skillsRes.value) : [],
    learningResources: learningResRes.status === "fulfilled" ? extractArray<Record<string, unknown>>(learningResRes.value) : [],
  };
}

export function mapApiJobs(records: Record<string, unknown>[]): JobAd[] {
  return records.map((record, index) => {
    const id = String(record._id ?? record.id ?? `JOB-${1000 + index}`);
    const postedDate = toIsoDate(record.createdAt ?? record.postedDate ?? Date.now());
    const expiryDate = toIsoDate(record.expiryDate ?? record.validUntil ?? Date.now());

    const salaryRangeValue = record.salaryRange as { min?: unknown; max?: unknown } | undefined;
    const min = Number(salaryRangeValue?.min ?? record.minSalary ?? 0);
    const max = Number(salaryRangeValue?.max ?? record.maxSalary ?? 0);
    const salaryRange = min && max ? `${min}-${max}` : String(record.salaryRange ?? "N/A");

    return {
      id,
      title: String(record.title ?? "Untitled role"),
      companyName: String(record.companyName ?? record.company ?? "Unknown company"),
      companyId: String(record.companyId ?? record.company ?? "unknown-company"),
      category: String(record.jobCategory ?? record.category ?? "General"),
      employmentType: inferEmploymentType(record.employmentType ?? record.jobType),
      location: String(record.location ?? "Unspecified"),
      salaryRange,
      postedDate,
      expiryDate,
      status: inferStatus(record.status ?? record.jobStatus),
      priority: inferPriority(record.priority),
      assignedReviewer: String(record.assignedReviewer ?? "Unassigned"),
      featured: Boolean(record.featured ?? false),
      applicants: Number(record.applicants ?? 0),
      description: String(record.description ?? "No description provided."),
      requirements: Array.isArray(record.requirements) ? (record.requirements as string[]) : [],
      benefits: Array.isArray(record.benefits) ? (record.benefits as string[]) : [],
      notes: Array.isArray(record.notes) ? (record.notes as string[]) : [],
    };
  });
}
