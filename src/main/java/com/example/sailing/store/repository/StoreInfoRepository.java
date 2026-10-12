package com.example.sailing.store.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sailing.store.entity.StoreInfo;

public interface StoreInfoRepository extends JpaRepository<StoreInfo, Long>{
    Optional<StoreInfo> findByUserId(Long userId);    
}