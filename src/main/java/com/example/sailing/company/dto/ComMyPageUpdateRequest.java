package com.example.sailing.company.dto;

public record ComMyPageUpdateRequest(
    String name,
    String email,
    String phone,
    String companyName,
    String address,
    String logoImage
) {
}
