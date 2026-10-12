
import { useEffect, useState, type FormEvent } from "react";

import Icon from "../../../components/common/icon";

type PasswordConfirmModalProps = {
  open: boolean;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: (password: string) => void | Promise<void>;
};

export default function PasswordConfirmModal({
  open,
  loading = false,
  error = "",
  onClose,
  onConfirm,
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
      setLocalError("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setLocalError("현재 비밀번호를 입력해주세요.");
      return;
    }

    setLocalError("");
    await onConfirm(password);
  };

  return (
    <div className="password-modal-backdrop" onMouseDown={onClose} >
      <section className="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title"
        onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="password-modal__close" aria-label="닫기"
          onClick={onClose}>
          <Icon name="x" size={20} />
        </button>

        <span className="password-modal__icon">
          <Icon name="user" size={24} />
        </span>

        <h2 id="password-modal-title">비밀번호 확인</h2>

        <p>
          회원정보를 안전하게 변경하기 위해
          <br />
          현재 비밀번호를 확인합니다.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <span>현재 비밀번호</span>
            <input type="password" autoComplete="current-password" autoFocus value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setLocalError("");
              }}
              placeholder="비밀번호를 입력해주세요"
              disabled={loading}
            />
          </label>

          {(localError || error) && (
            <small className="password-error" role="alert">
              {localError || error}
            </small>
          )}

          <div className="password-modal__actions">
            <button type="button" className="button button--outline"
              onClick={onClose} disabled={loading}>
              취소
            </button>

            <button type="submit" className="button button--dark" disabled={loading}>
              {loading ? "확인 중..." : "확인"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
