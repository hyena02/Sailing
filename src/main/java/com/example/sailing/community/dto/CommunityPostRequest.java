package com.example.sailing.community.dto;

public record CommunityPostRequest(
    String category,
    String title,
    String content
) {
}
