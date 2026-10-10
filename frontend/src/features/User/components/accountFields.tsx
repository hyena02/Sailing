import { useState } from "react";
import FormField from "../../auth/components/formField";
import PasswordField from "../../auth/components/passwordField";

interface AccountFieldsProps {
  username: string; password: string; confirmPassword: string;
  onChange: (field: "username" | "password" | "confirmPassword", value: string) => void;
  sectionNumber?: string;
}

export default function AccountFields({ username, password, confirmPassword, onChange, sectionNumber = "02" }: AccountFieldsProps) {
  const [checkedName, setCheckedName] = useState("");
  const matched = confirmPassword.length > 0 && password === confirmPassword;
  return (
    <div className="form-section">
      <div className="form-section__heading"><span>{sectionNumber}</span><div><h2>계정 정보</h2><p>SAILING 로그인에 사용할 정보를 입력해주세요.</p></div></div>
      <FormField label="아이디" name="username" value={username} onChange={(value) => onChange("username", value)}
        placeholder="영문, 숫자 조합 6~20자리" required
        hint={checkedName === username && username ? "사용할 수 있는 아이디입니다." : "로그인에 사용할 아이디를 입력해주세요."}
        action={<button type="button" className="field-action" onClick={() => username.length >= 4 && setCheckedName(username)}>중복 확인</button>} />
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
