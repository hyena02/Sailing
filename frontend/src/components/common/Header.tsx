import { useState } from "react";
import Icon from "./icon";
import "../../styles/Header.css";

// 라우터(react-router)를 붙이면 <a href> 를 <Link to> 로 바꾸면 됩니다.
const MENUS = [
  { label: "채용공고", path: "/jobs" },
  { label: "해운정보", path: "/maritime" },
  { label: "한인선식", path: "/stores" },
  { label: "커뮤니티", path: "/community" },
];

function Header() {
  const [open, setOpen] = useState(false);

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
          <a href="/login" className="header-login">로그인</a>
          <a href="/signup" className="button button--outline">회원가입</a>
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