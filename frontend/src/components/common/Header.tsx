import Icon from "./icon";
import "../../styles/header.css";
import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"

// 로그인 시 회원role 표시
type LoginUser = {
  userId: number;
  loginId : string;
  name: string;
  role: "USER" | "COMPANY" | "STORE" | "ADMIN";
}
const ROLE_LABEL: Record<LoginUser["role"], string> = {
  USER: "일반 회원",
  COMPANY: "선사·기업 회원",
  STORE: "선식·선용품 업체",
  ADMIN: "관리자",
};

function getLoginUser(): LoginUser | null {
  try {
    const saved = sessionStorage.getItem("sailingUser");
    return saved ? (JSON.parse(saved) as LoginUser) : null;
  } catch {
    return null;
  }
}

// 라우터(react-router)를 붙이면 <a href> 를 <Link to> 로 바꾸면 됩니다.
const MENUS = [
  { label: "채용공고", path: "/jobs" },
  { label: "해운정보", path: "/maritime" },
  { label: "한인선식", path: "/stores" },
  { label: "커뮤니티", path: "/community" },
];

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<LoginUser | null>(getLoginUser);
  const handelMyPage = () => {
    if(!user){
      navigate("/login"); 
      return;
    }
    switch (user.role) {
      case "USER":
        navigate("/mypage/personal");
        break;
      case "COMPANY":
        navigate("/mypage/company");
        break;
      case "STORE":
        navigate("/mypage/stroe");
        break;
      case "ADMIN":
        navigate("/mypage/admin");
        break;
    }
  }
  useEffect(() => {
    const updateUser = () => setUser(getLoginUser());
    window.addEventListener("sailingAuthChange", updateUser);
    return () => {
      window.removeEventListener("sailingAuthChange", updateUser);
    };
  },[]);

  return (
    <header className="header">
      <div className="header-inner container">
        <a href="/" className="brand" aria-label="SAILING 홈">
          <span className="brand-logo">
            <Icon name="ship" size={20} />
          </span>
          <span className="brand-name">SAILING</span>
        </a>

        <nav className="header-nav">
          {MENUS.map((menu) => (
            <a key={menu.path} href={menu.path}>
              {menu.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* 로그인 시  띄워짐*/}
          {user ? (
            <>
              <button type="button" className="header-profile-button"
                onClick={handelMyPage} aria-label="마이페이지로 이동">
                <span className="header-profile-avatar">
                  <Icon name="user" size={18} />
                </span>
                <span className = "header-profile-text">
                  <span className="header-profile-role">
                  {ROLE_LABEL[user.role]} 
                  </span>
                  <strong>{user.loginId}님</strong>
                </span>
                <Icon name="chevron" size={16} />
              </button>
              <button type="button" className="button-logout" 
                onClick={() => {
                  sessionStorage.removeItem("sailingUser");
                  window.dispatchEvent(new Event("sailingAuthChange"));
                  navigate("/")}}
              >
                로그아웃
              </button>
            </>
            ) : (
              <>
                {/* 비로그인 시 띄워짐 */}
                <a href="/login" className="header-login">로그인</a>
                <a href="/signup" className="button button--outline">회원가입</a>
              </>
            ) 
          }
          <a href="/jobs/new" className="button button--primary">구인공고 등록</a>
        </div>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="메뉴 열기">
          <Icon name={open ? "x" : "menu"} size={25} />
        </button>
      </div>

      {open && (
        <div className="mobile-menu" onClick={() => setOpen(false)}>
          {MENUS.map((menu) => (
            <a key={menu.path} href={menu.path}>
              {menu.label}
            </a>
          ))}
          <a href="/login">로그인</a>
          <a href="/signup">회원가입</a>
          <a href="/jobs/new" className="button button--primary">구인공고 등록</a>
        </div>
      )}
    </header>
  );
}

export default Header;