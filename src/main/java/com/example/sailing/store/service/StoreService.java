package com.example.sailing.store.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.sailing.store.dto.StoreSignupRequest;
import com.example.sailing.store.entity.StoreInfo;
import com.example.sailing.store.repository.StoreInfoRepository;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.entity.UserStatus;
import com.example.sailing.users.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service 
public class StoreService {
    private final UserRepository userRepository;
    private final StoreInfoRepository storeInfoRepository;
    private final PasswordEncoder passwordEncoder;

    public StoreService(
        UserRepository userRepository,
        StoreInfoRepository storeInfoRepository,
        PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.storeInfoRepository = storeInfoRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional 
    public Long signup(StoreSignupRequest request){
    if (request.loginId() == null || request.loginId().isBlank()
                || request.password() == null || request.password().isBlank()
                || request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("아이디, 비밀번호, 이름은 필수입니다.");
        }

        if (userRepository.existsByLoginId(request.loginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (request.email() != null && !request.email().isBlank()
                && userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (request.storeName() == null || request.storeName().isBlank()
                || request.address() == null || request.address().isBlank()) {
            throw new IllegalArgumentException("업체명과 주소는 필수입니다.");
        }

        User user = new User(
            request.loginId(),
            passwordEncoder.encode(request.password()),
            request.name(),
            request.email(),
            request.phone(),
            UserRole.STORE,
            UserStatus.ACTIVE
        );

        User savedUser = userRepository.save(user);

        StoreInfo storeInfo = new StoreInfo();
        storeInfo.setUserId(savedUser.getUserId());
        storeInfo.setStoreName(request.storeName());
        storeInfo.setRepresentative(request.representative());
        storeInfo.setAddress(request.address());
        storeInfo.setRegion(request.region());
        storeInfo.setServiceCountry(request.serviceCountry());
        storeInfo.setHomepage(request.homepage());
        storeInfo.setFax(request.fax());
        storeInfo.setTelegram(request.telegram());
        storeInfo.setKakaoId(request.kakaoId());
        storeInfo.setKakaoOpenchat(request.kakaoOpenchat());
        storeInfo.setServicePorts(request.servicePorts());
        storeInfo.setServiceDetails(request.serviceDetails());
        storeInfo.setRemarks(request.remarks());

        storeInfoRepository.save(storeInfo);

        return savedUser.getUserId();
    }
    
}