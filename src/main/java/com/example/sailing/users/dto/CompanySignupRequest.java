package com.example.sailing.users.dto;

public record CompanySignupRequest(
    String loginId,
    String password,
    String name,
    String email,
    String phone,
    String storeName,
    String address,
    String serviceCountry,
    String homepage,
    String fax,
    String telegram,
    String kakaoId,
    String kakaoOpenChat,
    String servicePorts,
    String serviceDetails,
    String remarks
) {
    
}