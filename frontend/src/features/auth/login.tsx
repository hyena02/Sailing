import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import PasswordField from "./components/passwordField";
import FormField from "./components/formField";
import Icon from "../../components/common/icon";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <AuthLayout title="다시, 바다를 향한 항해">
      <div className="auth-heading">
        <span>WELCOME BACK</span><h1>로그인</h1><p>SAILING 계정으로 새로운 기회를 확인하세요.</p>
      </div>
      <form className="auth-form auth-form--login" onSubmit={(event) => { event.preventDefault(); setMessage("로그인 API 연결 후 이용할 수 있습니다."); }}>
        <FormField label="아이디" name="username" value={username} onChange={setUsername} placeholder="아이디를 입력해주세요" required />
        <PasswordField value={password} onChange={setPassword} showChecklist={false} />
        <div className="login-options">
          <label className="check-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span />로그인 상태 유지</label>
          <div><button type="button">아이디 찾기</button><i /><button type="button">비밀번호 찾기</button></div>
        </div>
        {message && <div className="form-notice"><Icon name="bell" size={17} />{message}</div>}
        <button className="auth-submit" type="submit">로그인하기 <Icon name="arrow" size={18} /></button>
      </form>
      <div className="auth-switch"><span>아직 SAILING 회원이 아니신가요?</span><button onClick={() => navigate("/signup")}>회원가입하기</button></div>
    </AuthLayout>
  );
}
