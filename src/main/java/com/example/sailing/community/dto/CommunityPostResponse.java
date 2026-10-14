package com.example.sailing.community.dto;

import java.time.LocalDateTime;

public record CommunityPostResponse(
    Long postId,
    Long userId,
    String nickname,
    String category,
    String title,
    String content,
    int viewCount,
    int commentCount,
    int likeCount,
    int dislikeCount,
    LocalDateTime createdAt
) {
}
