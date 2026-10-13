package com.example.sailing.store.dto;

public record StoreMyPageUpdateRequest(
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
