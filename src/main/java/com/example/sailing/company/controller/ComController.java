package com.example.sailing.company.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sailing.company.service.CompanyService;
import com.example.sailing.company.dto.ComSignupRequest;


@RestController 
@RequestMapping ("api/companies")
@CrossOrigin (
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class ComController {
    private final CompanyService companyService;

    public ComController(CompanyService companyService){
        this.companyService = companyService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody ComSignupRequest request) {
        
        try {
            Long userId = companyService.signup(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                        "message", "기업 회원가입이 완료되었습니다.",
                        "userId", userId
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }    
}