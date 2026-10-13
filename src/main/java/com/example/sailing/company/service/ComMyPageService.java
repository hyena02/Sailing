package com.example.sailing.company.service;

import com.example.sailing.company.dto.ComMyPageResponse;
import com.example.sailing.company.dto.ComMyPageUpdateRequest;
import com.example.sailing.company.entity.CompanyInfo;
import com.example.sailing.company.repository.CompanyInfoRepository;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ComMyPageService {

    private final UserRepository userRepository;
    private final CompanyInfoRepository companyInfoRepository;

    public ComMyPageService(
        UserRepository userRepository,
        CompanyInfoRepository companyInfoRepository
    ) {
        this.userRepository = userRepository;
        this.companyInfoRepository = companyInfoRepository;
    }

    // 나의 기업회원 정보 조회
    @Transactional(readOnly = true)
    public ComMyPageResponse getMyPage(Long userId) {
        User user = findCompanyUser(userId);
        CompanyInfo companyInfo = findCompanyInfo(userId);
        return toResponse(user, companyInfo);
    }

    // 내 기업회원 정보 수정
    @Transactional
    public ComMyPageResponse updateMyPage(
        Long userId,
        ComMyPageUpdateRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                "수정할 정보가 전달되지 않았습니다."
            );
        }

        User user = findCompanyUser(userId);
        CompanyInfo companyInfo = findCompanyInfo(userId);

        // 필수 입력값 확인
        String name = required(request.name(), "담당자 이름");
        String companyName = required(
            request.companyName(), "기업명"
        );
        String address = required(
            request.address(), "기업 주소"
        );

        // 이메일이 다른 회원과 중복되는지 확인
        String email = optional(request.email());
        if (
            email != null
            && userRepository.existsByEmailAndUserIdNot(
                email, userId
            )
        ) {
            throw new IllegalArgumentException(
                "이미 사용 중인 이메일입니다."
            );
        }
        String phone = optional(request.phone());

        // USERS 테이블의 개인 연락처 정보 수정
        user.updatePersonalContactInfo(
            name,
            email,
            phone
        );

        // 로고 입력이 없으면 기존 로고 유지
        String logoImage = optional(request.logoImage());

        if (logoImage == null) {
            logoImage = companyInfo.getLogoImage();
        }

        // COMPANY_INFO 테이블의 기업 정보 수정
        companyInfo.updateComInfo(
            companyName,
            address,
            logoImage
        );

        // 변경사항 저장
        userRepository.save(user);
        companyInfoRepository.save(companyInfo);

        return toResponse(user, companyInfo);
    }

    // 사용자 조회 및 기업회원 여부 확인
    private User findCompanyUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "사용자 정보를 찾을 수 없습니다."
                )
            );

        if (user.getRole() != UserRole.COMPANY) {
            throw new IllegalStateException(
                "기업회원만 이용할 수 있습니다."
            );
        }
        return user;
    }

    // 기업 추가 정보 조회
    private CompanyInfo findCompanyInfo(Long userId) {

        return companyInfoRepository.findByUserId(userId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "기업 정보를 찾을 수 없습니다."
                )
            );
    }

    // 조회 응답으로 변환
    private ComMyPageResponse toResponse(
        User user,
        CompanyInfo companyInfo
    ) {
        return new ComMyPageResponse(
            user.getUserId(),
            user.getLoginId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            companyInfo.getCompanyName(),
            companyInfo.getBusinessNumber(),
            companyInfo.getAddress(),
            companyInfo.getLogoImage(),
            companyInfo.getVerificationStatus().name()
        );
    }

    // 필수값 검사
    private String required(String value, String fieldName) {

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                fieldName + "을(를) 입력해주세요."
            );
        }

        return value.trim();
    }

    // 선택값 정리
    private String optional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
