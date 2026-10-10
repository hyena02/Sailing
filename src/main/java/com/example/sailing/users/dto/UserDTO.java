package com.example.sailing.users.dto;

public class UserDTO {

    private Long userId;
    private String loginId;
    private String name;
    private String email;
    private String role;
    private String status;
    private String phone;

    public UserDTO(
            Long userId,
            String loginId,
            String name,
            String email,
            String role,
            String status,
            String phone
    ) {
        this.userId = userId;
        this.loginId = loginId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.phone = phone;
    }

    public Long getUserId() {
        return userId;
    }
    public String getLoginId() {
        return loginId;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public String getRole() {
        return role;
    }
    public String getStatus() {
        return status;
    }
    public String getPhone() {
        return phone;
    }
}

