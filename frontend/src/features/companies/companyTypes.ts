export interface CompanyItem {
  companyInfoId: number;
  companyName: string;
  address?: string | null;
  logoImage?: string | null;
  homepage?: string | null;
  introduction?: string | null;
  verificationStatus?: string | null;
  createdAt?: string;
}