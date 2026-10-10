import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/common/icon";
import { HOME_ASSETS } from "../../Home/homeAssets";
import "../../../styles/user.css";



interface AuthLayoutProps {
  children: ReactNode;
  wide?: boolean;
  eyebrow?: string;
  title?: string;
}

export default function AuthLayout({ children, wide = false, eyebrow = "SAILING MEMBERSHIP", title = "바다에서 시작하는 새로운 기회" }: AuthLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <img src={HOME_ASSETS.hero} alt="푸른 바다를 항해하는 선박" />
        <div className="auth-visual__overlay" />
        <button className="auth-brand" onClick={() => navigate("/")} aria-label="SAILING 홈">
          <span><Icon name="ship" size={23} /></span><strong>SAILING</strong>
        </button>
        <div className="auth-visual__copy">
          <span>{eyebrow}</span><h1>{title}</h1>
          <p>대한민국 해운 인재와 기업, 항만 서비스를<br />하나의 플랫폼에서 연결합니다.</p>
        </div>
        <div className="auth-visual__metric"><strong>1,204</strong><span>함께하는 해운 기업</span></div>
      </aside>
      <main className="auth-main safe-area-top">
        <div className={`auth-content ${wide ? "auth-content--wide" : ""}`}>
          <button className="auth-mobile-brand" onClick={() => navigate("/")}>
            <span><Icon name="ship" size={19} /></span><strong>SAILING</strong>
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
