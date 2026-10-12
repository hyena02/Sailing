package com.example.sailing.company.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.sailing.company.dto.CompanySignupRequest;
import com.example.sailing.company.entity.CompanyInfo;
import com.example.sailing.company.repository.CompanyInfoRepository;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.entity.UserStatus;
import com.example.sailing.users.repository.UserRepository;



@Service
public class CompanyService {
    private final PasswordEncoder passwordEncoder;
    private final CompanyInfoRepository companyInfoRepository;
    private final UserRepository userRepository;

    public CompanyService(
        UserRepository userRepository,
        CompanyInfoRepository companyInfoRepository,
        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyInfoRepository = companyInfoRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public Long signup(CompanySignupRequest request){

        // 1. 공통 회원 정보 검증
        if (request.loginId() == null || request.loginId().isBlank()) {
            throw new IllegalArgumentException("로그인 ID는 필수입니다.");
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("담당자명은 필수입니다.");
        }

        if (userRepository.existsByLoginId(request.loginId())) {
            throw new IllegalArgumentException("이미 존재하는 ID입니다.");
        }

        if (request.email() != null && !request.email().isBlank()
                && userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2. 기업 정보 검증
        if (request.companyName() == null
                || request.companyName().isBlank()) {
            throw new IllegalArgumentException("회사명은 필수입니다.");
        }

        if (request.businessNumber() == null
                || request.businessNumber().isBlank()) {
            throw new IllegalArgumentException("사업자등록번호는 필수입니다.");
        }

        if (request.address() == null || request.address().isBlank()) {
            throw new IllegalArgumentException("회사 주소는 필수입니다.");
        }

        if (companyInfoRepository.existsByBusinessNumber(
                request.businessNumber())) {
            throw new IllegalArgumentException(
                    "이미 등록된 사업자등록번호입니다.");
        }

        // 3. 공통 회원 정보 저장
        User user = new User(
                request.loginId(),
                passwordEncoder.encode(request.password()),
                request.name(),
                request.email(),
                request.phone(),
                UserRole.COMPANY,
                UserStatus.ACTIVE
        );

        User savedUser = userRepository.save(user);

        // 4. 기업 정보 저장
        CompanyInfo companyInfo = new CompanyInfo();
        companyInfo.setUserId(savedUser.getUserId());
        companyInfo.setCompanyName(request.companyName());
        companyInfo.setBusinessNumber(request.businessNumber());
        companyInfo.setAddress(request.address());
        companyInfo.setLogoImage(request.logoImage());
        companyInfo.setVerificationStatus(
                CompanyInfo.VerificationStatus.PENDING);

        companyInfoRepository.save(companyInfo);

        // 5. 생성된 회원 ID 반환
        return savedUser.getUserId();
    
    }
}
