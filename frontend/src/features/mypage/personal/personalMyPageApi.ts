import type {
  PerMyPageResponse,
  PerMyPageUpdateRequest,
} from "./personalMyPageTypes";

const API_URL =
  "http://localhost:8080/api/users/me/personal";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...init,

    // 로그인 세션 쿠키를 백엔드에 전달
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(
            (data as { message: unknown }).message
          )
        : `요청에 실패했습니다. (${response.status})`;

    throw new ApiError(response.status, message);
  }

  return data as T;
}

// 내 정보 조회
export function getPersonalMyPage():
  Promise<PerMyPageResponse> {
  return request<PerMyPageResponse>(API_URL, {
    method: "GET",
  });
}

// 내 정보 수정
export function updatePersonalMyPage(
  profile: PerMyPageUpdateRequest
): Promise<PerMyPageResponse> {
  return request<PerMyPageResponse>(API_URL, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}