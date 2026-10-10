import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../auth/components/authLayout";
import AccountFields from "./components/accountFields";
import FormField from "../auth/components/formField";
import Icon from "../../components/common/icon";
import { FormActions, SectionHeading, SignupTop, SuccessNotice } from "./components/signupParts";

const initialForm = { companyName: "", businessNumber: "", manager: "", phone: "", email: "", username: "", password: "", confirmPassword: "" };

export default function CompanySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fileName, setFileName] = useState("");
  const [submitLater, setSubmitLater] = useState(false);
  const [help, setHelp] = useState<"certificate" | "registration" | null>(null);
  const [completed, setCompleted] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const formatBusinessNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 10);
    return [numbers.slice(0, 3), numbers.slice(3, 5), numbers.slice(5, 10)].filter(Boolean).join("-");
  };

  return (
    <AuthLayout wide title="좋은 인재와 기업을 연결합니다">
      <SignupTop title="기업회원 가입" subtitle="구인공고 등록을 위한 기업 정보를 입력해주세요." onBack={() => navigate("/signup")} />
      <form className="auth-form signup-form" onSubmit={(event) => { event.preventDefault(); setCompleted(true); }}>
        <div className="form-section">
          <SectionHeading number="01" title="기업 기본 정보" description="기업 확인과 채용 담당자 연락에 사용됩니다." />
          <div className="form-grid">
            <FormField label="기업명" name="companyName" value={form.companyName} onChange={(value) => update("companyName", value)} placeholder="기업명을 입력해주세요" required />
            <FormField label="사업자등록번호" name="businessNumber" value={form.businessNumber}
              onChange={(value) => update("businessNumber", formatBusinessNumber(value))} placeholder="123-45-67890" required maxLength={12} />
            <FormField label="담당자 이름" name="manager" value={form.manager} onChange={(value) => update("manager", value)} placeholder="채용 담당자 이름" required />
            <FormField label="담당자 연락처" name="phone" value={form.phone} onChange={(value) => update("phone", value)} placeholder="010-0000-0000" required />
            <FormField label="담당자 이메일" name="email" type="email" value={form.email} onChange={(value) => update("email", value)} placeholder="hr@company.com" required />
          </div>
        </div>
        <div className="form-section">
          <SectionHeading number="02" title="기업 인증" description="신뢰할 수 있는 채용 환경을 위해 서류를 확인합니다." />
          <label className={`file-upload ${fileName ? "has-file" : ""}`}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
            <span className="file-upload__icon"><Icon name="briefcase" size={24} /></span>
            {fileName ? <><strong>{fileName}</strong><small>다른 파일을 선택하려면 클릭해주세요.</small></> :
              <><strong>사업자등록증 또는 사업자등록증명원</strong><small>PDF, JPG, PNG · 최대 10MB</small><em>파일 선택</em></>}
          </label>
          <div className="document-help">
            <button type="button" onClick={() => setHelp("certificate")}>사업자등록증명원이 무엇인가요?</button>
            <button type="button" onClick={() => setHelp("registration")}>사업자등록증이 무엇인가요?</button>
          </div>
          <label className="later-check"><input type="checkbox" checked={submitLater} onChange={(event) => setSubmitLater(event.target.checked)} /><span />
            <div><strong>인증 서류를 나중에 제출할게요</strong><small>마이페이지에서 제출할 수 있으며, 인증 전 일부 기능이 제한될 수 있습니다.</small></div>
          </label>
        </div>
        <AccountFields username={form.username} password={form.password} confirmPassword={form.confirmPassword}
          onChange={(field, value) => update(field, value)} sectionNumber="03" />
        {completed && <SuccessNotice />}
        <FormActions onBack={() => navigate("/signup")} label="기업회원으로 가입하기" />
      </form>
      {help && <DocumentModal type={help} onClose={() => setHelp(null)} />}
    </AuthLayout>
  );
}

function DocumentModal({ type, onClose }: { type: "certificate" | "registration"; onClose: () => void }) {
  const certificate = type === "certificate";
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="help-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="help-modal__close" onClick={onClose}><Icon name="x" size={20} /></button>
        <span className="help-modal__icon"><Icon name="building" size={24} /></span>
        <h2>{certificate ? "사업자등록증명원이란?" : "사업자등록증이란?"}</h2>
        <p>{certificate ? "현재 사업자등록 상태를 공식적으로 증명하는 국세청 발급 문서입니다." : "사업자가 세무서에 등록을 완료했음을 확인하는 기본 증명 서류입니다."}</p>
        {certificate && <ol><li>홈택스에 로그인합니다.</li><li>국세증명·사업자등록 메뉴를 선택합니다.</li><li>사업자등록증명을 발급해 PDF로 저장합니다.</li></ol>}
        <button className="auth-submit" onClick={onClose}>확인했어요</button>
      </div>
    </div>
  );
}
