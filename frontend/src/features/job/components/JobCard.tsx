import { useNavigate } from "react-router-dom";
import Icon from "../../../components/common/icon";
import CompanyLogo from "../../Home/components/CompanyLogo";
import type { JobItem } from "../jobTypes";

export default function JobCard({ job }: { job: JobItem }) {
  const navigate = useNavigate();
  const closed = job.jobStatus === "CLOSED";
  const deadline = job.isAlwaysOpen ? "상시채용" : job.deadlineDate || "마감일 미정";
  const openDetail = () => navigate(`/jobs/detail/${job.jobId}`);

  return (
    <article
      className={`job-card ${closed ? "is-closed" : ""}`}
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
    >
      <div className="job-card__top">
        <CompanyLogo name={job.companyName || "기업 정보 없음"} imageUrl={job.companyLogo} />
        <span className={`job-status ${closed ? "is-closed" : ""}`}>{closed ? "모집마감" : "모집중"}</span>
      </div>
      <p className="job-card__company">{job.companyName || "기업 정보 없음"}</p>
      <h3>{job.title}</h3>
      <div className="job-card__tags">
        <span>{job.positionName}</span>
        {job.location && <span>{job.location}</span>}
        {job.vesselType && <span>{job.vesselType}</span>}
      </div>
      <div className="job-card__footer">
        <strong>{job.salaryVisible === false ? "급여 비공개" : job.salary || "급여 협의"}</strong>
        <span>{deadline}</span>
      </div>
      <span className="job-card__arrow"><Icon name="arrow" size={17} /></span>
    </article>
  );
}