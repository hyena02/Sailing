package com.example.sailing.store.service;

import com.example.sailing.store.dto.StoreMyPageResponse;
import com.example.sailing.store.dto.StoreMyPageUpdateRequest;
import com.example.sailing.store.entity.StoreInfo;
import com.example.sailing.store.repository.StoreInfoRepository;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreMyPageService {

    private final UserRepository userRepository;
    private final StoreInfoRepository storeInfoRepository;

    public StoreMyPageService(
        UserRepository userRepository,
        StoreInfoRepository storeInfoRepository
    ) {
        this.userRepository = userRepository;
        this.storeInfoRepository = storeInfoRepository;
    }

    // 로그인한 업체회원의 마이페이지 정보 조회
    @Transactional(readOnly = true)
    public StoreMyPageResponse getMyPage(Long userId) {
        User user = findStoreUser(userId);
        StoreInfo storeInfo = findStoreInfo(userId);
        return toResponse(user, storeInfo);
    }

    // 로그인한 업체회원의 마이페이지 정보 수정
    @Transactional
    public StoreMyPageResponse updateMyPage(
        Long userId,
        StoreMyPageUpdateRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException("수정할 정보를 전달해주세요.");
        }

        User user = findStoreUser(userId);
        StoreInfo storeInfo = findStoreInfo(userId);

        String name = required(request.name(), "대표 담당자 이름");
        String storeName = required(request.storeName(), "업체명");
        String representative = required(request.representative(), "대표자 이름");
        String address = required(request.address(), "업체 주소");
        String serviceCountry = required(request.serviceCountry(), "서비스 가능 국가");

        String email = optional(request.email());
        if (email != null
            && userRepository.existsByEmailAndUserIdNot(email, userId)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        String phone = optional(request.phone());

        // USERS 테이블에 공통 담당자 연락처 정보를 반영합니다.
        user.updatePersonalContactInfo(name, email, phone);

        // 기존 STORE_INFO 엔티티에 실제 존재하는 컬럼만 수정합니다.
        storeInfo.setStoreName(storeName);
        storeInfo.setRepresentative(representative);
        storeInfo.setAddress(address);
        storeInfo.setRegion(optional(request.region()));
        storeInfo.setServiceCountry(serviceCountry);
        storeInfo.setHomepage(optional(request.homepage()));
        storeInfo.setFax(optional(request.fax()));
        storeInfo.setTelegram(optional(request.telegram()));
        storeInfo.setKakaoId(optional(request.kakaoId()));
        storeInfo.setKakaoOpenchat(optional(request.kakaoOpenchat()));
        storeInfo.setServicePorts(optional(request.servicePorts()));
        storeInfo.setServiceDetails(optional(request.serviceDetails()));
        storeInfo.setRemarks(optional(request.remarks()));

        userRepository.save(user);
        storeInfoRepository.save(storeInfo);

        // verificationStatus는 사용자가 임의로 바꿀 수 없도록 수정하지 않습니다.
        return toResponse(user, storeInfo);
    }

    private User findStoreUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        if (user.getRole() != UserRole.STORE) {
            throw new IllegalStateException("업체회원만 이용할 수 있습니다.");
        }
        return user;
    }

    private StoreInfo findStoreInfo(Long userId) {
        return storeInfoRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("업체 정보를 찾을 수 없습니다."));
    }

    private StoreMyPageResponse toResponse(User user, StoreInfo storeInfo) {
        return new StoreMyPageResponse(
            user.getUserId(),
            user.getLoginId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            storeInfo.getStoreName(),
            storeInfo.getRepresentative(),
            storeInfo.getAddress(),
            storeInfo.getRegion(),
            storeInfo.getServiceCountry(),
            storeInfo.getHomepage(),
            storeInfo.getFax(),
            storeInfo.getTelegram(),
            storeInfo.getKakaoId(),
            storeInfo.getKakaoOpenchat(),
            storeInfo.getServicePorts(),
            storeInfo.getServiceDetails(),
            storeInfo.getRemarks(),
            storeInfo.getVerificationStatus() == null
                ? "PENDING"
                : storeInfo.getVerificationStatus().name()
        );
    }

    private String required(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + "을(를) 입력해주세요.");
        }
        return value.trim();
    }

    private String optional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
