import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import CommunityLayout from "../components/CommunityLayout";
import {
  createCommunityComment,
  getCommunityComments,
  getCommunityPost,
} from "../communityApi";
import type {
  CommunityComment,
  CommunityPost,
} from "../communityTypes";

export default function CommunityDetailPage() {
  const { postId = "" } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentSaving, setCommentSaving] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    Promise.all([
      getCommunityPost(postId),
      getCommunityComments(postId),
    ])
      .then(([postItem, commentItems]) => {
        if (!active) return;

        setPost(postItem);
        setComments(
          Array.isArray(commentItems) ? commentItems : [],
        );
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            getErrorMessage(
              requestError,
              "게시글을 불러오지 못했습니다.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [postId]);

  async function submitComment(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setCommentError("");

    if (!sessionStorage.getItem("sailingUser")) {
      navigate("/login");
      return;
    }

    const content = commentText.trim();

    if (!content) {
      setCommentError("댓글 내용을 입력해주세요.");
      return;
    }

    if (commentSaving) return;

    setCommentSaving(true);

    try {
      const created = await createCommunityComment(postId, {
        content,
      });

      setComments((current) => [...current, created]);
      setCommentText("");

      setPost((current) =>
        current
          ? {
              ...current,
              commentCount: (current.commentCount ?? 0) + 1,
            }
          : current,
      );
    } catch (requestError: unknown) {
      setCommentError(
        getErrorMessage(
          requestError,
          "댓글을 등록하지 못했습니다.",
        ),
      );
    } finally {
      setCommentSaving(false);
    }
  }

  return (
    <CommunityLayout>
      <main className="community-page container">
        <button
          className="page-back"
          type="button"
          onClick={() => navigate("/community")}
        >
          <Icon name="chevron" size={17} />
          커뮤니티
        </button>

        {loading ? (
          <div className="community-empty" role="status">
            게시글을 불러오는 중입니다.
          </div>
        ) : error || !post ? (
          <div className="community-empty" role="alert">
            <strong>게시글을 표시할 수 없습니다.</strong>
            <p>{error || "요청한 게시글을 찾을 수 없습니다."}</p>
          </div>
        ) : (
          <>
            <article className="post-view__card">
              <header className="post-view__meta-top">
                <span>{post.category}</span>
                <span>조회 {post.viewCount ?? 0}</span>
              </header>

              <h1>{post.title}</h1>

              <div className="post-view__author">
                <strong>{post.nickname || "회원"}</strong>
                <span>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString("ko-KR")
                    : "날짜 미등록"}
                </span>
              </div>

              <div className="post-view__body">
                {(post.content || "").split(/\r?\n/).map(
                  (line, index) => (
                    <p key={`${index}-${line}`}>
                      {line || " "}
                    </p>
                  ),
                )}
              </div>

              <footer>
                <div className="post-reactions">
                  <span>
                    <Icon name="thumb-up" size={16} />
                    공감 {post.likeCount ?? 0}
                  </span>
                  <span>
                    <Icon name="thumb-down" size={16} />
                    비공감 {post.dislikeCount ?? 0}
                  </span>
                </div>
              </footer>
            </article>

            <section className="comment-card">
              <h2>
                댓글 <span>{comments.length}</span>
              </h2>

              {comments.length === 0 ? (
                <p className="community-empty">
                  아직 등록된 댓글이 없습니다.
                </p>
              ) : (
                <div>
                  {comments.map((comment) => (
                    <article
                      className="comment"
                      key={comment.commentId}
                    >
                      <strong>
                        {comment.nickname || "회원"}
                      </strong>

                      <span>
                        {comment.createdAt
                          ? new Date(
                              comment.createdAt,
                            ).toLocaleString("ko-KR")
                          : ""}
                      </span>

                      <p>{comment.content}</p>
                    </article>
                  ))}
                </div>
              )}

              <form onSubmit={submitComment}>
                <textarea
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  placeholder="댓글을 입력해주세요."
                  maxLength={2000}
                  rows={3}
                  required
                />

                <button
                  className="button button--dark"
                  type="submit"
                  disabled={commentSaving}
                >
                  {commentSaving ? "등록 중..." : "댓글 등록"}
                </button>
              </form>

              {commentError && (
                <p className="editor-notice" role="alert">
                  <Icon name="bell" size={18} />
                  {commentError}
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </CommunityLayout>
  );
}
