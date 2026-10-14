
package com.example.sailing.community.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sailing.community.entity.CommunityPost;

public interface CommunityPostRepository
        extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findByStatusOrderByCreatedAtDesc(
        String status
    );

    Optional<CommunityPost> findByPostIdAndStatus(
        Long postId,
        String status
    );
}
