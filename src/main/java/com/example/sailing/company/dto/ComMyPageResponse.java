package com.example.sailing.company.dto;

public record ComMyPageResponse(
    Long userId,
    String loginId,
    String name,
    String email,
    String phone,

    String companyName,
    String businessNumber,
    String address,
    String logoImage,
    String verificationStatus
) {
}
