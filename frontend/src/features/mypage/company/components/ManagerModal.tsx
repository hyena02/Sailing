import { useState } from "react";

import Icon from "../../../../components/common/icon";

export interface Manager {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  primary: boolean;
}

interface ManagerModalProps {
  managers: Manager[];
  onChange: (managers: Manager[]) => void;
  onClose: () => void;
}

type ManagerDraft = Omit<Manager, "id" | "primary">;
const emptyDraft: ManagerDraft = { name: "", position: "", phone: "", email: "" };

export default function ManagerModal({ managers, onChange, onClose }: ManagerModalProps) {
  const [draft, setDraft] = useState<ManagerDraft>(emptyDraft);
  const [message, setMessage] = useState("");

  function updateDraft(field: keyof ManagerDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function addManager() {
    if (!draft.name.trim() || !draft.phone.trim() || !draft.email.trim()) {
      setMessage("이름, 연락처, 이메일을 입력해주세요.");
      return;
    }

    onChange([
      ...managers,
      {
        id: Date.now(),
        name: draft.name.trim(),
        position: draft.position.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        primary: managers.length === 0,
      },
    ]);
    setDraft(emptyDraft);
    setMessage("추가 담당자는 이 화면에서만 유지됩니다. 서버 저장은 연결되지 않았습니다.");
  }

  function selectPrimary(managerId: number) {
    onChange(managers.map((manager) => ({ ...manager, primary: manager.id === managerId })));
  }

  function removeManager(managerId: number) {
    onChange(managers.filter((manager) => manager.id !== managerId));
  }

  return (
    <div className="password-modal-backdrop" onMouseDown={onClose}>
      <div
        className="manager-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-manager-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="password-modal__close" onClick={onClose} aria-label="닫기">
          <Icon name="x" size={20} />
        </button>

        <div className="manager-modal__heading">
          <span><Icon name="user" size={22} /></span>
          <div>
            <h2 id="company-manager-title">채용 담당자 관리</h2>
            <p>대표 담당자를 설정하고 추가 담당자 정보를 입력할 수 있습니다.</p>
          </div>
        </div>

        <div className="manager-list">
          {managers.map((manager) => (
            <div className="manager-item" key={manager.id}>
              <span className="manager-avatar">{manager.name.slice(0, 1) || "담"}</span>
              <div>
                <strong>{manager.name} <small>{manager.position || "담당자"}</small></strong>
                <p>{manager.phone} · {manager.email}</p>
              </div>
              <button
                type="button"
                className={manager.primary ? "is-primary" : ""}
                onClick={() => selectPrimary(manager.id)}
              >
                {manager.primary ? "대표 담당자" : "대표로 설정"}
              </button>
              <button
                type="button"
                className="manager-remove"
                aria-label={`${manager.name} 삭제`}
                disabled={manager.primary}
                onClick={() => removeManager(manager.id)}
              >
                <Icon name="x" size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="manager-add">
          <h3>새 담당자 등록</h3>
          <div>
            <input aria-label="담당자 이름" placeholder="이름" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
            <input aria-label="담당자 직책" placeholder="직책" value={draft.position} onChange={(event) => updateDraft("position", event.target.value)} />
            <input aria-label="담당자 연락처" placeholder="연락처" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} />
            <input aria-label="담당자 이메일" type="email" placeholder="이메일" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </div>
          <button type="button" className="button button--outline" onClick={addManager}>담당자 추가</button>
          {message && <p className="manager-note" role="status">{message}</p>}
        </div>

        <div className="manager-modal__actions">
          <button type="button" className="button button--dark" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}