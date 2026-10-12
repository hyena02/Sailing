package com.example.sailing.users.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sailing.users.dto.PerMyPageResponse;
import com.example.sailing.users.dto.PerMyPageUpdateRequest;
import com.example.sailing.users.service.PerMyPageService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController 
@RequestMapping ("/api/users/me/personal")
@CrossOrigin (origins = "http://localhost:5173", allowCredentials = "true")
public class PerMyPageController {
    private final PerMyPageService perMyPageService;

    public PerMyPageController (
        PerMyPageService perMyPageService
    ) {
        this.perMyPageService = perMyPageService;
    }
    // 내정보 조회
    @GetMapping 
    public ResponseEntity<?> getMyePage(
        HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);

        if(userId == null) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다");
        }
        try{
            PerMyPageResponse response = perMyPageService.getMyPage(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e){
            return error( HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e ) {
            return error ( HttpStatus.NOT_FOUND, e.getMessage());
        }
    }//내정보조회

    // 내 정보 수정
    @PutMapping 
    public ResponseEntity<?> updateMyPage(
        @RequestBody PerMyPageUpdateRequest requestBody,
        HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);
        if(userId == null) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        try {
            PerMyPageResponse response = perMyPageService.getMyPage(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e ) {
            return error(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    //로그인할 때 세션에 저장한 사용자 ID확인
    private Long getLoginUserId(
        HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        Object value = session.getAttribute("LOGIN_USER_ID");
        return value instanceof Number number
            ? number.longValue()
            : null;
    }

    private ResponseEntity<Map<String, String>> error(
        HttpStatus status,
        String message
    ) {
        return ResponseEntity
            .status(status)
            .body(Map.of("message", message));
    }
} //
