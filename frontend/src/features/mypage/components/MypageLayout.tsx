
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Icon from "../../../components/common/icon";

import "../MyPage.css";

export type MyPageTab = "profile" | "likes" | "writing";

type LoginUser = {
  userId: number;
  loginId: string;
  name: string;
  role: "USER" | "COMPANY" | "STORE" | "ADMIN";
};

type MyPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  activeTab: MyPageTab;
  children: ReactNode;
};

function getLoginUser(): LoginUser | null {
  try {
    const saved = sessionStorage.getItem("sailingUser");
    return saved ? (JSON.parse(saved) as LoginUser) : null;
  } catch {
    return null;
  }
}

export default function MyPageLayout({
  eyebrow,
  title,
  description,
  activeTab,
  children,
}: MyPageLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginUser | null>(getLoginUser);

  useEffect(() => {
    const updateUser = () => setUser(getLoginUser());
    window.addEventListener("sailingAuthChange", updateUser);
    return () => {
      window.removeEventListener("sailingAuthChange", updateUser);
    };
  }, []);

  return (
    <div className="subpage mypage">
      <Header />
      <main className="mypage-main">
        <section className="mypage-banner">
          <div className="container">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        <div className="container mypage-layout">
          <aside className="mypage-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar is-personal">
                <Icon name="user" size={34} />
              </div>
              <strong>{user?.name || "일반회원"}</strong>
              <span>일반 회원</span>
              {user && (<small className="profile-login-id">
                  @{user.loginId}
                </small>
              )}
            </div>
            <nav>
              <button type="button" className={activeTab === "profile" ? "is-active" : ""}
                onClick={() => navigate("/mypage/personal")}
              >
                <Icon name="user" size={18} />
                프로필 관리
              </button>

              <button type="button" className={activeTab === "likes" ? "is-active" : ""}
                onClick={() => navigate("/mypage/personal/likes")}
              >
                <Icon name="heart" size={18} />
                관심 공고
              </button>

              <button type="button" className={activeTab === "writing" ? "is-active" : ""}
                onClick={() => navigate("/mypage/personal/writing")}
              >
                <Icon name="comment" size={18} />
                내가 쓴 글
              </button>
            </nav>
            {!user && (
              <button type="button" className="mypage-demo"
                onClick={() => navigate("/login")}
              >
                로그인 후 이용하기
              </button>
            )}
          </aside>
          <div className="mypage-content">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
