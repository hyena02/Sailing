package com.example.sailing.company.dto;

public record ComSignupRequest(
    String loginId,
    String password,
    String name,
    String email,
    String phone,

    String companyName,
    String businessNumber,
    String address,
    String logoImage
) {
    
}