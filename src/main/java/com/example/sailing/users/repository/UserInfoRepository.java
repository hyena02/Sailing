
package com.example.sailing.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.users.entity.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    boolean existsByNickname(String nickname);

}