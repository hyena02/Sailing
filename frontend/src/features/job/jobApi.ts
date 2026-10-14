import { requestJson } from "../../lib/api";
import type { JobItem } from "./jobTypes";

export function getJobs(): Promise<JobItem[]> {
  return requestJson<JobItem[]>("/api/jobs");
}

export function getJob(jobId: string | number): Promise<JobItem> {
  return requestJson<JobItem>(`/api/jobs/${encodeURIComponent(String(jobId))}`);
}

export function createJob(payload: Omit<JobItem, "jobId" | "createdAt" | "viewCount" | "companyName" | "companyLogo">): Promise<JobItem> {
  return requestJson<JobItem>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}