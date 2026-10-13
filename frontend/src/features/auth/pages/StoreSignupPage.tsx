import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import AccountFields from "../components/AccountFields";
import ChoiceGroup from "../components/ChoiceGroup";
import FormField from "../components/FormField";
import Icon from "../../../components/common/icon";
import { SectionHeading, SignupTop } from "../components/SignupParts";

const initialForm = {
  vendorName: "",
  address: "",
  owner: "",
  phone: "",
  email: "",
  country: "대한민국",
  serviceScope: "",
  website: "",
  ports: "",
  services: "",
  note: "",
  fax: "",
  telegram: "",
  kakaoId: "",
  openChat: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function StoreSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    // 1단계: 기본정보 검사 후 다음 단계로 이동
    if (step === 1) {
      if (!form.storeName.trim() || !form.owner.trim() || !form.address.trim() || !form.phone.trim() || !form.email.trim() || !form.username.trim() || !form.password || form.password !== form.confirmPassword) {
        alert("업체 기본정보와 계정 정보를 확인해주세요.");
        return;
      }

      setStep(2);
      return;
    }

    // 2단계: 서비스 정보 검사 후 다음 단계로 이동
    if (step === 2) {
      if (!form.country.trim() || !form.services.trim()) {
        alert("서비스 국가와 서비스 내역을 입력해주세요.");
        return;
      }

      if (form.serviceScope === "직접 입력" && !form.ports.trim()) {
        alert("직접 입력을 선택했다면 서비스 항구를 입력해주세요.");
        return;
      }

      setStep(3);
      return;
    }

    // 3단계: 백엔드 DTO 필드명에 맞춰 요청 데이터 작성
    const requestBody = {
      loginId: form.username.trim(),
      password: form.password,
      name: form.owner.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      storeName: form.storeName.trim(),
      representative: form.owner.trim(),
      address: form.address.trim(),
      region: "",
      serviceCountry: form.country.trim(),
      homepage: form.website.trim() || null,
      fax: form.fax.trim() || null,
      telegram: form.telegram.trim() || null,
      kakaoId: form.kakaoId.trim() || null,
      kakaoOpenchat: form.openChat.trim() || null,
      servicePorts: form.serviceScope === "전 항구 서비스" ? "전 항구 서비스" : form.ports.trim(),
      serviceDetails: form.services.trim(),
      remarks: form.note.trim() || null,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/stores/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? `업체회원 가입 실패 (${response.status})`);
      }

      alert("업체회원 가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("업체회원 가입 오류:", error);
      alert(error instanceof Error ? error.message : "업체회원 가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout wide title="항구와 바다의 서비스를 연결합니다">
      <SignupTop title="업체회원 가입" subtitle="선박·항만 관련 서비스 업체 정보를 등록해주세요." onBack={() => (step > 1 ? setStep(step - 1) : navigate("/signup"))} />

      <div className="store-steps">
        {["업체 기본정보", "서비스 정보", "추가 연락처"].map((label, index) => (
          <button type="button" key={label} className={step === index + 1 ? "is-active" : step > index + 1 ? "is-done" : ""} onClick={() => { if (step > index + 1) setStep(index + 1); }}>
            <span>{step > index + 1 ? "✓" : index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <form className="auth-form signup-form store-form" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-section">
              <SectionHeading number="01" title="업체 기본정보" description="고객에게 표시될 업체와 대표자 정보를 입력해주세요." />

              <div className="form-grid">
                <FormField label="업체 이름" name="storeName" value={form.storeName} onChange={(value) => update("storeName", value)} placeholder="국문 또는 영문 업체명" required />
                <FormField label="대표자 이름" name="owner" value={form.owner} onChange={(value) => update("owner", value)} placeholder="대표자 이름" required />
                <FormField label="업체 대표주소" name="address" value={form.address} onChange={(value) => update("address", value)} placeholder="국내 또는 해외 주소를 입력해주세요" required />
                <FormField label="대표자 전화번호" name="phone" value={form.phone} onChange={(value) => update("phone", value)} placeholder="+82 10-0000-0000" required hint="한국 및 해외 전화번호를 모두 입력할 수 있습니다." />
                <FormField label="대표자 이메일" name="email" type="email" value={form.email} onChange={(value) => update("email", value)} placeholder="contact@company.com" required />
                <FormField label="홈페이지 주소" name="website" value={form.website} onChange={(value) => update("website", value)} placeholder="https:// 또는 company.com" hint="홈페이지가 없다면 비워두셔도 됩니다." />
              </div>
            </div>

            <AccountFields username={form.username} password={form.password} confirmPassword={form.confirmPassword} onChange={(field, value) => update(field, value)} />
          </>
        )}

        {step === 2 && (
          <div className="form-section">
            <SectionHeading number="02" title="서비스 정보" description="서비스 가능한 국가와 항구, 업무 내용을 알려주세요." />

            <div className="form-grid">
              <FormField label="서비스 국가" name="country" value={form.country} onChange={(value) => update("country", value)} placeholder="예: 대한민국, 미국" required />
              <ChoiceGroup label="서비스 범위" options={["전 항구 서비스", "직접 입력"]} value={form.serviceScope} onChange={(value) => update("serviceScope", value)} />
            </div>

            <FormField label="서비스 항구" name="ports" value={form.ports} onChange={(value) => update("ports", value)} placeholder="예: 부산항, 울산항, 인천항" required={form.serviceScope === "직접 입력"} hint="지역 또는 항구 이름을 쉼표로 구분해 입력해주세요." />

            <label className="form-field">
              <span className="form-field__label">서비스 내역<em>*</em></span>
              <textarea value={form.services} onChange={(event) => update("services", event.target.value)} placeholder="선용품 공급, 선박 수리, 통역, 운송 등 제공하는 서비스를 자세히 작성해주세요." maxLength={1000} required />
              <small className="character-count">{form.services.length} / 1,000자</small>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <SectionHeading number="03" title="추가 연락처" description="선택 정보이며, 입력 시 업체 정보에 함께 표시됩니다." />

            <div className="optional-banner">
              <Icon name="bell" size={18} />
              <p><strong>선택 입력 항목입니다.</strong> 비워두어도 업체회원 가입이 가능합니다.</p>
            </div>

            <div className="form-grid">
              <FormField label="FAX" name="fax" value={form.fax} onChange={(value) => update("fax", value)} placeholder="+82 51-000-0000" />
              <FormField label="대표자 텔레그램" name="telegram" value={form.telegram} onChange={(value) => update("telegram", value)} placeholder="@telegram_id" />
              <FormField label="카카오톡 아이디" name="kakaoId" value={form.kakaoId} onChange={(value) => update("kakaoId", value)} placeholder="kakao_id" />
              <FormField label="카카오톡 오픈채팅방" name="openChat" value={form.openChat} onChange={(value) => update("openChat", value)} placeholder="https://open.kakao.com/..." />
            </div>

            <label className="form-field">
              <span className="form-field__label">비고</span>
              <textarea value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="고객에게 추가로 안내할 내용을 입력해주세요." />
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => (step > 1 ? setStep(step - 1) : navigate("/signup"))} disabled={isSubmitting}>
            이전
          </button>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "가입 처리 중..." : step < 3 ? "다음 단계" : "업체회원으로 가입하기"}
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}