package com.example.sailing.users.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sailing.users.dto.PersonalSignupRequest;
import com.example.sailing.users.dto.UserDTO;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserInfo;
import com.example.sailing.users.entity.UserRole;
import com.example.sailing.users.entity.UserStatus;
import com.example.sailing.users.repository.UserInfoRepository;
import com.example.sailing.users.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserInfoRepository userInfoRepository;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        UserInfoRepository userInfoRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userInfoRepository = userInfoRepository;
    }

// 일반회원가입
    @Transactional
    public Long signupPersonal(PersonalSignupRequest request) {

        // loginId 필수 확인
        if (request.loginId() == null || request.loginId().isBlank()){
            throw new IllegalArgumentException("로그인 ID는 필수입니다.");
        }
        // 로그인 ID 중복확인 (loginId)
        if (userRepository.existsByLoginId(request.loginId())){
            throw new IllegalArgumentException("이미 존재하는 ID입니다.");
        }
        // 이메일 중복확인 (email)
        if (request.email() != null && !request.email().isBlank() && userRepository.existsByEmail(request.email())){
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 닉네임 필수 확인
        if (request.nickname() == null || request.nickname().isBlank()){
            throw new IllegalArgumentException("닉네임은 필수입니다.");
        }
        // 닉네임 중복확인 (nickname)
        if (userInfoRepository.existsByNickname(request.nickname())){
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }
        // 생년월일 변환
        LocalDate birthDate;
        try {
            birthDate = LocalDate.parse(request.birthDate());
        } catch (DateTimeParseException | NullPointerException e) {
            throw new IllegalArgumentException("생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)");
        }
        // 성별 확인
        if (request.gender() == null || request.gender().isBlank()) {
            throw new IllegalArgumentException("필수사항입니다. 선택해주세요.");
        }
        // 국적 확인
        if (request.nationality() == null || request.nationality().isBlank()) {
            throw new IllegalArgumentException("필수사항입니다. 선택해주세요.");
        }

        
        // 비밀번호 해싱, 암호화
        String passwordHash = passwordEncoder.encode(request.password());

        // 사용자 엔티티 생성(USERS 테이블에 저장될 객체)
        User user = new User(
            request.loginId(),
            passwordHash,
            request.name(),
            request.email(),
            request.phone(),
            UserRole.USER, 
            UserStatus.ACTIVE 
        );

        // db에 저장하기(UserRepository에 사용자 먼저 저장해야 UserId가 생성됨)
        userRepository.save(user);

        //USER_INFO 테이블에 저장될 객체 생성
        UserInfo userInfo = new UserInfo(
            user,
            request.nickname(),
            birthDate,
            request.gender(),
            request.nationality()
        );
        // db에 저장하기(UserInfoRepository에 사용자 정보 저장)
        userInfoRepository.save(userInfo);

        // 생성된 사용자 ID 반환 (Controller는 이 반환값을 받아 HTTP 응답으로 전달)
        return user.getUserId();
    }
    // 아이디 중복 확인
    public boolean existsByLoginId(String loginId){
        if(loginId == null || loginId.isBlank()){
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }
        return userRepository.existsByLoginId(loginId);
    }
    // 모든 사용자 조회
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(user -> new UserDTO(
                user.getUserId(),
                user.getLoginId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getStatus().name()
            ))
        .toList();  
    }
}