import Icon from "../../../components/common/icon";

export function SignupTop({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <>
      <button className="auth-back" onClick={onBack}><Icon name="chevron" size={17} /> 회원 유형 선택</button>
      <div className="signup-progress"><span className="is-done">1 유형 선택</span><i /><span>2 정보 입력</span><i /><span>3 가입 완료</span></div>
      <div className="auth-heading"><span>CREATE ACCOUNT</span><h1>{title}</h1><p>{subtitle}</p></div>
    </>
  );
}

export function SectionHeading({ number, title, description }: { number: string; title: string; description: string }) {
  return <div className="form-section__heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

export function FormActions({ onBack, label }: { onBack: () => void; label: string }) {
  return <div className="form-actions"><button type="button" onClick={onBack}>이전</button><button type="submit">{label}<Icon name="arrow" size={18} /></button></div>;
}

export function SuccessNotice() {
  return <div className="success-notice"><span><Icon name="ship" size={21} /></span><div><strong>입력 내용이 확인되었습니다.</strong><p>축하드립니다 !</p></div></div>;
}
