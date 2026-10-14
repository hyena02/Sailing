import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import "../../../styles/home.css";
import { createJob } from "../jobApi";
import "../Jobs.css";

type JobForm = {
  title: string;
  positionName: string;
  vesselType: string;
  location: string;
  employmentType: string;
  experience: string;
  workSchedule: string;
  salary: string;
  salaryVisible: boolean;
  deadlineDate: string;
  isAlwaysOpen: boolean;
  duties: string;
  requirements: string;
  description: string;
  recruitmentSteps: string;
};

const emptyForm: JobForm = {
  title: "",
  positionName: "",
  vesselType: "",
  location: "",
  employmentType: "",
  experience: "",
  workSchedule: "",
  salary: "",
  salaryVisible: true,
  deadlineDate: "",
  isAlwaysOpen: false,
  duties: "",
  requirements: "",
  description: "",
  recruitmentSteps: "",
};

export default function JobCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (saving) return;

    setSaving(true);
    try {
      const created = await createJob({ ...form, jobStatus: "OPEN" });
      navigate(`/jobs/detail/${created.jobId}`, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "채용공고를 등록하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="subpage jobs-page">
      <Header />
      <main className="job-create container">
        <button type="button" className="page-back" onClick={() => navigate("/jobs")}>
          <Icon name="chevron" size={17} /> 채용공고 목록
        </button>
        <div className="job-create__heading">
          <span>CREATE A JOB</span>
          <h1>채용공고 등록</h1>
          <p>지원자에게 전달할 공고 정보를 입력해주세요.</p>
        </div>

        <form className="job-create__form" onSubmit={submit}>
          <CreateSection title="공고 기본정보" description="공고 제목과 담당 직무를 입력합니다.">
            <Field label="공고 제목" required>
              <input value={form.title} onChange={(event) => update("title", event.target.value)} maxLength={200} required />
            </Field>
            <Field label="담당 직무" required>
              <input value={form.positionName} onChange={(event) => update("positionName", event.target.value)} required />
            </Field>
            <Field label="선박 종류">
              <input value={form.vesselType} onChange={(event) => update("vesselType", event.target.value)} />
            </Field>
            <Field label="근무 지역" required>
              <input value={form.location} onChange={(event) => update("location", event.target.value)} required />
            </Field>
            <Field label="고용 형태">
              <input value={form.employmentType} onChange={(event) => update("employmentType", event.target.value)} />
            </Field>
            <Field label="경력 요건">
              <input value={form.experience} onChange={(event) => update("experience", event.target.value)} />
            </Field>
            <Field label="근무 형태">
              <input value={form.workSchedule} onChange={(event) => update("workSchedule", event.target.value)} />
            </Field>
            <Field label="급여">
              <input value={form.salary} onChange={(event) => update("salary", event.target.value)} />
            </Field>
            <Field label="마감일">
              <input
                type="date"
                value={form.deadlineDate}
                onChange={(event) => update("deadlineDate", event.target.value)}
                disabled={form.isAlwaysOpen}
              />
            </Field>
            <div className="create-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={form.isAlwaysOpen}
                  onChange={(event) => update("isAlwaysOpen", event.target.checked)}
                /> 상시채용
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.salaryVisible}
                  onChange={(event) => update("salaryVisible", event.target.checked)}
                /> 급여 공개
              </label>
            </div>
          </CreateSection>

          <CreateSection title="상세 내용" description="주요 업무, 지원 자격과 채용 절차를 작성합니다.">
            <Field label="주요 업무">
              <textarea value={form.duties} onChange={(event) => update("duties", event.target.value)} rows={4} />
            </Field>
            <Field label="지원 자격">
              <textarea value={form.requirements} onChange={(event) => update("requirements", event.target.value)} rows={4} />
            </Field>
            <Field label="상세 설명" required>
              <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={7} required />
            </Field>
            <Field label="채용 절차">
              <textarea
                value={form.recruitmentSteps}
                onChange={(event) => update("recruitmentSteps", event.target.value)}
                rows={3}
                placeholder="절차를 줄바꿈으로 구분해주세요."
              />
            </Field>
          </CreateSection>

          {error && (
            <div className="create-error" role="alert">
              <Icon name="bell" size={18} />
              {error}
              <p>현재 백엔드에 채용공고 등록 API가 구현되어 있는지 확인해주세요.</p>
            </div>
          )}

          <div className="job-create__actions">
            <button type="button" className="button button--outline" onClick={() => navigate("/jobs")}>
              취소
            </button>
            <button type="submit" className="button button--primary" disabled={saving}>
              {saving ? "등록 중..." : "공고 등록"}
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function CreateSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="create-section">
      <header><h2>{title}</h2><p>{description}</p></header>
      <div className="create-grid">{children}</div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="create-field">
      <span>{label}{required && <em> *</em>}</span>
      {children}
    </label>
  );
}