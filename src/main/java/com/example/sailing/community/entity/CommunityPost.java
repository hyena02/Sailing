
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
@Table(name = "COMMUNITY")
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POST_ID")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "CATEGORY", nullable = false, length = 40)
    private String category;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "CONTENT", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "VIEW_COUNT", nullable = false)
    private int viewCount = 0;

    @Column(name = "COMMENT_COUNT", nullable = false)
    private int commentCount = 0;

    @Column(name = "LIKE_COUNT", nullable = false)
    private int likeCount = 0;

    @Column(name = "DISLIKE_COUNT", nullable = false)
    private int dislikeCount = 0;

    @Column(name = "IS_HOT", nullable = false)
    private boolean hot = false;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status = "ACTIVE";

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    protected CommunityPost() {
    }

    public CommunityPost(
            User user,
            String category,
            String title,
            String content
    ) {
        this.user = user;
        this.category = category;
        this.title = title;
        this.content = content;
        this.status = "ACTIVE";

        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void increaseCommentCount() {
        this.commentCount++;
    }

    public Long getPostId() {
        return postId;
    }

    public User getUser() {
        return user;
    }

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public int getViewCount() {
        return viewCount;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public int getDislikeCount() {
        return dislikeCount;
    }

    public boolean isHot() {
        return hot;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
