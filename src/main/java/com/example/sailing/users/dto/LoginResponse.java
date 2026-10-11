package com.example.sailing.users.dto;

public record LoginResponse(
    Long userId,
    String loginId,
    String name,
    String role
) {}
// 로그인한 회원을 화면에서 구분하는데 필요한 최소한의 정보 전달하는 파일