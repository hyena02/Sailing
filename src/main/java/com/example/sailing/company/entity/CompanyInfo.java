package com.example.sailing.company.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "COMPANY_INFO")
public class CompanyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPANY_INFO_ID")
    private Long companyInfoId;

    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @Column(name = "COMPANY_NAME", nullable = false, length = 200)
    private String companyName;

    @Column(name = "BUSINESS_NUMBER", nullable = false, length = 20, unique = true)
    private String businessNumber;

    @Column(name = "ADDRESS", nullable = false, length = 500)
    private String address;

    @Column(name = "LOGO_IMAGE", length = 500)
    private String logoImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "VERIFICATION_STATUS", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
    
    public enum VerificationStatus {PENDING, APPROVED, REJECTED}
    public CompanyInfo() {}
    public Long getCompanyInfoId() {return companyInfoId;}
    public Long getUserId() {return userId;}
    public void setUserId(Long userId) {this.userId = userId;}
    public String getCompanyName() {return companyName;}
    public void setCompanyName(String companyName) {this.companyName = companyName;}
    public String getBusinessNumber() {return businessNumber;}
    public void setBusinessNumber(String businessNumber) {this.businessNumber = businessNumber;}
    public String getAddress() {return address;}
    public void setAddress(String address) {this.address = address;}
    public String getLogoImage() {return logoImage;}
    public void setLogoImage(String logoImage) {this.logoImage = logoImage;}
    public VerificationStatus getVerificationStatus() {return verificationStatus;}
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus;}
    public LocalDateTime getCreatedAt() {return createdAt;}
    public LocalDateTime getUpdatedAt() {return updatedAt;}


    //mypage에서 수정 가능한 정보
    public void updateComInfo(
        String companyName,
        String address,
        String logoImage

    ){
        this.companyName = companyName;
        this.address = address;
        this.logoImage = logoImage;
    }
}//


