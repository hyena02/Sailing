export interface CommunityPost {
  postId: number;
  userId?: number;
  nickname?: string | null;
  category: string;
  title: string;
  content?: string | null;
  viewCount?: number;
  commentCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  createdAt?: string;
}

export interface CommunityComment {
  commentId: number;
  postId: number;
  userId?: number;
  nickname?: string | null;
  content: string;
  createdAt?: string;
}
