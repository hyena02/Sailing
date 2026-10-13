export type StoreVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface StoreMyPageResponse {
  userId: number;
  loginId: string;
  name: string;
  email: string | null;
  phone: string | null;
  storeName: string;
  representative: string;
  address: string;
  region: string | null;
  serviceCountry: string;
  homepage: string | null;
  fax: string | null;
  telegram: string | null;
  kakaoId: string | null;
  kakaoOpenchat: string | null;
  servicePorts: string | null;
  serviceDetails: string | null;
  remarks: string | null;
  verificationStatus: StoreVerificationStatus | string;
}

export interface StoreMyPageUpdateRequest {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  representative: string;
  address: string;
  region: string;
  serviceCountry: string;
  homepage: string;
  fax: string;
  telegram: string;
  kakaoId: string;
  kakaoOpenchat: string;
  servicePorts: string;
  serviceDetails: string;
  remarks: string;
}
