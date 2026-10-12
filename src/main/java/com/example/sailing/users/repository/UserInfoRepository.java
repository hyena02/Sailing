
package com.example.sailing.users.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.users.entity.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    boolean existsByNickname(String nickname);
    // 특정 회원 정보 조회
    Optional<UserInfo> findByUser_UserId(Long userId);
    //본인 외 다른 회원의 닉네임과 중복되는지 확인
    boolean existsByNicknameAndUser_UserIdNot(String nickname, Long userId);

}