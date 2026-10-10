package com.example.sailing.users.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.users.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {


    // 사용자 존재 여부 확인 메서드(loginId, email)
    boolean existsByLoginId(String loginId);
    boolean existsByEmail(String email);
}
