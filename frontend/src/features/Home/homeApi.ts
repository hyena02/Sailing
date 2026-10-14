import type { HomeData } from "./homeTypes";

export const emptyHome: HomeData = {
  stats: { activeJobs: 0, companies: 0, todayJobs: 0, members: 0 },
  urgentJobs: [],
  recentJobs: [],
  categories: [],
  posts: [],
};


export async function fetchHomeData(): Promise<HomeData> {
  const response = await fetch("/api/home", { credentials: "include" });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : `홈 데이터를 불러오지 못했습니다. (${response.status})`;
    throw new Error(message);
  }

  return data as HomeData;
}