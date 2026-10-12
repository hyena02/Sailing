
package com.example.sailing.store.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sailing.store.dto.StoreSignupRequest;
import com.example.sailing.store.service.StoreService;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody StoreSignupRequest request) {
        try {
            Long userId = storeService.signup(request);

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "업체 회원가입이 완료되었습니다.",
                    "userId", userId
                ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }//signup

}// class
