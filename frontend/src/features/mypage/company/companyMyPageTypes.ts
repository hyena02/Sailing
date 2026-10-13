export type CompanyVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CompanyMyPageResponse {
  userId: number;
  loginId: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string;
  businessNumber: string;
  address: string;
  logoImage: string | null;
  verificationStatus: CompanyVerificationStatus | string;
}

export interface CompanyMyPageUpdateRequest {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  logoImage: string | null;
}
