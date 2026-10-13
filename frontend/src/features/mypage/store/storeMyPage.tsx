import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Icon from "../../../components/common/icon";
import ProfileField from "../components/ProfileField";
import ProfileSection from "../components/ProfileSection";
import {
  getStoreMyPage,
  StoreMyPageApiError,
  updateStoreMyPage,
} from "./storeMyPageApi";
import type {
  StoreMyPageResponse,
  StoreMyPageUpdateRequest,
} from "./storeMyPageTypes";

import "../MyPage.css";
import "./StoreMyPage.css";

type FormState = StoreMyPageUpdateRequest;
type LocalFields = { introduction: string };

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  storeName: "",
  representative: "",
  address: "",
  region: "",
  serviceCountry: "대한민국",
  homepage: "",
  fax: "",
  telegram: "",
  kakaoId: "",
  kakaoOpenchat: "",
  servicePorts: "",
  serviceDetails: "",
  remarks: "",
};

function toForm(profile: StoreMyPageResponse): FormState {
  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    storeName: profile.storeName ?? "",
    representative: profile.representative ?? "",
    address: profile.address ?? "",
    region: profile.region ?? "",
    serviceCountry: profile.serviceCountry ?? "대한민국",
    homepage: profile.homepage ?? "",
    fax: profile.fax ?? "",
    telegram: profile.telegram ?? "",
    kakaoId: profile.kakaoId ?? "",
    kakaoOpenchat: profile.kakaoOpenchat ?? "",
    servicePorts: profile.servicePorts ?? "",
    serviceDetails: profile.serviceDetails ?? "",
    remarks: profile.remarks ?? "",
  };
}

function verificationCopy(status?: string | null) {
  switch (status) {
    case "APPROVED":
      return { label: "승인 완료", className: "is-approved", description: "업체 인증이 완료되었습니다." };
    case "REJECTED":
      return { label: "승인 반려", className: "is-rejected", description: "업체 정보를 확인한 뒤 관리자에게 문의해주세요." };
    case "PENDING":
      return { label: "검토 중", className: "is-pending", description: "업체 정보가 관리자 확인을 기다리고 있습니다." };
    default:
      return { label: "상태 확인 필요", className: "is-pending", description: "현재 인증 상태를 확인할 수 없습니다." };
  }
}

export default function StoreMyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StoreMyPageResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [localFields, setLocalFields] = useState<LocalFields>({ introduction: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [partnerImage, setPartnerImage] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    getStoreMyPage()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm(toForm(data));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof StoreMyPageApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err instanceof Error ? err.message : "업체회원 정보를 불러오지 못했습니다.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [navigate]);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const previewImage = (event: ChangeEvent<HTMLInputElement>, setPreview: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("JPG 또는 PNG 이미지 파일을 선택해주세요.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setNotice("");
  };

  const saveProfile = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const requestBody: StoreMyPageUpdateRequest = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        storeName: form.storeName.trim(),
        representative: form.representative.trim(),
        address: form.address.trim(),
        region: form.region.trim(),
        serviceCountry: form.serviceCountry.trim(),
        homepage: form.homepage.trim(),
        fax: form.fax.trim(),
        telegram: form.telegram.trim(),
        kakaoId: form.kakaoId.trim(),
        kakaoOpenchat: form.kakaoOpenchat.trim(),
        servicePorts: form.servicePorts.trim(),
        serviceDetails: form.serviceDetails.trim(),
        remarks: form.remarks.trim(),
      };
      const updated = await updateStoreMyPage(requestBody);
      setProfile(updated);
      setForm(toForm(updated));
      setNotice("업체 기본 정보와 서비스 정보가 저장되었습니다.");
      setConfirmOpen(false);
    } catch (err) {
      if (err instanceof StoreMyPageApiError && err.status === 401) {
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
    if (profile) setForm(toForm(profile));
    setLocalFields({ introduction: "" });
    setLogoPreview("");
    setPartnerImage("");
    setDocumentName("");
    setError("");
    setNotice("");
  };

  const verification = verificationCopy(profile?.verificationStatus);

  return (
    <div className="subpage mypage store-mypage">
      <Header />
      <main className="mypage-main">
        <section className="mypage-banner store-mypage-banner">
          <div className="container"><span>STORE PROFILE</span><h1>업체회원 마이페이지</h1><p>업체 소개와 서비스 정보를 고객에게 정확하게 알려주세요.</p></div>
        </section>

        <div className="container mypage-layout store-mypage-layout">
          <aside className="mypage-sidebar store-mypage-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar store-profile-avatar">{logoPreview ? <img src={logoPreview} alt="업체 로고 미리보기" /> : <Icon name="building" size={34} />}</div>
              <strong>{form.storeName || "업체회원"}</strong><span>선식·선용품 업체</span>
              {profile?.loginId && <small className="profile-login-id">@{profile.loginId}</small>}
            </div>
            <nav aria-label="업체회원 마이페이지 메뉴">
              <button type="button" className="is-active" aria-current="page"><Icon name="building" size={18} />업체 정보 관리</button>
              <button type="button" onClick={() => document.getElementById("store-service-info")?.scrollIntoView({ behavior: "smooth" })}><Icon name="compass" size={18} />서비스 정보</button>
              <button type="button" onClick={() => setPreviewOpen(true)}><Icon name="search" size={18} />공개 화면 미리보기</button>
            </nav>
            <div className={`company-verification store-verification ${verification.className}`}>
              <span className="company-verification__label">업체 인증 상태</span><strong>{verification.label}</strong><p>{verification.description}</p>
            </div>
          </aside>

          <section className="profile-card store-profile-card">
            <div className="profile-card__heading"><div><span>PROFILE SETTINGS</span><h2>업체 정보 수정</h2></div><em>필수 정보는 *로 표시됩니다.</em></div>

            {loading ? <p className="mypage-state" role="status">업체회원 정보를 불러오는 중입니다...</p> : !profile ? (
              <div className="mypage-error" role="alert"><strong>업체회원 정보를 불러오지 못했습니다.</strong><p>{error}</p><button type="button" className="button button--outline" onClick={() => window.location.reload()}>다시 시도</button></div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="profile-image-editor">
                  <div className="profile-avatar profile-avatar--large store-profile-avatar">{logoPreview ? <img src={logoPreview} alt="업체 로고 미리보기" /> : <Icon name="building" size={40} />}</div>
                  <div><strong>업체 로고</strong><p>JPG, PNG 이미지를 선택해 화면 미리보기를 확인할 수 있습니다.</p><label className="button button--outline">이미지 변경<input type="file" accept="image/png,image/jpeg" onChange={(event) => previewImage(event, setLogoPreview)} /></label></div>
                </div>

                <ProfileSection title="계정 정보" description="로그인 ID와 인증 상태는 이 화면에서 직접 변경할 수 없습니다.">
                  <div className="profile-form-grid"><ProfileField label="로그인 ID" value={profile.loginId ?? ""} onChange={() => undefined} disabled /><ProfileField label="업체 인증 상태" value={verification.label} onChange={() => undefined} disabled /></div>
                </ProfileSection>

                <ProfileSection title="업체 기본 정보" description="업체명, 대표자와 연락처, 공개할 주소 및 홈페이지를 관리합니다.">
                  <div className="profile-form-grid">
                    <ProfileField label="업체 이름" value={form.storeName} onChange={(value) => update("storeName", value)} required maxLength={255} placeholder="업체명을 입력해주세요" />
                    <ProfileField label="담당자 이름" value={form.name} onChange={(value) => update("name", value)} required maxLength={100} placeholder="로그인 회원의 담당자 이름" />
                    <ProfileField label="대표자 이름" value={form.representative} onChange={(value) => update("representative", value)} required maxLength={100} placeholder="대표자 이름" />
                    <ProfileField label="대표자 전화번호" type="tel" value={form.phone} onChange={(value) => update("phone", value)} maxLength={30} placeholder="051-123-4567" />
                    <ProfileField label="대표자 이메일" type="email" value={form.email} onChange={(value) => update("email", value)} maxLength={255} placeholder="store@example.com" />
                    <ProfileField label="홈페이지 주소" value={form.homepage} onChange={(value) => update("homepage", value)} maxLength={500} placeholder="https://example.com" />
                    <ProfileField label="서비스 지역" value={form.region} onChange={(value) => update("region", value)} maxLength={100} placeholder="예: 부산·울산" />
                    <ProfileField label="업체 대표주소" value={form.address} onChange={(value) => update("address", value)} required maxLength={500} placeholder="업체 주소를 입력해주세요" wide />
                    <label className="profile-field is-wide"><span>업체 소개</span><textarea value={localFields.introduction} onChange={(event) => setLocalFields({ introduction: event.target.value })} maxLength={500} placeholder="업체와 서비스를 간단히 소개해주세요." /><small>{localFields.introduction.length} / 500</small></label>
                  </div>
                </ProfileSection>

                <ProfileSection title="한인선식 카드 관리" description="업체 목록과 공개 화면에 표시할 대표 이미지를 미리 확인합니다.">
                  <div className="partner-profile-editor">
                    <label className={partnerImage ? "has-image" : ""}>
                      <input type="file" accept="image/png,image/jpeg" onChange={(event) => previewImage(event, setPartnerImage)} />
                      {partnerImage ? <img src={partnerImage} alt="업체 대표 이미지 미리보기" /> : <span><Icon name="building" size={28} /><strong>업체 대표 사진 첨부</strong><small>항만, 매장, 서비스 현장 이미지를 권장합니다.</small></span>}
                      <em>이미지 선택</em>
                    </label>
                    <div><strong>공개 화면 미리보기</strong><p>저장 전에도 업체 카드가 어떤 모습으로 보일지 확인할 수 있습니다.</p><button type="button" className="button button--outline" onClick={() => setPreviewOpen(true)}>업체 상세 미리보기 <Icon name="arrow" size={16} /></button></div>
                  </div>
                </ProfileSection>

                <div id="store-service-info">
                <ProfileSection title="서비스 정보" description="서비스 국가, 서비스 항구와 제공 가능한 업무를 관리합니다.">
                  <div className="profile-form-grid">
                    <label className="profile-field"><span>서비스 가능 국가 *</span><select required value={form.serviceCountry} onChange={(event) => update("serviceCountry", event.target.value)}><option value="대한민국">대한민국</option><option value="대한민국·일본">대한민국·일본</option><option value="동아시아">동아시아</option><option value="전 세계">전 세계</option></select></label>
                    <label className="profile-field is-wide"><span>서비스 항구</span><textarea value={form.servicePorts} onChange={(event) => update("servicePorts", event.target.value)} maxLength={2000} placeholder="예: 부산항, 울산항, 마산항" /><small>{form.servicePorts.length} / 2000</small></label>
                    <label className="profile-field is-wide"><span>서비스 내역</span><textarea value={form.serviceDetails} onChange={(event) => update("serviceDetails", event.target.value)} maxLength={5000} placeholder="제공 가능한 선식·선용품·부품 공급 등의 업무를 입력해주세요." /><small>{form.serviceDetails.length} / 5000</small></label>
                  </div>
                </ProfileSection>
                </div>

                <ProfileSection title="추가 연락처" description="고객이 업체에 연락할 수 있는 추가 채널입니다. 선택 항목은 비워둘 수 있습니다.">
                  <div className="profile-form-grid">
                    <ProfileField label="FAX" value={form.fax} onChange={(value) => update("fax", value)} maxLength={30} placeholder="팩스 번호" />
                    <ProfileField label="대표자 텔레그램" value={form.telegram} onChange={(value) => update("telegram", value)} maxLength={100} placeholder="@telegram_id" />
                    <ProfileField label="카카오톡 아이디" value={form.kakaoId} onChange={(value) => update("kakaoId", value)} maxLength={100} placeholder="카카오톡 아이디" />
                    <ProfileField label="카카오톡 오픈채팅방" value={form.kakaoOpenchat} onChange={(value) => update("kakaoOpenchat", value)} maxLength={500} placeholder="오픈채팅 URL" />
                    <label className="profile-field is-wide"><span>비고</span><textarea value={form.remarks} onChange={(event) => update("remarks", event.target.value)} maxLength={5000} placeholder="고객에게 추가로 알릴 내용을 입력해주세요." /><small>{form.remarks.length} / 5000</small></label>
                  </div>
                </ProfileSection>

                <ProfileSection title="업체 인증" description="현재 인증 상태를 확인하고 인증 서류 파일을 선택합니다.">
                  <div className="verification-card">
                    <div className="verification-status"><span className={`status-dot ${profile.verificationStatus === "APPROVED" ? "is-approved" : profile.verificationStatus === "REJECTED" ? "is-rejected" : ""}`} /><div><span>현재 인증 상태</span><strong>{verification.label}</strong><p>{verification.description}</p></div></div>
                    <label className={`document-upload ${documentName ? "has-file" : ""}`}><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setDocumentName(event.target.files?.[0]?.name ?? "")} /><span><Icon name="briefcase" size={22} /></span><div><strong>{documentName || "인증 서류를 선택해주세요"}</strong><small>{documentName ? "선택된 파일입니다. 서버 업로드는 아직 연결되지 않았습니다." : "PDF, JPG, PNG 파일 · 파일 선택 미리보기"}</small></div><em>{documentName ? "파일 변경" : "서류 선택"}</em></label>
                    <p className="verification-help"><Icon name="bell" size={16} />현재 서버에는 인증 서류 파일 업로드 기능이 연결되지 않아 파일 선택만 가능합니다.</p>
                  </div>
                </ProfileSection>

                <div className="mypage-capability-note"><Icon name="bell" size={17} /><p><strong>현재 서버 저장 범위 안내</strong><span>업체명·대표자·연락처·주소·국가·지역·홈페이지·서비스 항구/내역·추가 연락처·비고는 저장됩니다. 소개 문구, 새 이미지 파일, 인증 서류는 현재 DB/API에 저장 기능이 없어 미리보기만 제공됩니다.</span></p></div>
                {error && <div className="mypage-error" role="alert">{error}</div>}
                {notice && <div className="profile-saved" role="status"><Icon name="bell" size={18} />{notice}</div>}
                <div className="profile-actions"><button type="button" className="button button--outline" onClick={resetForm} disabled={saving}>변경 취소</button><button type="submit" className="button button--dark" disabled={saving}>{saving ? "저장 중..." : "변경사항 저장"} {!saving && <Icon name="arrow" size={18} />}</button></div>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />

      {confirmOpen && <div className="password-modal-backdrop" onMouseDown={() => !saving && setConfirmOpen(false)}><div className="password-modal" role="dialog" aria-modal="true" aria-labelledby="store-save-confirm-title" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="password-modal__close" onClick={() => !saving && setConfirmOpen(false)} aria-label="닫기"><Icon name="x" size={20} /></button><span className="password-modal__icon"><Icon name="building" size={24} /></span><h2 id="store-save-confirm-title">변경사항 저장</h2><p>입력한 업체 및 서비스 정보를 저장하시겠습니까?</p><div className="password-modal__actions"><button type="button" className="button button--outline" onClick={() => setConfirmOpen(false)} disabled={saving}>취소</button><button type="button" className="button button--dark" onClick={() => void saveProfile()} disabled={saving}>{saving ? "저장 중..." : "저장하기"}</button></div></div></div>}

      {previewOpen && <div className="password-modal-backdrop" onMouseDown={() => setPreviewOpen(false)}><div className="partner-preview-modal" role="dialog" aria-modal="true" aria-labelledby="store-preview-title" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="password-modal__close" onClick={() => setPreviewOpen(false)} aria-label="닫기"><Icon name="x" size={20} /></button>{partnerImage ? <img src={partnerImage} alt="업체 대표 이미지" /> : <div className="partner-preview-placeholder"><Icon name="building" size={38} /></div>}<div className="partner-preview-content"><span>선식·선용품 · {form.serviceCountry}</span><h2 id="store-preview-title">{form.storeName || "업체명"}</h2><p>{localFields.introduction || form.serviceDetails || "등록한 업체 소개 및 서비스가 이 영역에 표시됩니다."}</p><div>{form.serviceDetails.split(/[，,\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 8).map((item) => <em key={item}>{item}</em>)}</div><dl><div><dt>서비스 항구</dt><dd>{form.servicePorts || "미입력"}</dd></div><div><dt>전화</dt><dd>{form.phone || "미입력"}</dd></div><div><dt>이메일</dt><dd>{form.email || "미입력"}</dd></div><div><dt>주소</dt><dd>{form.address || "미입력"}</dd></div></dl><p className="preview-only-note">화면 미리보기이며, 대표 이미지는 서버에 저장되지 않습니다.</p></div></div></div>}
    </div>
  );
}
