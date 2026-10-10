import { useNavigate } from "react-router-dom";
import AuthLayout from "../auth/components/authLayout";
import Icon, { type IconName } from "../../components/common/icon";

const signupTypes: Array<{ type: string; path: string; icon: IconName; title: string; description: string; detail: string }> = [
  { type: "PERSONAL", path: "/signup/personal", icon: "user", title: "일반회원", description: "바다에서 새로운 커리어를 찾고 계신가요?", detail: "채용공고 지원 · 관심 공고 · 커뮤니티" },
  { type: "COMPANY", path: "/signup/company", icon: "building", title: "기업회원", description: "좋은 해운 인재를 채용하고 싶으신가요?", detail: "구인공고 등록 · 인재 검색 · 기업 관리" },
  { type: "PARTNER", path: "/signup/vendor", icon: "anchor", title: "업체회원", description: "항만·선박 서비스를 알리고 싶으신가요?", detail: "업체 등록 · 서비스 홍보 · 고객 연결" },
];

export default function Signup() {
  const navigate = useNavigate();
  return (
    <AuthLayout wide eyebrow="JOIN SAILING" title="당신에게 맞는 방식으로 시작하세요">
      <button className="auth-back" onClick={() => navigate("/")}><Icon name="chevron" size={17} /> 홈으로</button>
      <div className="auth-heading">
        <span>JOIN SAILING</span>
        <h1>회원가입</h1>
        <p>SAILING을 이용할 회원 유형을 선택해주세요.</p>
      </div>
      <div className="signup-types">
        {signupTypes.map((item, index) => (
          <button key={item.type} className="signup-type-card" onClick={() => navigate(item.path)}>
            <span className="signup-type-card__number">0{index + 1}</span>
            <span className="signup-type-card__icon"><Icon name={item.icon} size={25} /></span>
            <strong>{item.title}</strong><p>{item.description}</p><small>{item.detail}</small>
            <span className="signup-type-card__link">{item.title} 가입하기 <Icon name="arrow" size={17} /></span>
          </button>
        ))}
      </div>
      <div className="auth-switch"><span>이미 회원이신가요?</span><button onClick={() => navigate("/login")}>로그인하기</button></div>
    </AuthLayout>
  );
}
