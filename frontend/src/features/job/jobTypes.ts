export interface JobItem {
  jobId: number;
  companyInfoId?: number;
  companyName?: string | null;
  companyLogo?: string | null;
  title: string;
  positionName: string;
  vesselType?: string | null;
  location: string;
  salary?: string | null;
  salaryVisible?: boolean;
  experience?: string | null;
  employmentType?: string | null;
  workSchedule?: string | null;
  duties?: string | null;
  requirements?: string | null;
  description?: string | null;
  recruitmentSteps?: string | null;
  deadlineDate?: string | null;
  isAlwaysOpen?: boolean;
  jobStatus?: "OPEN" | "CLOSED" | "DRAFT" | string;
  viewCount?: number;
  createdAt?: string;
}