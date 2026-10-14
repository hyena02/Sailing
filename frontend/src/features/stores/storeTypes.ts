export interface StoreItem {
  storeInfoId?: number;
  storeId?: number;
  storeName: string;
  representative?: string | null;
  address?: string | null;
  region?: string | null;
  serviceCountry?: string | null;
  homepage?: string | null;
  phone?: string | null;
  email?: string | null;
  servicePorts?: string | null;
  serviceDetails?: string | null;
  remarks?: string | null;
  logoImage?: string | null;
  featureImage?: string | null;
  introduction?: string | null;
  verificationStatus?: string | null;
  createdAt?: string;
}