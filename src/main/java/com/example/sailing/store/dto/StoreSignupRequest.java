package com.example.sailing.store.dto;


public record StoreSignupRequest(
    String loginId,
    String password,
    String name,
    String email,
    String phone,
    String storeName,
    String representative,
    String address,
    String region,
    String serviceCountry,
    String homepage,
    String fax,
    String telegram,
    String kakaoId,
    String kakaoOpenchat,
    String servicePorts,
    String serviceDetails,
    String remarks
) {
}