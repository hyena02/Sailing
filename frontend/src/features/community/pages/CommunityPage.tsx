import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import CommunityLayout from "../components/CommunityLayout";
import { getCommunityPosts } from "../communityApi";
import type { CommunityPost } from "../communityTypes";

const CATEGORIES = ["전체", "승선후기", "질문답변", "정보공유", "자유게시판"];

function formatDate(value?: string) {
  if (!value) return "날짜 미등록";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toLocaleDateString("ko-KR");
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCommunityPosts()
      .then((items) => {
        if (active) setPosts(Array.isArray(items) ? items : []);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "커뮤니티 게시글을 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return posts.filter((post) => {
      const searchable = `${post.title} ${post.content ?? ""} ${post.nickname ?? ""}`.toLocaleLowerCase();
      const matchesCategory = category === "전체" || post.category === category;
      const matchesQuery = searchable.includes(keyword);
      return matchesCategory && matchesQuery;
    });
  }, [posts, category, query]);

  return (
    <CommunityLayout>
      <section className="subpage-hero">
        <div className="container">
          <span>SAILING COMMUNITY</span>
          <h1>바다 사람들의 이야기를<br />함께 나눠요</h1>
          <p>승선 경험과 궁금한 점, 업계 정보를 공유하는 공간입니다.</p>
        </div>
      </section>

      <main className="community-page container">
        <div className="page-title-row">
          <div>
            <span>COMMUNITY BOARD</span>
            <h2>커뮤니티</h2>
            <p>실제로 등록된 게시글을 확인하고 경험을 공유하세요.</p>
          </div>
          <button
            className="button button--dark"
            type="button"
            onClick={() => navigate("/community/write")}
          >
            <Icon name="pen" size={17} /> 글쓰기
          </button>
        </div>

        <div className="community-toolbar">
          <div className="community-categories">
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="community-search">
            <Icon name="search" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목, 내용 검색"
            />
          </label>
        </div>

        {loading ? (
          <div className="community-empty" role="status">게시글을 불러오는 중입니다.</div>
        ) : error ? (
          <div className="community-empty" role="alert">
            <Icon name="bell" size={28} />
            <strong>커뮤니티 API에 연결할 수 없습니다.</strong>
            <p>{error}</p>
            <small>현재 백엔드의 게시글 조회 API 구현 여부를 확인해주세요.</small>
          </div>
        ) : (
          <>
            <div className="community-table">
              <div className="community-table__head">
                <span>분류</span>
                <span>제목</span>
                <span>작성자</span>
                <span>작성일</span>
                <span>조회</span>
                <span>반응</span>
              </div>
              {filteredPosts.map((post) => (
                <button
                  type="button"
                  className="community-table__row"
                  key={post.postId}
                  onClick={() => navigate(`/community/${post.postId}`)}
                >
                  <span>{post.category}</span>
                  <strong>{post.title}</strong>
                  <span>{post.nickname || "회원"}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>{post.viewCount ?? 0}</span>
                  <span className="post-reaction-count">
                    <i><Icon name="thumb-up" size={13} />{post.likeCount ?? 0}</i>
                    <i><Icon name="comment" size={13} />{post.commentCount ?? 0}</i>
                  </span>
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="community-empty">
                <Icon name="search" size={28} />
                <strong>{posts.length > 0 ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}</strong>
                <p>
                  {posts.length > 0
                    ? "검색어나 분류를 변경해보세요."
                    : "게시글이 등록되면 이곳에 표시됩니다."}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </CommunityLayout>
  );
}