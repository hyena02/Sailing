import { requestJson } from "../../lib/api";
import type {
  CommunityComment,
  CommunityPost,
} from "./communityTypes";

export function getCommunityPosts(): Promise<CommunityPost[]> {
  return requestJson<CommunityPost[]>("/api/community");
}

export function getCommunityPost(
  postId: string | number,
): Promise<CommunityPost> {
  return requestJson<CommunityPost>(
    `/api/community/${encodeURIComponent(String(postId))}`,
  );
}

export function createCommunityPost(
  payload: Pick<CommunityPost, "category" | "title" | "content">,
): Promise<CommunityPost> {
  return requestJson<CommunityPost>("/api/community", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCommunityComments(
  postId: string | number,
): Promise<CommunityComment[]> {
  return requestJson<CommunityComment[]>(
    `/api/community/${encodeURIComponent(String(postId))}/comments`,
  );
}

export function createCommunityComment(
  postId: string | number,
  payload: Pick<CommunityComment, "content">,
): Promise<CommunityComment> {
  return requestJson<CommunityComment>(
    `/api/community/${encodeURIComponent(String(postId))}/comments`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
