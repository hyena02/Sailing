package com.example.sailing.users.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.users.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {


    // 사용자 존재 여부 확인 메서드(loginId, email)
    boolean existsByLoginId(String loginId);
    boolean existsByEmail(String email);
    // 로그인 -> 회원 비밀번호 해시와 계정상태 확인해야하기때문에 User객체를 조회해야하는 용도
    Optional<User> findByLoginId(String loginId);
    // 본인 외 다른 회원이 같은 이메일을 사용하고 있는지 확인
    boolean existsByEmailAndUserIdNot(String email, Long userId);
}
