
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../../../components/common/icon";

import MyPageLayout from "../components/MypageLayout";
import ProfileField from "../components/ProfileField";
import ProfileSection from "../components/ProfileSection";

import {
  ApiError,
  getPersonalMyPage,
  updatePersonalMyPage,
} from "./personalMyPageApi";

import type {
  PerMyPageResponse,
  PerMyPageUpdateRequest,
} from "./personalMyPageTypes";

type FormState = PerMyPageUpdateRequest;

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  nickname: "",
  birthDate: "",
  gender: "",
  nationality: "",
};

function toForm(profile: PerMyPageResponse): FormState {
  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    nickname: profile.nickname ?? "",
    birthDate: profile.birthDate ?? "",
    gender: profile.gender ?? "",
    nationality: profile.nationality ?? "",
  };
}

export default function PersonalMyPage() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<PerMyPageResponse | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    getPersonalMyPage()
      .then((data) => {
        if (cancelled) return;

        setProfile(data);
        setForm(toForm(data));
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "회원정보를 불러오지 못했습니다."
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
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setNotice("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const updated = await updatePersonalMyPage(form);

      setProfile(updated);
      setForm(toForm(updated));
      setNotice("프로필 정보가 저장되었습니다.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "저장 중 오류가 발생했습니다."
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

  return (
    <MyPageLayout
      eyebrow="PERSONAL PROFILE"
      title="일반회원 마이페이지"
      description="내 정보와 구직 활동 정보를 안전하게 관리하세요."
      activeTab="profile"
    >
      <section className="profile-card">
        <div className="profile-card__heading">
          <div>
            <span>PROFILE SETTINGS</span>
            <h2>프로필 정보 수정</h2>
          </div>
          <em>필수 정보는 *로 표시됩니다.</em>
        </div>

        {loading ? (
          <p className="mypage-state">
            회원정보를 불러오는 중입니다...
          </p>
        ) : error && !profile ? (
          <div className="mypage-error" role="alert">
            {error}
          </div>
        ) : profile ? (
          <form onSubmit={handleSubmit}>
            <ProfileSection title="기본 정보"
              description="회원가입 때 입력한 정보를 확인하고 수정할 수 있습니다.">
              <div className="profile-form-grid">
                <ProfileField label="이름" value={form.name}
                  onChange={(value) => update("name", value)} required maxLength={100}
                />

                <ProfileField label="닉네임" value={form.nickname}
                  onChange={(value) => update("nickname", value)} required maxLength={50}
                />

                <ProfileField label="연락처" type="tel" value={form.phone}
                  onChange={(value) => update("phone", value)} maxLength={30} placeholder="010-1234-5678"
                />

                <ProfileField label="이메일" type="email" value={form.email}
                  onChange={(value) => update("email", value)} placeholder="example@email.com"
                />

                <ProfileField label="생년월일" type="date" value={form.birthDate}
                  onChange={(value) =>update("birthDate", value)}required
                />

                <label className="profile-field">
                  <span>성별 *</span>
                  <select value={form.gender}
                    onChange={(event) =>update("gender", event.target.value)}required>
                    <option value="">선택해주세요</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </label>

                <label className="profile-field">
                  <span>국적 *</span>
                  <select value={form.nationality}
                    onChange={(event) => update("nationality", event.target.value)} required>
                    <option value="">선택해주세요</option>
                    <option value="DOMESTIC">내국인</option>
                    <option value="FOREIGN">외국인</option>
                  </select>
                </label>
              </div>
            </ProfileSection>

            {error && (
              <div className="mypage-error" role="alert">
                {error}
              </div>
            )}

            {notice && (
              <div className="profile-saved" role="status">
                <Icon name="bell" size={18} />
                {notice}
              </div>
            )}

            <div className="profile-actions">
              <button type="button" className="button button--outline" 
                onClick={resetForm} disabled={saving} >
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
            회원정보를 표시할 수 없습니다.
          </div>
        )}
      </section>
    </MyPageLayout>
  );
}
