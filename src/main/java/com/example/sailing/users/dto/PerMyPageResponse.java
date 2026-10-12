package com.example.sailing.users.dto;

public record PerMyPageResponse(
        Long userId,
        String loginId,
        String role,
        String name,
        String email,
        String phone,
        String nickname,
        String birthDate,
        String gender,
        String nationality,
        String introduction
) {
}