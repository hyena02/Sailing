import Icon from "../../../components/common/Icon";
import type { JobItem } from "../homeTypes";
import { dDay } from "../homeUtils";
import CompanyLogo from "./CompanyLogo";

interface JobCardProps {
  job: JobItem;
  favorite: boolean;
  onFavorite: (id: number) => void;
}

export default function JobCard({ job, favorite, onFavorite }: JobCardProps) {
  return (
    <article className="job-card">
      <div className="job-card__top">
        <CompanyLogo name={job.companyName} imageUrl={job.companyLogo} />
        <button
          className={`favorite-button ${favorite ? "is-active" : ""}`}
          onClick={() => onFavorite(job.jobPostId)}
          aria-label="관심 공고 저장"
        >
          <Icon name="heart" size={20} filled={favorite} />
        </button>
      </div>
      <p className="job-card__company">{job.companyName}</p>
      <h3>{job.title}</h3>
      <div className="job-card__tags">
        <span>{job.positionName}</span>
        <span>{job.workLocation}</span>
      </div>
      <div className="job-card__footer">
        <strong>{job.salary ?? "협의"}</strong>
        <span>{dDay(job)}</span>
      </div>
    </article>
  );
}