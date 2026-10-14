package com.example.sailing.community.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sailing.community.dto.CommunityCommentRequest;
import com.example.sailing.community.dto.CommunityCommentResponse;
import com.example.sailing.community.dto.CommunityPostRequest;
import com.example.sailing.community.dto.CommunityPostResponse;
import com.example.sailing.community.service.CommunityService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(
            CommunityService communityService
    ) {
        this.communityService = communityService;
    }

    // GET /api/community
    @GetMapping
    public List<CommunityPostResponse> getPosts() {
        return communityService.getPosts();
    }

    // GET /api/community/1
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable Long postId
    ) {
        try {
            return ResponseEntity.ok(
                communityService.getPost(postId)
            );
        } catch (IllegalArgumentException e) {
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // POST /api/community
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody CommunityPostRequest requestBody,
            HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);

        if (userId == null) {
            return error(
                HttpStatus.UNAUTHORIZED,
                "로그인이 필요합니다."
            );
        }

        try {
            CommunityPostResponse response =
                communityService.createPost(userId, requestBody);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // GET /api/community/1/comments
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getComments(
            @PathVariable Long postId
    ) {
        try {
            List<CommunityCommentResponse> comments =
                communityService.getComments(postId);

            return ResponseEntity.ok(comments);

        } catch (IllegalArgumentException e) {
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // POST /api/community/1/comments
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long postId,
            @RequestBody CommunityCommentRequest requestBody,
            HttpServletRequest request
    ) {
        Long userId = getLoginUserId(request);

        if (userId == null) {
            return error(
                HttpStatus.UNAUTHORIZED,
                "로그인이 필요합니다."
            );
        }

        try {
            CommunityCommentResponse response =
                communityService.createComment(
                    userId, postId, requestBody
                );

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    private Long getLoginUserId(
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }

        Object value = session.getAttribute("LOGIN_USER_ID");

        return value instanceof Number number
            ? number.longValue()
            : null;
    }

    private ResponseEntity<Map<String, String>> error(
            HttpStatus status,
            String message
    ) {
        return ResponseEntity
            .status(status)
            .body(Map.of("message", message));
    }
}
