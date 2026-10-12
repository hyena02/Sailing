
import { useNavigate } from "react-router-dom";

import Icon from "../../../components/common/icon";
import MyPageLayout from "../components/MypageLayout";

type PersonalActivityPageProps = {
  type: "likes" | "writing";
};

export default function PersonalActivityPage({
  type,
}: PersonalActivityPageProps) {
  const navigate = useNavigate();
  const isLikes = type === "likes";

  return (
    <MyPageLayout eyebrow="MY ACTIVITY"
      title={isLikes ? "관심 공고" : "내가 쓴 글"}
      description={
        isLikes
          ? "저장한 채용공고를 한 곳에서 확인하세요."
          : "커뮤니티에 작성한 글과 활동을 관리하세요."
      }
      activeTab={type}
    >
      <section className="profile-card activity-card">
        <div className="profile-card__heading">
          <div>
            <span>{isLikes ? "SAVED JOBS" : "MY POSTS"}</span>
            <h2>{isLikes ? "관심 공고" : "내가 쓴 글"}</h2>
          </div>
          <em>실제 데이터 연동 전</em>
        </div>

        <div className="activity-empty">
          <span className="activity-empty__icon">
            <Icon name={isLikes ? "heart" : "comment"} size={30}/>
          </span>

          <h3>
            {isLikes
              ? "관심 공고 조회 기능을 준비하고 있습니다."
              : "내가 쓴 글 조회 기능을 준비하고 있습니다."}
          </h3>

          <p>
            많은 관심 부탁드립니다.
          </p>

          <button type="button" className="button button--dark"
            onClick={() => navigate(isLikes ? "/jobs" : "/community")}>
            {isLikes ? "채용공고 둘러보기" : "커뮤니티 둘러보기"}
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </MyPageLayout>
  );
}
