import type {
  CompanyMyPageResponse,
  CompanyMyPageUpdateRequest,
} from "./companyMyPageTypes";

const API_URL = "/api/users/me/company";

export class CompanyMyPageApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CompanyMyPageApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    // 세션 로그인 쿠키를 백엔드로 전달합니다.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : `요청에 실패했습니다. (${response.status})`;

    throw new CompanyMyPageApiError(response.status, message);
  }

  return data as T;
}

export function getCompanyMyPage(): Promise<CompanyMyPageResponse> {
  return request<CompanyMyPageResponse>(API_URL, {
    method: "GET",
  });
}

export function updateCompanyMyPage(
  profile: CompanyMyPageUpdateRequest,
): Promise<CompanyMyPageResponse> {
  return request<CompanyMyPageResponse>(API_URL, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}