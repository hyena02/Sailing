import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Icon from "../../../components/common/icon";
import ProfileField from "../../mypage/components/ProfileField";
import ProfileSection from "../../mypage/components/ProfileSection";
import ManagerModal from "../company/components/ManagerModal"
import {
  CompanyMyPageApiError,
  getCompanyMyPage,
  updateCompanyMyPage,
} from "../../mypage/company/companyMyPageApi";
import type {
  CompanyMyPageResponse,
  CompanyMyPageUpdateRequest,
} from "../../mypage/company/companyMyPageTypes";
import VerificationCard from "../components/VerificationCard";

import "../MyPage.css";
import "./CompanyMyPage.css";

type FormState = CompanyMyPageUpdateRequest;


type LocalFields = { website: string; introduction: string };

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  address: "",
  logoImage: null,
};

function toForm(profile: CompanyMyPageResponse): FormState {
  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    companyName: profile.companyName ?? "",
    address: profile.address ?? "",
    logoImage: profile.logoImage ?? null,
  };
}

function verificationCopy(status?: string | null) {
  switch (status) {
    case "APPROVED":
      return { label: "승인 완료", className: "is-approved", description: "기업 인증이 완료되었습니다." };
    case "REJECTED":
      return { label: "승인 반려", className: "is-rejected", description: "등록 정보를 확인한 뒤 관리자에게 문의해주세요." };
    case "PENDING":
      return { label: "검토 중", className: "is-pending", description: "기업 정보가 관리자 확인을 기다리고 있습니다." };
    default:
      return { label: "상태 확인 필요", className: "is-pending", description: "현재 인증 상태를 확인할 수 없습니다." };
  }
}

export default function CompanyMyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompanyMyPageResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [localFields, setLocalFields] = useState<LocalFields>({ website: "", introduction: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    let cancelled = false;
    getCompanyMyPage()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm(toForm(data));
        setLogoPreview(data.logoImage ?? "");
        setManagers([{
          id: data.userId ?? Date.now(),
          name: data.name ?? "",
          position: "대표 담당자",
          phone: data.phone ?? "",
          email: data.email ?? "",
          primary: true,
        }]);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof CompanyMyPageApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err instanceof Error ? err.message : "기업회원 정보를 불러오지 못했습니다.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [navigate]);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const uploadLogoPreview = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("JPG 또는 PNG 이미지 파일을 선택해주세요.");
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    setNotice("");
  };

  const saveProfile = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const primary = managers.find((item) => item.primary);
      const requestBody: CompanyMyPageUpdateRequest = {
        name: (primary?.name || form.name).trim(),
        email: (primary?.email || form.email).trim(),
        phone: (primary?.phone || form.phone).trim(),
        companyName: form.companyName.trim(),
        address: form.address.trim(),
        // 새 파일은 아직 업로드 API가 없으므로 기존 서버 경로를 유지합니다.
        logoImage: profile?.logoImage ?? null,
      };
      const updated = await updateCompanyMyPage(requestBody);
      setProfile(updated);
      setForm(toForm(updated));
      setLogoPreview(updated.logoImage ?? logoPreview);
      setManagers((items) => items.length
        ? items.map((item) => item.primary ? {
            ...item,
            name: updated.name ?? item.name,
            phone: updated.phone ?? item.phone,
            email: updated.email ?? item.email,
          } : item)
        : [{ id: updated.userId, name: updated.name, position: "대표 담당자", phone: updated.phone ?? "", email: updated.email ?? "", primary: true }]);
      setNotice("기업 기본 정보가 저장되었습니다.");
      setConfirmOpen(false);
    } catch (err) {
      if (err instanceof CompanyMyPageApiError && err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "정보 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setConfirmOpen(true);
  };

  const resetForm = () => {
    if (profile) {
      setForm(toForm(profile));
      setLogoPreview(profile.logoImage ?? "");
    }
    setLocalFields({ website: "", introduction: "" });
    setDocumentName("");
    setError("");
    setNotice("");
  };

  const verification = verificationCopy(profile?.verificationStatus);
  const primaryManager = managers.find((item) => item.primary);

  return (
    <div className="subpage mypage company-mypage">
      <Header />
      <main className="mypage-main">
        <section className="mypage-banner company-mypage-banner">
          <div className="container">
            <span>COMPANY PROFILE</span>
            <h1>기업회원 마이페이지</h1>
            <p>기업 프로필과 채용 담당자 정보를 확인하고 관리하세요.</p>
          </div>
        </section>

        <div className="container mypage-layout company-mypage-layout">
          <aside className="mypage-sidebar company-mypage-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar company-profile-avatar">
                {logoPreview ? <img src={logoPreview} alt="기업 로고 미리보기" /> : <Icon name="building" size={34} />}
              </div>
              <strong>{form.companyName || "기업회원"}</strong>
              <span>선사·기업 회원</span>
              {profile?.loginId && <small className="profile-login-id">@{profile.loginId}</small>}
            </div>
            <nav aria-label="기업회원 마이페이지 메뉴">
              <button type="button" className="is-active" aria-current="page"><Icon name="building" size={18} />기업 정보 관리</button>
              <button type="button" onClick={() => navigate("/jobs/new")}><Icon name="briefcase" size={18} />구인공고 등록</button>
              <button type="button" onClick={() => setManagerOpen(true)}><Icon name="user" size={18} />담당자 관리</button>
            </nav>
            <div className={`company-verification ${verification.className}`}>
              <span className="company-verification__label">기업 인증 상태</span>
              <strong>{verification.label}</strong>
              <p>{verification.description}</p>
            </div>
          </aside>

          <section className="profile-card company-profile-card">
            <div className="profile-card__heading">
              <div><span>PROFILE SETTINGS</span><h2>기업 정보 수정</h2></div>
              <em>필수 정보는 *로 표시됩니다.</em>
            </div>

            {loading ? <p className="mypage-state" role="status">기업회원 정보를 불러오는 중입니다...</p> : !profile ? (
              <div className="mypage-error" role="alert">
                <strong>기업회원 정보를 불러오지 못했습니다.</strong><p>{error}</p>
                <button type="button" className="button button--outline" onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="profile-image-editor">
                  <div className="profile-avatar profile-avatar--large company-profile-avatar">
                    {logoPreview ? <img src={logoPreview} alt="기업 로고 미리보기" /> : <Icon name="building" size={40} />}
                  </div>
                  <div>
                    <strong>기업 로고</strong><p>JPG, PNG 파일을 선택해 화면 미리보기를 확인할 수 있습니다.</p>
                    <label className="button button--outline">이미지 변경<input type="file" accept="image/png,image/jpeg" onChange={uploadLogoPreview} /></label>
                  </div>
                </div>

                <ProfileSection title="계정 정보" description="로그인 계정과 사업자등록번호는 보안을 위해 이 화면에서 변경할 수 없습니다.">
                  <div className="profile-form-grid">
                    <ProfileField label="로그인 ID" value={profile.loginId ?? ""} onChange={() => undefined} disabled />
                    <ProfileField label="사업자등록번호" value={profile.businessNumber ?? ""} onChange={() => undefined} disabled />
                  </div>
                </ProfileSection>

                <ProfileSection title="기업 기본 정보" description="회원가입 시 등록한 회사 정보와 대표 담당자 연락처를 관리합니다.">
                  <div className="profile-form-grid">
                    <ProfileField label="기업명" value={form.companyName} onChange={(value) => update("companyName", value)} required maxLength={200} placeholder="기업명을 입력해주세요" />
                    <label className="profile-field manager-field">
                      <span>대표 담당자 *</span>
                      <div className="manager-field__control"><input value={primaryManager?.name ?? form.name} readOnly /><button type="button" onClick={() => setManagerOpen(true)}>담당자 관리</button></div>
                    </label>
                    <ProfileField
                      label="담당자 연락처"
                      type="tel"
                      value={form.phone}
                      onChange={(value) => {
                        update("phone", value);
                        setManagers((items) => items.map((item) => item.primary ? { ...item, phone: value } : item));
                      }}
                      maxLength={30}
                      placeholder="전화번호를 입력해주세요"
                    />
                    <ProfileField
                      label="담당자 이메일"
                      type="email"
                      value={form.email}
                      onChange={(value) => {
                        update("email", value);
                        setManagers((items) => items.map((item) => item.primary ? { ...item, email: value } : item));
                      }}
                      maxLength={255}
                      placeholder="업무용 이메일을 입력해주세요"
                    />
                    <ProfileField label="홈페이지 주소" value={localFields.website} onChange={(value) => setLocalFields((prev) => ({ ...prev, website: value }))} placeholder="https://example.com" />
                    <ProfileField label="기업 주소" value={form.address} onChange={(value) => update("address", value)} required maxLength={500} placeholder="기업 주소를 입력해주세요" wide />
                    <label className="profile-field is-wide">
                      <span>기업 소개</span>
                      <textarea
                        value={localFields.introduction}
                        onChange={(event) => setLocalFields((prev) => ({ ...prev, introduction: event.target.value }))}
                        maxLength={500}
                        placeholder="기업과 사업을 소개해주세요."
                      />
                      <small>{localFields.introduction.length} / 500</small>
                    </label>
                  </div>
                </ProfileSection>

                <ProfileSection title="기업 인증" description="기업 인증 상태와 제출 서류를 확인합니다.">
                  <VerificationCard
                    status={profile.verificationStatus ?? "PENDING"}
                    label={verification.label}
                    description={verification.description}
                  >
                    <label className={`document-upload ${documentName ? "has-file" : ""}`}>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setDocumentName(event.target.files?.[0]?.name ?? "")} />
                      <span><Icon name="briefcase" size={22} /></span>
                      <div><strong>{documentName || "인증 서류를 선택해주세요"}</strong><small>{documentName ? "선택된 파일입니다. 서버 업로드는 아직 연결되지 않았습니다." : "PDF, JPG, PNG 파일 · 파일 선택 미리보기"}</small></div>
                      <em>{documentName ? "파일 변경" : "서류 선택"}</em>
                    </label>
                    <p className="verification-help"><Icon name="bell" size={16} />인증 서류 업로드 API가 연결되기 전까지는 파일이 서버에 저장되지 않습니다.</p>
                  </VerificationCard>
                </ProfileSection>

                <div className="mypage-capability-note">
                  <Icon name="bell" size={17} />
                  <p>
                    <strong>현재 서버 저장 범위 안내</strong>
                    <span>대표 담당자 이름·연락처·이메일, 기업명, 기업 주소가 저장됩니다. 홈페이지와 기업 소개는 아직 저장되지 않습니다.</span>
                  </p>
                </div>
                {error && <div className="mypage-error" role="alert">{error}</div>}
                {notice && <div className="profile-saved" role="status"><Icon name="bell" size={18} />{notice}</div>}
                <div className="profile-actions">
                  <button type="button" className="button button--outline" onClick={resetForm} disabled={saving}>변경 취소</button>
                  <button type="submit" className="button button--dark" disabled={saving}><>{saving ? "저장 중..." : "변경사항 저장"}</> {!saving && <Icon name="arrow" size={18} />}</button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />

      {confirmOpen && (
        <div className="password-modal-backdrop" onMouseDown={() => !saving && setConfirmOpen(false)}>
          <div
            className="password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-save-confirm-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="password-modal__close"
              onClick={() => !saving && setConfirmOpen(false)}
              aria-label="닫기"
            >
              <Icon name="x" size={20} />
            </button>
            <span className="password-modal__icon"><Icon name="user" size={24} /></span>
            <h2 id="company-save-confirm-title">변경사항 저장</h2>
            <p>입력한 기업 기본 정보를 저장하시겠습니까?</p>
            <div className="password-modal__actions">
              <button type="button" className="button button--outline" onClick={() => setConfirmOpen(false)} disabled={saving}>취소</button>
              <button type="button" className="button button--dark" onClick={() => void saveProfile()} disabled={saving}>
                {saving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {managerOpen && (
        <ManagerModal
          managers={managers}
          onChange={setManagers}
          onClose={() => setManagerOpen(false)}
        />
      )}
    </div>
  );
}