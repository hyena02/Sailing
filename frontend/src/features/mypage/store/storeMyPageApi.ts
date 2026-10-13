import type {
  StoreMyPageResponse,
  StoreMyPageUpdateRequest,
} from "./storeMyPageTypes";

const API_URL = "http://localhost:8080/api/users/me/store";

export class StoreMyPageApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "StoreMyPageApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
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
    throw new StoreMyPageApiError(response.status, message);
  }
  return data as T;
}

export function getStoreMyPage(): Promise<StoreMyPageResponse> {
  return request<StoreMyPageResponse>(API_URL, { method: "GET" });
}

export function updateStoreMyPage(
  profile: StoreMyPageUpdateRequest,
): Promise<StoreMyPageResponse> {
  return request<StoreMyPageResponse>(API_URL, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}
