import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import CompanyLogo from "../../Home/components/CompanyLogo";
import { getJob } from "../jobApi";
import type { JobItem } from "../jobTypes";
import "../Jobs.css";

function splitLines(value?: string | null): string[] {
  return (value ?? "")
    .split(/\r?\n|[•;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function JobDetailPage() {
  const { jobId = "" } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const hasUser = Boolean(sessionStorage.getItem("sailingUser"));

  useEffect(() => {
    let active = true;

    getJob(jobId)
      .then((result) => {
        if (active) setJob(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "채용공고 정보를 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [jobId]);

  return (
    <div className="subpage jobs-page">
      <Header />
      <main className="job-detail container">
        <button className="page-back" type="button" onClick={() => navigate("/jobs")}>
          <Icon name="chevron" size={17} /> 채용공고 목록
        </button>

        {loading ? (
          <div className="jobs-empty" role="status">채용공고를 불러오는 중입니다.</div>
        ) : error || !job ? (
          <div className="jobs-empty" role="alert">
            <Icon name="bell" size={28} />
            <strong>채용공고를 표시할 수 없습니다.</strong>
            <p>{error || "요청한 공고를 찾을 수 없습니다."}</p>
            <small>백엔드의 채용공고 상세 API 구현 여부를 확인해주세요.</small>
          </div>
        ) : (
          <div className="job-detail__layout">
            <article className="job-detail__content">
              <header className="job-detail__header">
                <div className="job-detail__company">
                  <CompanyLogo name={job.companyName || "기업 정보 없음"} imageUrl={job.companyLogo} />
                  <span>{job.companyName || "기업 정보 없음"}</span>
                </div>
                <h1>{job.title}</h1>
                <div className="job-detail__tags">
                  <span>{job.positionName}</span>
                  <span><Icon name="map" size={14} />{job.location}</span>
                  {job.vesselType && <span>{job.vesselType}</span>}
                </div>
              </header>

              <section className="job-detail__summary">
                <div><span>경력</span><strong>{job.experience || "경력 무관"}</strong></div>
                <div><span>고용형태</span><strong>{job.employmentType || "정보 없음"}</strong></div>
                <div><span>근무형태</span><strong>{job.workSchedule || "정보 없음"}</strong></div>
                <div>
                  <span>급여</span>
                  <strong>{job.salaryVisible === false ? "비공개" : job.salary || "협의"}</strong>
                </div>
              </section>

              <DetailSection title="주요 업무" content={job.duties} />
              <DetailSection title="지원 자격" content={job.requirements} />
              <DetailSection title="상세 내용" content={job.description} />

              {splitLines(job.recruitmentSteps).length > 0 && (
                <section className="job-detail__section">
                  <h2>채용 절차</h2>
                  <div className="recruit-process">
                    {splitLines(job.recruitmentSteps).map((step, index) => (
                      <div key={`${step}-${index}`}>
                        <span>{index + 1}</span>
                        <strong>{step}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="job-detail__section">
                <h2>기업 정보</h2>
                <p>{job.companyName || "기업 정보가 등록되지 않았습니다."}</p>
              </section>
            </article>

            <aside className="job-apply-card">
              <span>접수 마감</span>
              <strong>{job.isAlwaysOpen ? "상시채용" : job.deadlineDate || "마감일 미정"}</strong>
              <p>
                {job.jobStatus === "CLOSED"
                  ? "모집이 마감된 공고입니다."
                  : "지원 전 공고 내용과 자격 요건을 확인해주세요."}
              </p>
              <button
                type="button"
                className={`button button--outline ${favorite ? "is-favorite" : ""}`}
                onClick={() => {
                  if (!hasUser) navigate("/login");
                  else setFavorite((current) => !current);
                }}
              >
                <Icon name="heart" size={18} filled={favorite} />
                {favorite ? "관심 공고 선택됨" : "관심 공고"}
              </button>
              <button
                type="button"
                className="button button--primary"
                disabled={job.jobStatus === "CLOSED"}
                onClick={() => window.alert("온라인 지원 API는 아직 연결되지 않았습니다.")}
              >
                {job.jobStatus === "CLOSED" ? "모집마감" : "지원하기"}
                <Icon name="arrow" size={18} />
              </button>
              <small>관심 공고와 지원 내역은 실제 API 연결 후 저장됩니다.</small>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content?: string | null }) {
  const items = splitLines(content);
  return (
    <section className="job-detail__section">
      <h2>{title}</h2>
      {items.length > 0 ? (
        <ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
      ) : (
        <p className="job-detail__notice">등록된 내용이 없습니다.</p>
      )}
    </section>
  );
}