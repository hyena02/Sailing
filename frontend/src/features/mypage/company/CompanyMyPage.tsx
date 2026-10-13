import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Icon from "../../../components/common/icon";

import ProfileField from "../components/ProfileField";
import ProfileSection from "../components/ProfileSection";

import {
  CompanyMyPageApiError,
  getCompanyMyPage,
  updateCompanyMyPage,
} from "./companyMyPageApi";
import type {
  CompanyMyPageResponse,
  CompanyMyPageUpdateRequest,
} from "./companyMyPageTypes";

import "../MyPage.css";
import "./CompanyMyPage.css";

type FormState = CompanyMyPageUpdateRequest;

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
    // 현재는 로고 파일 업로드 기능이 연결되지 않아 기존 경로를 유지합니다.
    logoImage: profile.logoImage ?? null,
  };
}

function getVerificationLabel(status?: string | null): string {
  switch (status) {
    case "APPROVED":
      return "승인 완료";
    case "REJECTED":
      return "승인 반려";
    case "PENDING":
      return "승인 대기";
    default:
      return "상태 확인 필요";
  }
}

export default function CompanyMyPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<CompanyMyPageResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    getCompanyMyPage()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm(toForm(data));
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        if (err instanceof CompanyMyPageApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "기업회원 정보를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const requestBody: CompanyMyPageUpdateRequest = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        address: form.address.trim(),
        // 로고 업로드가 아직 없으므로 기존 저장값을 그대로 전달합니다.
        logoImage: profile?.logoImage ?? null,
      };

      const updated = await updateCompanyMyPage(requestBody);
      setProfile(updated);
      setForm(toForm(updated));
      setNotice("기업회원 정보가 저장되었습니다.");
    } catch (err) {
      if (err instanceof CompanyMyPageApiError && err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "정보 저장 중 오류가 발생했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    if (profile) setForm(toForm(profile));
    setError("");
    setNotice("");
  };

  const verificationStatus = profile?.verificationStatus ?? "PENDING";
  const verificationClass =
    verificationStatus === "APPROVED"
      ? "is-approved"
      : verificationStatus === "REJECTED"
        ? "is-rejected"
        : "is-pending";

  return (
    <div className="subpage mypage company-mypage">
      <Header />

      <main className="mypage-main">
        <section className="mypage-banner company-mypage-banner">
          <div className="container">
            <span>COMPANY PROFILE</span>
            <h1>기업회원 마이페이지</h1>
            <p>기업 정보와 담당자 연락처를 확인하고 관리하세요.</p>
          </div>
        </section>

        <div className="container mypage-layout company-mypage-layout">
          <aside className="mypage-sidebar company-mypage-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar company-profile-avatar">
                <Icon name="building" size={32} />
              </div>
              <strong>{profile?.companyName || "기업회원"}</strong>
              <span>선사·기업 회원</span>
              {profile?.loginId && (
                <small className="profile-login-id">@{profile.loginId}</small>
              )}
            </div>

            <nav aria-label="기업회원 마이페이지 메뉴">
              <button type="button" className="is-active" aria-current="page">
                <Icon name="building" size={18} />
                기업 정보 관리
              </button>
              <button type="button" onClick={() => navigate("/jobs/new")}>
                <Icon name="briefcase" size={18} />
                구인공고 등록
              </button>
            </nav>

            <div className={`company-verification ${verificationClass}`}>
              <span className="company-verification__label">기업 인증 상태</span>
              <strong>{getVerificationLabel(profile?.verificationStatus)}</strong>
              <p>
                {verificationStatus === "APPROVED"
                  ? "기업 인증이 완료되었습니다."
                  : verificationStatus === "REJECTED"
                    ? "등록 정보를 확인한 뒤 관리자에게 문의해주세요."
                    : "기업 정보가 관리자 확인을 기다리고 있습니다."}
              </p>
            </div>
          </aside>

          <div className="mypage-content">
            <section className="profile-card company-profile-card">
              <div className="profile-card__heading">
                <div>
                  <span>PROFILE SETTINGS</span>
                  <h2>기업 정보 수정</h2>
                </div>
                <em>필수 정보는 *로 표시됩니다.</em>
              </div>

              {loading ? (
                <p className="mypage-state" role="status">
                  기업회원 정보를 불러오는 중입니다...
                </p>
              ) : error && !profile ? (
                <div className="mypage-error" role="alert">
                  <strong>정보를 불러오지 못했습니다.</strong>
                  <p>{error}</p>
                  <button
                    type="button"
                    className="button button--outline"
                    onClick={() => window.location.reload()}
                  >
                    다시 시도
                  </button>
                </div>
              ) : profile ? (
                <form onSubmit={handleSubmit}>
                  <ProfileSection
                    title="계정 정보"
                    description="로그인 ID와 사업자등록번호는 이 화면에서 변경할 수 없습니다."
                  >
                    <div className="profile-form-grid">
                      <ProfileField
                        label="로그인 ID"
                        value={profile.loginId ?? ""}
                        onChange={() => undefined}
                        disabled
                      />
                      <ProfileField
                        label="사업자등록번호"
                        value={profile.businessNumber ?? ""}
                        onChange={() => undefined}
                        disabled
                      />
                    </div>
                  </ProfileSection>

                  <ProfileSection
                    title="기업 기본 정보"
                    description="기업명과 사업장 주소를 최신 정보로 유지해주세요."
                  >
                    <div className="profile-form-grid">
                      <ProfileField
                        label="기업명"
                        value={form.companyName}
                        onChange={(value) => update("companyName", value)}
                        required
                        maxLength={200}
                        placeholder="등록된 기업명"
                      />
                      <ProfileField
                        label="기업 주소"
                        value={form.address}
                        onChange={(value) => update("address", value)}
                        required
                        maxLength={500}
                        placeholder="사업장 주소를 입력해주세요."
                        wide
                      />
                    </div>
                  </ProfileSection>

                  <ProfileSection
                    title="담당자 연락처"
                    description="기업 관련 연락을 받을 담당자 정보를 입력해주세요."
                  >
                    <div className="profile-form-grid">
                      <ProfileField
                        label="담당자 이름"
                        value={form.name}
                        onChange={(value) => update("name", value)}
                        required
                        maxLength={100}
                        placeholder="담당자 이름"
                      />
                      <ProfileField
                        label="전화번호"
                        type="tel"
                        value={form.phone}
                        onChange={(value) => update("phone", value)}
                        maxLength={30}
                        placeholder="010-1234-5678"
                      />
                      <ProfileField
                        label="이메일"
                        type="email"
                        value={form.email}
                        onChange={(value) => update("email", value)}
                        maxLength={200}
                        placeholder="company@example.com"
                      />
                    </div>
                  </ProfileSection>

                  <div className="company-logo-note">
                    <Icon name="bell" size={18} />
                    <p>
                      <strong>기업 로고 업로드는 아직 연결되지 않았습니다.</strong>
                      기존 로고 정보는 저장할 때 유지됩니다.
                    </p>
                  </div>

                  {error && (
                    <div className="mypage-error" role="alert">{error}</div>
                  )}

                  {notice && (
                    <div className="profile-saved" role="status">
                      <Icon name="bell" size={18} />
                      {notice}
                    </div>
                  )}

                  <div className="profile-actions">
                    <button
                      type="button"
                      className="button button--outline"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      변경 취소
                    </button>
                    <button
                      type="submit"
                      className="button button--dark"
                      disabled={saving || loading}
                    >
                      {saving ? "저장 중..." : "변경사항 저장"}
                      {!saving && <Icon name="arrow" size={18} />}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mypage-error" role="alert">
                  기업회원 정보를 표시할 수 없습니다.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
