
package com.example.sailing.store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "STORE_INFO")
public class StoreInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STORE_INFO_ID")
    private Long storeInfoId;

    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @Column(name = "STORE_NAME", nullable = false, length = 255)
    private String storeName;

    @Column(name = "REPRESENTATIVE", nullable = false, length = 100)
    private String representative;

    @Column(name = "ADDRESS", nullable = false, length = 500)
    private String address;

    @Column(name = "REGION", length = 100)
    private String region;

    @Column(name = "SERVICE_COUNTRY", nullable = false, length = 100)
    private String serviceCountry;

    @Column(name = "LATITUDE", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "LONGITUDE", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "HOMEPAGE", length = 500)
    private String homepage;

    @Column(name = "FAX", length = 30)
    private String fax;

    @Column(name = "TELEGRAM", length = 100)
    private String telegram;

    @Column(name = "KAKAO_ID", length = 100)
    private String kakaoId;

    @Column(name = "KAKAO_OPENCHAT", length = 500)
    private String kakaoOpenchat;

    @Column(name = "SERVICE_PORTS", columnDefinition = "TEXT")
    private String servicePorts;

    @Column(name = "SERVICE_DETAILS", columnDefinition = "TEXT")
    private String serviceDetails;

    @Column(name = "REMARKS", columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "VERIFICATION_STATUS", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }

    public StoreInfo() {
    }

    public Long getStoreInfoId() {
        return storeInfoId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getRepresentative() {
        return representative;
    }

    public void setRepresentative(String representative) {
        this.representative = representative;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getServiceCountry() {
        return serviceCountry;
    }

    public void setServiceCountry(String serviceCountry) {
        this.serviceCountry = serviceCountry;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getHomepage() {
        return homepage;
    }

    public void setHomepage(String homepage) {
        this.homepage = homepage;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getTelegram() {
        return telegram;
    }

    public void setTelegram(String telegram) {
        this.telegram = telegram;
    }

    public String getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }

    public String getKakaoOpenchat() {
        return kakaoOpenchat;
    }

    public void setKakaoOpenchat(String kakaoOpenchat) {
        this.kakaoOpenchat = kakaoOpenchat;
    }

    public String getServicePorts() {
        return servicePorts;
    }

    public void setServicePorts(String servicePorts) {
        this.servicePorts = servicePorts;
    }

    public String getServiceDetails() {
        return serviceDetails;
    }

    public void setServiceDetails(String serviceDetails) {
        this.serviceDetails = serviceDetails;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
