import { requestJson } from "../../lib/api";

export interface TalentItem {
  userInfoId: number;
  userId?: number;
  nickname?: string | null;
  name?: string | null;
  introduction?: string | null;
  positionName?: string | null;
  experience?: string | null;
  desiredLocation?: string | null;
  nationality?: string | null;
  skills?: string[] | null;
  createdAt?: string;
}

export function getTalents(): Promise<TalentItem[]> {
  return requestJson<TalentItem[]>("/api/talents");
}