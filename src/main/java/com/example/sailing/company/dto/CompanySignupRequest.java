package com.example.sailing.company.dto;

public record CompanySignupRequest(
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