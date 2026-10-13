
package com.example.sailing.company.controller;

import com.example.sailing.company.dto.ComMyPageResponse;
import com.example.sailing.company.dto.ComMyPageUpdateRequest;
import com.example.sailing.company.service.ComMyPageService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me/company")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class ComMyPageController {

    private final ComMyPageService comMyPageService;

    // 생성자 주입
    public ComMyPageController(ComMyPageService comMyPageService) {
        this.comMyPageService = comMyPageService;
    }

    // 내 기업회원 정보 조회
    @GetMapping
    public ResponseEntity<?> getMyPage(HttpServletRequest request) {

        Long userId = getLoginUserId(request);

        // 로그인 여부 확인
        if (userId == null) {
            return error(
                HttpStatus.UNAUTHORIZED,
                "로그인이 필요합니다."
            );
        }

        // 기업회원인지 확인
        if (!isCompanyUser(request)) {
            return error(
                HttpStatus.FORBIDDEN,
                "기업회원만 이용할 수 있습니다."
            );
        }

        try {
            ComMyPageResponse response =
                comMyPageService.getMyPage(userId);

            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            return error(HttpStatus.FORBIDDEN, e.getMessage());

        } catch (IllegalArgumentException e) {
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // 내 기업회원 정보 수정
    @PutMapping
    public ResponseEntity<?> updateMyPage(
        @RequestBody ComMyPageUpdateRequest updateRequest,
        HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);

        // 로그인 여부 확인
        if (userId == null) {
            return error(
                HttpStatus.UNAUTHORIZED,
                "로그인이 필요합니다."
            );
        }

        // 기업회원인지 확인
        if (!isCompanyUser(request)) {
            return error(
                HttpStatus.FORBIDDEN,
                "기업회원만 이용할 수 있습니다."
            );
        }
        try {
            ComMyPageResponse response =
                comMyPageService.updateMyPage(userId, updateRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return error(HttpStatus.FORBIDDEN, e.getMessage());

        } catch (IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // 세션에서 로그인한 사용자 ID 가져오기
    private Long getLoginUserId(HttpServletRequest request) {

        // 세션이 없으면 새로 만들지 않고 null 반환
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        Object loginUserId = session.getAttribute("LOGIN_USER_ID");
        if (loginUserId instanceof Number number) {
            return number.longValue();
        }
        if (loginUserId instanceof String value) {
            try {
                return Long.parseLong(value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
    // 로그인한 사용자의 역할 확인
    private boolean isCompanyUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        Object loginRole = session.getAttribute("LOGIN_ROLE");
        return "COMPANY".equals(String.valueOf(loginRole));
    }
    // 공통 오류 응답
    private ResponseEntity<Map<String, String>> error(
        HttpStatus status,
        String message
    ) {
        return ResponseEntity
            .status(status)
            .body(Map.of("message", message));
    }
}
