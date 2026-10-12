package com.example.sailing.users.dto;

public record PerMyPageUpdateRequest(
    String name,
    String email,
    String phone,
    String nickname,
    String birthDate,
    String gender,
    String nationality,
    String address,
    String introduction
) {
}