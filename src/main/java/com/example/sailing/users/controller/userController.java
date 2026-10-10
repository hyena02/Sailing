package com.example.sailing.users.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.example.sailing.users.dto.PersonalSignupRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.sailing.users.dto.UserDTO;
import com.example.sailing.users.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // 회원 목록 조회
    @GetMapping
    public List<UserDTO> findUsers() {
        return userService.getAllUsers();
    }

    // 일반 회원 가입
    @PostMapping("/signup/personal")            // 회원가입 요청을 받을 주소
    @ResponseStatus(HttpStatus.CREATED)        // 회원가입 성공 시 HTTP 상태 코드 201 반환(Created)
    public Long signupPersonal(@RequestBody PersonalSignupRequest request) {     // RequestBody Frontend가 보낸 JSON Data를 Java 객체로 변환
            return userService.signupPersonal(request);
    }

}