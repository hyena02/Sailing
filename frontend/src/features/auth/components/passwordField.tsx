import { useState } from "react";

interface PasswordFieldProps {
  value: string; onChange: (value: string) => void; label?: string; showChecklist?: boolean;
}

export default function PasswordField({ value, onChange, label = "비밀번호", showChecklist = true }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const checks = { letter: /[A-Za-z]/.test(value), number: /\d/.test(value), length: value.length >= 8 && value.length <= 12 };
  const valid = Object.values(checks).every(Boolean);
  return (
    <div className="form-field password-field">
      <span className="form-field__label">{label}<em>*</em></span>
      <span className="form-field__control">
        <input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)}
          placeholder="영문, 숫자 포함 8~12자리" maxLength={12} />
        <button type="button" className="input-icon-button" onClick={() => setVisible(!visible)} aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}>
          <span className={`eye-icon ${visible ? "is-visible" : ""}`}><i /></span>
        </button>
      </span>
      {showChecklist && value && (
        <div className={`password-checks ${valid ? "is-valid" : ""}`}>
          <span className={checks.letter ? "is-done" : ""}>영문 포함</span>
          <span className={checks.number ? "is-done" : ""}>숫자 포함</span>
          <span className={checks.length ? "is-done" : ""}>8~12자리</span>
          <strong>{valid ? "사용할 수 있는 비밀번호입니다." : "조건을 모두 충족해주세요."}</strong>
        </div>
      )}
    </div>
  );
}
