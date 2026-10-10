import { useState } from "react";
import FormField from "../../auth/components/formField";
import PasswordField from "../../auth/components/passwordField";

interface AccountFieldsProps {
  username: string; 
  password: string; 
  confirmPassword: string;
  onChange: (
    field: "username" | "password" | "confirmPassword", 
    value: string
  ) => void;
  sectionNumber?: string;
}

export default function AccountFields({ 
  username, 
  password, 
  confirmPassword, 
  onChange, 
  sectionNumber = "02" 
}: AccountFieldsProps) {
  const [checkResult, setCheckResult] = useState<
    "available" | "taken" | "error" | null
  >(null);
  const [checking, setChecking] = useState(false);
  const matched = confirmPassword.length > 0 && password === confirmPassword;

  // 아이디 중복확인 버튼 실행
  const checkUsername = async () => {
    if(!/^[a-zA-Z0-9]{4,20}$/.test(username)){
      setCheckResult("error");
      return;
    }
    setChecking(true);
    setCheckResult(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/check-login-id?loginId=${encodeURIComponent(username)}`
      );
      if(!response.ok){
        throw new Error("중복 확인 요청에 실패했습니다. 다시 시도해주세요.");
      }
      // true면 이미 존재하는 아이디
      const exists: boolean = await response.json();
      setCheckResult(exists ? "taken" : "available");
    } catch (error) {
      console.error("아이디 중복 확인 오류:",error);
      setCheckResult("error");
    } finally{
      setChecking(false);
    }
  };
  const handleUsernameChange = (value: string) => {
    // 아이디를 수정하면 이전 중복 확인 결과 초기화
    setCheckResult(null);
    onChange("username", value);
  };
  const usernameHint = checkResult === "available"
    ? "사용할 수 있는 아이디입니다."
    : checkResult === "taken"
      ? "이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요."
      : checkResult === "error"
        ? "중복 확인에 실패했습니다. 아이디를 확인하거나 다시 시도해주세요."
        : "사용할 아이디를 입력해주세요.";
  return (
    <div className="form-section">
      <div className="form-section__heading"><span>{sectionNumber}</span><div><h2>계정 정보</h2><p>SAILING 로그인에 사용할 정보를 입력해주세요.</p></div></div>
      <FormField label="아이디" name="username" value={username} onChange={handleUsernameChange}
        placeholder="영문, 숫자 조합 6~20자리" required
        hint={usernameHint}
        action={<button type="button" className="field-action" onClick={checkUsername} disabled={checking}>중복 확인</button>} />
      <div className="form-grid">
        <PasswordField value={password} onChange={(value) => onChange("password", value)} />
        <div className="form-field">
          <span className="form-field__label">비밀번호 확인<em>*</em></span>
          <span className="form-field__control"><input type="password" value={confirmPassword}
            onChange={(event) => onChange("confirmPassword", event.target.value)} placeholder="비밀번호를 다시 입력해주세요" /></span>
          {confirmPassword && <small className={matched ? "success-text" : "form-field__error"}>{matched ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}</small>}
        </div>
      </div>
    </div>
  );
}
