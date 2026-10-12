
export interface PerMyPageResponse {
  userId: number;
  loginId: string;
  role: "USER" | "COMPANY" | "STORE" | "ADMIN";
  name: string;
  email: string | null;
  phone: string | null;
  nickname: string;
  birthDate: string;
  gender: "M" | "F";
  nationality: "DOMESTIC" | "FOREIGN";
}

export interface PerMyPageUpdateRequest {
  name: string;
  email: string;
  phone: string;
  nickname: string;
  birthDate: string;
  gender: string;
  nationality: string;
}
