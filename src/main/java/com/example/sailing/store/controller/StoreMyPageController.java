package com.example.sailing.store.controller;

import com.example.sailing.store.dto.StoreMyPageResponse;
import com.example.sailing.store.dto.StoreMyPageUpdateRequest;
import com.example.sailing.store.service.StoreMyPageService;

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
@RequestMapping("/api/users/me/store")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StoreMyPageController {

    private final StoreMyPageService storeMyPageService;

    public StoreMyPageController(StoreMyPageService storeMyPageService) {
        this.storeMyPageService = storeMyPageService;
    }

    // 내 업체회원 정보 조회
    @GetMapping
    public ResponseEntity<?> getMyPage(HttpServletRequest request) {
        Long userId = getLoginUserId(request);
        if (userId == null) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        if (!isStoreUser(request)) {
            return error(HttpStatus.FORBIDDEN, "업체회원만 이용할 수 있습니다.");
        }

        try {
            StoreMyPageResponse response = storeMyPageService.getMyPage(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return error(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // 내 업체회원 정보 수정
    @PutMapping
    public ResponseEntity<?> updateMyPage(
        @RequestBody StoreMyPageUpdateRequest updateRequest,
        HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);
        if (userId == null) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        if (!isStoreUser(request)) {
            return error(HttpStatus.FORBIDDEN, "업체회원만 이용할 수 있습니다.");
        }

        try {
            StoreMyPageResponse response = storeMyPageService.updateMyPage(userId, updateRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return error(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    private Long getLoginUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }

        Object value = session.getAttribute("LOGIN_USER_ID");
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private boolean isStoreUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null
            && "STORE".equals(String.valueOf(session.getAttribute("LOGIN_ROLE")));
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
