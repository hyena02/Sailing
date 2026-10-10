package com.example.sailing.users.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "USER_INFO")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userIdfoId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "NICKNAME", nullable = false, unique = true, length = 50)
    private String nickname;
    @Column(name = "BIRTH_DATE", nullable = false)
    private LocalDate birthDate;
    @Column(name = "GENDER", nullable = false)
    private String gender;
    @Column(name = "NATIONALITY", nullable = false)
    private String nationality;
    @Column(name="CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name="UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    protected UserInfo() {
        // JPA requires a default constructor
    }
    // 생성자
    public UserInfo(User user, String nickname, LocalDate birthDate, String gender, String nationality) {
        this.user = user;
        this.nickname = nickname;
        this.birthDate = birthDate;
        this.gender = gender;
        this.nationality = nationality;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    // Getters
    public Long getUserInfoId() {return userIdfoId;}
    public User getUser() {return user;}
    public String getNickname() {return nickname;} 
    public LocalDate getBirthDate() {return birthDate;}
    public String getGender() {return gender;}
    public String getNationality() {return nationality;}
    public LocalDateTime getCreatedAt() {return createdAt;}
    public LocalDateTime getUpdatedAt() {return updatedAt;}


}
