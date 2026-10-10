import Icon from "./icon";
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div>
            <div className="footer-brand">
              <span className="brand-logo">
                <Icon name="ship" size={18} />
              </span>
              <span className="brand-name">SAILING</span>
            </div>
            <p>해운·선박 전문 채용 플랫폼</p>
          </div>
          <div className="footer-links">
            {[
              "회사소개",
              "이용약관",
              "개인정보처리방침",
              "고객센터",
              "광고문의",
              "제휴문의",
              "공지사항",
              "자주 묻는 질문",
            ].map((item) => (
              <button key={item}>{item}</button>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SAILING. All rights reserved.</span>
          <span>고객센터 : 051-123-4567 평일 09:00-18:00</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;