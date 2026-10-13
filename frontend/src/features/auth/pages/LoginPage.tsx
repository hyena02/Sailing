import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import FormField from "../components/FormField";
import Icon from "../../../components/common/icon";
import { login } from "../authApi";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 버튼을 누르면 backend login API 호출
  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    if(!username.trim() || !password){
      setMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await login(username.trim(), password);

      // 로그인한 사용자 정보를 저장
      sessionStorage.setItem("sailingUser", JSON.stringify(data));

      // 헤더가 사용자 정보를 다시 읽도록 알림
      window.dispatchEvent(new Event("sailingAuthChange"));

      // 로그인 성공 시 홈으로 이동
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그인 오류:", error);

      setMessage(
        error instanceof TypeError
          ? "서버에 연결할 수 없습니다. 실행 상태를 확인해주세요."
          : error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthLayout title="다시, 바다를 향한 항해">
      <div className="auth-heading">
        <span>WELCOME BACK</span><h1>로그인</h1><p>SAILING 계정으로 새로운 기회를 확인하세요.</p>
      </div>
      <form className="auth-form auth-form--login" onSubmit={handleLogin}>
        <FormField label="아이디" name="username" value={username} 
          onChange={setUsername} placeholder="아이디를 입력해주세요" required />
        <PasswordField value={password} 
          onChange={setPassword} showChecklist={false} />
        <div className="login-options">
          <label className="check-label">
            <input type="checkbox" checked={remember} 
              onChange={(event) => setRemember(event.target.checked)} />
            <span />로그인 상태 유지</label>
          <div>
            <button type="button">아이디 찾기</button><i />
            <button type="button">비밀번호 찾기</button>
          </div>
        </div>
        {message && <div className="form-notice"><Icon name="bell" size={17} />{message}</div>}
        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인하기"}
          <Icon name="arrow" size={18} />
        </button>
      </form>
      <div className="auth-switch">
        <span>아직 SAILING 회원이 아니신가요?</span>
        <button onClick={() => navigate("/signup")}>회원가입하기</button>
      </div>
    </AuthLayout>
  );
}
