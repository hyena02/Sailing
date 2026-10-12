package com.example.sailing.users.dto;

public record PerSignupRequest(
    String loginId,
    String password,
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