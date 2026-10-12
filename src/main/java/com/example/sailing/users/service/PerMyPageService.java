package com.example.sailing.users.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sailing.users.dto.PerMyPageResponse;
import com.example.sailing.users.dto.PerMyPageUpdateRequest;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserInfo;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.repository.UserInfoRepository;
import com.example.sailing.users.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class PerMyPageService {

    private final UserInfoRepository userInfoRepository;
    private final UserRepository userRepository;

    public PerMyPageService(
            UserRepository userRepository,
            UserInfoRepository userInfoRepository
    ) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }

    // 로그인한 일반회원의 정보 조회
    public PerMyPageResponse getMyPage(Long userId) {

        User user = findPersonalUser(userId);

        UserInfo info = userInfoRepository
            .findByUser_UserId(userId)
            .orElseThrow(() ->
                new IllegalArgumentException("회원 정보를 찾을 수 없습니다.")
        );
        return toResponse(user, info);
    }

    // 회원 정보 MyPage에서 수정

    @Transactional
    public PerMyPageResponse updateMyPage(
            Long userId,
            PerMyPageUpdateRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException("수정할 정보를 전달해주세요.");
    }

        User user = findPersonalUser(userId);

        UserInfo info = userInfoRepository
            .findByUser_UserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("회원 상세 정보를 찾을 수 없습니다.")
            );  

        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("이름을 입력해주세요.");
        }

        if (request.nickname() == null || request.nickname().isBlank()) {
            throw new IllegalArgumentException("닉네임을 입력해주세요.");
        }

        if (request.birthDate() == null || request.birthDate().isBlank()) {
            throw new IllegalArgumentException("생년월일을 입력해주세요.");
        }

        LocalDate birthDate;

        try {
            birthDate = LocalDate.parse(request.birthDate());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "생년월일 형식을 확인해주세요. (예: 1990-01-01)"
            );
        }

        String email = request.email() == null
                || request.email().isBlank()
                ? null : request.email().trim();
        String phone = request.phone() == null
                || request.phone().isBlank()
                ? null : request.phone().trim();
        String introduction = request.introduction() == null
                || request.introduction().isBlank()
                ? null : request.introduction().trim();
        String nickname = request.nickname().trim();
        if (userRepository.existsByEmailAndUserIdNot(
                email, userId
        ) && email != null) {
            throw new IllegalArgumentException(
                    "이미 사용 중인 이메일입니다."
            );
        }
        if (userInfoRepository.existsByNicknameAndUser_UserIdNot(
                nickname, userId
        )) {
            throw new IllegalArgumentException(
                    "이미 사용 중인 닉네임입니다."
            );
        }
        user.updatePersonalContactInfo(
                request.name().trim(),
                email,
                phone
        );

        info.updatePersonalInfo(
                nickname,
                birthDate,
                request.gender(),
                request.nationality(),
                introduction
        );

        return toResponse(user, info);
    }
    // 회원 ID로 계정을 조회하고 일반회원인지 확인
    private User findPersonalUser(Long userId) {

        User user = userRepository.findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException("회원 정보를 찾을 수 없습니다.")
        );

        if (user.getRole() != UserRole.USER) {
            throw new IllegalStateException("일반회원만 이용할 수 있습니다.");
        }
        return user;
    }

    // Entity를 응답 DTO로 변환
    private PerMyPageResponse toResponse(
        User user,
        UserInfo info
    ) {
        return new PerMyPageResponse(
            user.getUserId(),
            user.getLoginId(),
            user.getRole().name(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            info.getNickname(),
            info.getBirthDate() == null
                    ? ""
                    : info.getBirthDate().toString(),
            info.getGender(),
            info.getNationality(),
            info.getIntroduction()
        );
    }
}