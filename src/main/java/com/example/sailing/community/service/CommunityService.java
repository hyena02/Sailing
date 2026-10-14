package com.example.sailing.community.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sailing.community.dto.CommunityCommentRequest;
import com.example.sailing.community.dto.CommunityCommentResponse;
import com.example.sailing.community.dto.CommunityPostRequest;
import com.example.sailing.community.dto.CommunityPostResponse;
import com.example.sailing.community.entity.CommunityComment;
import com.example.sailing.community.entity.CommunityPost;
import com.example.sailing.community.repository.CommunityCommentRepository;
import com.example.sailing.community.repository.CommunityPostRepository;
import com.example.sailing.users.entity.User;
import com.example.sailing.users.entity.UserStatus;
import com.example.sailing.users.repository.UserInfoRepository;
import com.example.sailing.users.repository.UserRepository;

@Service
public class CommunityService {

    private static final String ACTIVE = "ACTIVE";

    private static final Set<String> CATEGORIES = Set.of(
        "승선후기",
        "질문답변",
        "정보공유",
        "자유게시판"
    );

    private final CommunityPostRepository postRepository;
    private final CommunityCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;

    public CommunityService(
            CommunityPostRepository postRepository,
            CommunityCommentRepository commentRepository,
            UserRepository userRepository,
            UserInfoRepository userInfoRepository
    ) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }

    // 커뮤니티 게시글 목록
    @Transactional(readOnly = true)
    public List<CommunityPostResponse> getPosts() {
        return postRepository
            .findByStatusOrderByCreatedAtDesc(ACTIVE)
            .stream()
            .map(this::toPostResponse)
            .toList();
    }

    // 게시글 상세 조회 및 조회수 증가
    @Transactional
    public CommunityPostResponse getPost(Long postId) {
        CommunityPost post = findActivePost(postId);
        post.increaseViewCount();

        return toPostResponse(post);
    }

    // 게시글 등록
    @Transactional
    public CommunityPostResponse createPost(
            Long userId,
            CommunityPostRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException("게시글 정보를 입력해주세요.");
        }

        String category = requiredText(
            request.category(), "게시판을 선택해주세요."
        );
        String title = requiredText(
            request.title(), "제목을 입력해주세요."
        );
        String content = requiredText(
            request.content(), "내용을 입력해주세요."
        );

        if (!CATEGORIES.contains(category)) {
            throw new IllegalArgumentException("올바른 게시판을 선택해주세요.");
        }

        if (title.length() > 200) {
            throw new IllegalArgumentException("제목은 200자 이하여야 합니다.");
        }

        if (content.length() > 10000) {
            throw new IllegalArgumentException("내용은 10,000자 이하여야 합니다.");
        }

        User user = findActiveUser(userId);

        CommunityPost post = new CommunityPost(
            user, category, title, content
        );

        CommunityPost saved = postRepository.save(post);

        return toPostResponse(saved);
    }

    // 게시글 댓글 목록
    @Transactional(readOnly = true)
    public List<CommunityCommentResponse> getComments(Long postId) {
        findActivePost(postId);

        return commentRepository
            .findByPost_PostIdAndStatusOrderByCreatedAtAsc(postId, ACTIVE)
            .stream()
            .map(this::toCommentResponse)
            .toList();
    }

    // 댓글 등록
    @Transactional
    public CommunityCommentResponse createComment(
            Long userId,
            Long postId,
            CommunityCommentRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException("댓글 내용을 입력해주세요.");
        }

        String content = requiredText(
            request.content(), "댓글 내용을 입력해주세요."
        );

        if (content.length() > 2000) {
            throw new IllegalArgumentException("댓글은 2,000자 이하여야 합니다.");
        }

        User user = findActiveUser(userId);
        CommunityPost post = findActivePost(postId);

        CommunityComment comment = new CommunityComment(
            post, user, content
        );

        CommunityComment saved = commentRepository.save(comment);
        post.increaseCommentCount();

        return toCommentResponse(saved);
    }

    private CommunityPost findActivePost(Long postId) {
        return postRepository
            .findByPostIdAndStatus(postId, ACTIVE)
            .orElseThrow(() ->
                new IllegalArgumentException("게시글을 찾을 수 없습니다.")
            );
    }

    private User findActiveUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException("회원 정보를 찾을 수 없습니다.")
            );

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                "현재 글을 작성할 수 없는 계정입니다."
            );
        }

        return user;
    }

    private String requiredText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }

        return value.trim();
    }

    private String getNickname(User user) {
        var userInfo = userInfoRepository
            .findByUser_UserId(user.getUserId());

        if (userInfo.isPresent()) {
            String nickname = userInfo.get().getNickname();

            if (nickname != null && !nickname.isBlank()) {
                return nickname;
            }
        }
        return user.getName();
    }

    private CommunityPostResponse toPostResponse(
            CommunityPost post
    ) {
        return new CommunityPostResponse(
            post.getPostId(),
            post.getUser().getUserId(),
            getNickname(post.getUser()),
            post.getCategory(),
            post.getTitle(),
            post.getContent(),
            post.getViewCount(),
            post.getCommentCount(),
            post.getLikeCount(),
            post.getDislikeCount(),
            post.getCreatedAt()
        );
    }

    private CommunityCommentResponse toCommentResponse(
            CommunityComment comment
    ) {
        return new CommunityCommentResponse(
            comment.getCommentId(),
            comment.getPost().getPostId(),
            comment.getUser().getUserId(),
            getNickname(comment.getUser()),
            comment.getContent(),
            comment.getCreatedAt()
        );
    }
}
