
package com.example.sailing.community.entity;

import java.time.LocalDateTime;

import com.example.sailing.users.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "COMMUNITY_COMMENT")
public class CommunityComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMMENT_ID")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "POST_ID", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "CONTENT", nullable = false, length = 2000)
    private String content;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status = "ACTIVE";

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    protected CommunityComment() {
    }

    public CommunityComment(
            CommunityPost post,
            User user,
            String content
    ) {
        this.post = post;
        this.user = user;
        this.content = content;
        this.status = "ACTIVE";

        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    public Long getCommentId() {
        return commentId;
    }

    public CommunityPost getPost() {
        return post;
    }

    public User getUser() {
        return user;
    }

    public String getContent() {
        return content;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
