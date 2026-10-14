package com.example.sailing.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sailing.community.entity.CommunityComment;

public interface CommunityCommentRepository
        extends JpaRepository<CommunityComment, Long> {

    List<CommunityComment>
        findByPost_PostIdAndStatusOrderByCreatedAtAsc(
            Long postId,
            String status
        );
}
