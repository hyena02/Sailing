package com.example.sailing.community.dto;

import java.time.LocalDateTime;

public record CommunityCommentResponse(
    Long commentId,
    Long postId,
    Long userId,
    String nickname,
    String content,
    LocalDateTime createdAt
) {
}
