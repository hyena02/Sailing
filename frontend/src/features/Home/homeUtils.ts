import type { JobItem } from "./homeTypes";

// DEADLINE → "D-3" / "오늘마감" / "상시채용"
export function dDay(job: JobItem): string {
  if (job.recruitmentType === "ONGOING" || !job.deadline) return "상시채용";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${job.deadline}T00:00:00`);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return "마감";
  if (diff === 0) return "오늘마감";
  return `D-${diff}`;
}

// CREATED_AT → "2시간 전" / "어제"
export function timeAgo(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  if (day === 1) return "어제";
  if (day < 30) return `${day}일 전`;
  return iso.slice(0, 10);
}