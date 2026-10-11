package com.example.sailing.users.dto;

public record LoginRequest (    
    String loginId,
    String password
){} 
// Frontend가 보낼 loginId와 password의 형태를 정의하는 파일