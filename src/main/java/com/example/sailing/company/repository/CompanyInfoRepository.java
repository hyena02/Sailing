package com.example.sailing.company.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.company.entity.CompanyInfo;

public interface CompanyInfoRepository extends JpaRepository<CompanyInfo, Long>{

    Optional<CompanyInfo> findByUserId(Long userId);

    boolean existsByBusinessNumber(String businessNumber);
}