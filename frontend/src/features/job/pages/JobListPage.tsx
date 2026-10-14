import { useEffect, useMemo, useState } from "react";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import JobCard from "../components/JobCard";
import { getJobs } from "../jobApi";
import type { JobItem } from "../jobTypes";
import "../Jobs.css";

const roles = ["전체 직무", "항해사", "기관사", "갑판부", "조리부", "승무원", "육상직"];
const statuses = ["전체 상태", "모집중", "모집마감"] as const;
type StatusFilter = (typeof statuses)[number];

export default function JobListPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [status, setStatus] = useState<StatusFilter>(statuses[0]);
  const [excludeClosed, setExcludeClosed] = useState(false);
  const [salaryOnly, setSalaryOnly] = useState(false);
  const [sort, setSort] = useState("최신 등록순");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getJobs()
      .then((rows) => {
        if (active) setJobs(Array.isArray(rows) ? rows : []);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "채용공고를 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    const result = jobs.filter((job) => {
      const searchable = [
        job.companyName,
        job.title,
        job.positionName,
        job.location,
        job.vesselType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const matchesQuery = !keyword || searchable.includes(keyword);
      const matchesRole = role === "전체 직무" || job.positionName.includes(role);
      const matchesStatus = status === "전체 상태"
        || (status === "모집마감" ? job.jobStatus === "CLOSED" : job.jobStatus !== "CLOSED");
      const matchesClosed = !excludeClosed || job.jobStatus !== "CLOSED";
      const matchesSalary = !salaryOnly || (job.salaryVisible !== false && Boolean(job.salary));

      return matchesQuery && matchesRole && matchesStatus && matchesClosed && matchesSalary;
    });

    if (sort === "마감일 순") {
      result.sort((a, b) => (a.deadlineDate || "9999-12-31").localeCompare(b.deadlineDate || "9999-12-31"));
    } else if (sort === "급여 높은순") {
      result.sort((a, b) => {
        const salaryA = Number((a.salary || "").replace(/\D/g, "")) || 0;
        const salaryB = Number((b.salary || "").replace(/\D/g, "")) || 0;
        return salaryB - salaryA;
      });
    } else {
      result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }

    return result;
  }, [jobs, query, role, status, excludeClosed, salaryOnly, sort]);

  return (
    <div className="subpage jobs-page">
      <Header />
      <main>
        <section className="jobs-hero">
          <div className="container">
            <span>SAILING JOBS</span>
            <h1>바다에서 시작하는<br />새로운 커리어</h1>
            <p>해운·선박 전문 채용공고를 조건에 맞게 찾아보세요.</p>
          </div>
        </section>

        <section className="jobs-board container">
          <div className="jobs-board__heading">
            <div>
              <span>OPEN POSITIONS</span>
              <h2>채용공고</h2>
              <p>실제 등록된 채용정보를 확인할 수 있습니다.</p>
            </div>
            <strong>총 {filteredJobs.length}건</strong>
          </div>

          <div className="jobs-filter">
            <label>
              <Icon name="search" size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="기업명, 공고명, 직무, 지역으로 검색"
              />
            </label>
            <div className="jobs-filter__roles">
              {roles.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={role === item ? "is-active" : ""}
                  onClick={() => setRole(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="jobs-filter__options">
              <div className="status-filter">
                {statuses.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={status === item ? "is-active" : ""}
                    onClick={() => setStatus(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="jobs-filter__toggles">
                <button
                  type="button"
                  className={excludeClosed ? "is-selected" : ""}
                  onClick={() => setExcludeClosed((current) => !current)}
                >
                  <span />모집마감 제외
                </button>
                <button
                  type="button"
                  className={salaryOnly ? "is-selected" : ""}
                  onClick={() => setSalaryOnly((current) => !current)}
                >
                  <span />급여 공개 공고만
                </button>
                <label>
                  정렬
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option>최신 등록순</option>
                    <option>마감일 순</option>
                    <option>급여 높은순</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="jobs-empty" role="status">채용공고를 불러오는 중입니다.</div>
          ) : error ? (
            <div className="jobs-empty" role="alert">
              <Icon name="bell" size={28} />
              <strong>채용공고 API에 연결할 수 없습니다.</strong>
              <p>{error}</p>
              <small>현재 백엔드에 목록 조회 API가 구현되어 있는지 확인해주세요.</small>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="job-card-grid jobs-board__grid">
              {filteredJobs.map((job) => <JobCard key={job.jobId} job={job} />)}
            </div>
          ) : (
            <div className="jobs-empty">
              <Icon name="search" size={28} />
              <strong>{jobs.length > 0 ? "조건에 맞는 채용공고가 없습니다." : "등록된 채용공고가 없습니다."}</strong>
              <p>
                {jobs.length > 0
                  ? "검색 조건을 변경해 다시 확인해주세요."
                  : "채용공고가 등록되면 이곳에 표시됩니다."}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}