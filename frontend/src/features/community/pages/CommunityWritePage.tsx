import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import CommunityLayout from "../components/CommunityLayout";
import { createCommunityPost } from "../communityApi";

const CATEGORIES = ["승선후기", "질문답변", "정보공유", "자유게시판"];

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionStorage.getItem("sailingUser")) {
      navigate("/login");
      return;
    }
    if (saving) return;

    setSaving(true);
    setError("");
    try {
      const post = await createCommunityPost({
        category,
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/community/${post.postId}`, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "게시글을 등록하지 못했습니다."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <CommunityLayout>
      <main className="editor-page container">
        <button className="page-back" type="button" onClick={() => navigate("/community")}>
          <Icon name="chevron" size={17} /> 커뮤니티로 돌아가기
        </button>
        <div className="editor-heading">
          <span>WRITE A POST</span>
          <h1>새 글 작성</h1>
          <p>승선 경험과 질문, 유용한 정보를 나눠보세요.</p>
        </div>

        <form className="editor-card" onSubmit={submit}>
          <label>
            <span>게시판</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>제목</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={200}
              required
            />
            <small>{title.length} / 200</small>
          </label>
          <label>
            <span>내용</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="내용을 입력해주세요."
              maxLength={10000}
              required
            />
            <small>{content.length}자</small>
          </label>

          {error && (
            <div className="editor-notice" role="alert">
              <Icon name="bell" size={18} />
              <span>
                {error}<br />현재 백엔드에 커뮤니티 등록 API가 구현되어 있는지 확인해주세요.
              </span>
            </div>
          )}
          <div className="editor-actions">
            <button type="button" className="button button--outline" onClick={() => navigate("/community")}>
              취소
            </button>
            <button className="button button--dark" type="submit" disabled={saving}>
              {saving ? "등록 중..." : "게시글 등록"}
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </form>
      </main>
    </CommunityLayout>
  );
}