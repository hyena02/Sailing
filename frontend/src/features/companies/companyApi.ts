import { requestJson } from "../../lib/api";
import type { CompanyItem } from "./companyTypes";

export function getCompanies(): Promise<CompanyItem[]> {
  return requestJson<CompanyItem[]>("/api/companies");
}

export function getCompany(companyId: string | number): Promise<CompanyItem> {
  return requestJson<CompanyItem>(`/api/companies/${encodeURIComponent(String(companyId))}`);
}