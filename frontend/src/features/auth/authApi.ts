// 로그인 화면에서 직접 fetch()작성하지 않고, Backend API 요청만 담당하는 ts
const API_BASE_URL = "http://localhost:8080/api/users";


export type LoginResponse = {
  userId: number;
  loginId: string;
  name: string;
  role: "USER" | "COMPANY" | "STORE" | "ADMIN";
};

export async function login(
  loginId: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ loginId, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `로그인에 실패했습니다. (${response.status})`
    );
  }

  return data as LoginResponse;
}