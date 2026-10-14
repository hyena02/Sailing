import { requestJson } from "../../lib/api";
import type { StoreItem } from "./storeTypes";

export function getStores(): Promise<StoreItem[]> {
  return requestJson<StoreItem[]>("/api/stores");
}

export function getStore(storeId: string | number): Promise<StoreItem> {
  return requestJson<StoreItem>(`/api/stores/${encodeURIComponent(String(storeId))}`);
}