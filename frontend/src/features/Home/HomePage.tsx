import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import Icon, { type IconName } from "../../components/common/icon";
import "../../styles/home.css";
import CompanyLogo from "./components/CompanyLogo";
import HeroSearch from "./components/HeroSearch";
import HomeJobCard from "./components/HomeJobCard";
import { emptyHome, fetchHomeData } from "./homeApi";
import { dDay, timeAgo } from "./homeUtils";
import type { HomeData, JobItem } from "./homeTypes";

const ALL_REGION = "지역 전체";
const ALL_JOB = "직무 전체";
const REGIONS = [ALL_REGION, "부산", "인천", "울산", "여수", "목포"];
const COMMUNITY_TABS = ["전체", "승선후기", "질문답변", "정보공유"];

const CATEGORY_ICONS: Record<string, IconName> = {
  해기사: "compass",
  "기관·엔지니어": "anchor",
  "감독·검사": "search",
  "운항·관리": "map",
  "해운·항만": "ship",
  "용선·중개": "briefcase",
  "조선·수리": "building",
  "원양·수산": "anchor",
  "요트·보트": "compass",
  사무직: "user",
  "IT·개발": "pen",
  기타: "bell",
};

function hasSignedInUser(): boolean {
  return Boolean(sessionStorage.getItem("sailingUser"));
}

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeData>(emptyHome);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(ALL_REGION);
  const [jobType, setJobType] = useState(ALL_JOB);
  const [activeCategory, setActiveCategory] = useState("");
  const [postTab, setPostTab] = useState("전체");
  const [searched, setSearched] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"region" | "job" | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchHomeData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "홈 데이터를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const jobTypes = useMemo(
    () => [ALL_JOB, ...data.categories.map((category) => category.name)],
    [data.categories],
  );

  const allJobs = useMemo(() => {
    const uniqueJobs = new Map<number, JobItem>();
    [...data.urgentJobs, ...data.recentJobs].forEach((job) => uniqueJobs.set(job.jobPostId, job));
    return [...uniqueJobs.values()];
  }, [data.urgentJobs, data.recentJobs]);

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return allJobs.filter((job) => {
      const searchableText = `${job.companyName} ${job.title} ${job.positionName}`.toLocaleLowerCase();
      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesRegion = region === ALL_REGION || job.workLocation === region;
      const matchesRole = jobType === ALL_JOB || job.positionCategory === jobType;
      return matchesKeyword && matchesRegion && matchesRole;
    });
  }, [allJobs, query, region, jobType]);

  const visibleJobs = searched ? filteredJobs : data.urgentJobs;
  const visiblePosts = data.posts.filter((post) => postTab === "전체" || post.category === postTab);

  const stats = [
    { label: "진행중 채용", value: data.stats.activeJobs, unit: "건" },
    { label: "등록 기업", value: data.stats.companies, unit: "곳" },
    { label: "오늘의 신규공고", value: data.stats.todayJobs, unit: "건" },
    { label: "누적 회원", value: data.stats.members, unit: "명" },
  ];

  const runSearch = () => {
    setSearched(true);
    setOpenDropdown(null);
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetSearch = () => {
    setSearched(false);
    setQuery("");
    setRegion(ALL_REGION);
    setJobType(ALL_JOB);
    setActiveCategory("");
  };

  const handleFavorite = () => {
    if (!hasSignedInUser()) {
      navigate("/login");
      return;
    }
    window.alert("관심 공고 API가 연결되면 저장 기능을 사용할 수 있습니다.");
  };

  return (
    <div className="home">
      <Header />
      <main>
        <HeroSearch
          query={query}
          region={region}
          jobType={jobType}
          regions={REGIONS}
          jobTypes={jobTypes}
          keywords={[]}
          openDropdown={openDropdown}
          onQueryChange={setQuery}
          onRegionChange={setRegion}
          onJobTypeChange={setJobType}
          onDropdownChange={setOpenDropdown}
          onSearch={runSearch}
        />

        <section className="stats" aria-label="서비스 통계">
          <div className="container stats__grid">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value > 0 ? stat.value.toLocaleString() : "—"}<small>{stat.value > 0 ? stat.unit : ""}</small></strong>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="container" role="status">
            <div className="api-notice"><Icon name="bell" size={18} /><span>{error}</span></div>
          </div>
        )}

        <section id="jobs" className="jobs-section">
          <div className="container">
            <div className="section-title-row">
              <div>
                <span className="section-kicker"><Icon name="bell" size={18} />{searched ? "검색 결과" : "지금 바로 지원하세요"}</span>
                <h2 className="section-heading">
                  {searched ? <>조건에 맞는 공고 <em>{filteredJobs.length}건</em></> : "긴급 구인 공고"}
                </h2>
                <p>{searched ? "선택한 검색 조건을 반영한 결과입니다." : "채용 마감이 임박한 공고를 확인하세요."}</p>
              </div>
              {searched && <button className="text-button" type="button" onClick={resetSearch}>검색 초기화</button>}
            </div>

            {loading ? (
              <div className="empty-state" role="status">채용공고를 불러오는 중입니다.</div>
            ) : visibleJobs.length > 0 ? (
              <div className="job-card-grid">
                {visibleJobs.map((job) => (
                  <HomeJobCard key={job.jobPostId} job={job} favorite={false} onFavorite={handleFavorite} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <strong>{error ? "채용공고 데이터를 확인할 수 없습니다." : searched ? "조건에 맞는 채용공고가 없습니다." : "등록된 긴급 채용공고가 없습니다."}</strong>
                <p>{error ? "백엔드 홈 요약 API 연결 상태를 확인해주세요." : "공고 데이터가 등록되면 이곳에 표시됩니다."}</p>
              </div>
            )}
          </div>
        </section>

        <section className="category-section">
          <div className="container">
            <span className="section-kicker">나에게 맞는 포지션 찾기</span>
            <h2 className="section-heading">직무별 채용정보</h2>
            {data.categories.length > 0 ? (
              <div className="category-grid">
                {data.categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className={`category-card ${activeCategory === category.name ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveCategory(category.name);
                      setJobType(category.name);
                      setSearched(true);
                      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span><Icon name={CATEGORY_ICONS[category.name] ?? "briefcase"} size={22} /></span>
                    <strong>{category.name}</strong>
                    <small>채용 {category.count}건</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">직무별 통계는 실제 채용 데이터가 연결되면 표시됩니다.</div>
            )}

            <div className="recent-heading">
              <h2>최근 등록 채용</h2>
              <button type="button" onClick={() => navigate("/jobs")}>전체 공고 보기 <Icon name="chevron" size={16} /></button>
            </div>
            {data.recentJobs.length > 0 ? (
              <div className="recent-list">
                {data.recentJobs.map((job) => (
                  <article className="recent-job" key={job.jobPostId}>
                    <CompanyLogo name={job.companyName} imageUrl={job.companyLogo} compact />
                    <button className="recent-job__title" type="button" onClick={() => navigate(`/jobs/detail/${job.jobPostId}`)}>
                      <span>{job.companyName}</span>
                      <strong>{job.title}</strong>
                    </button>
                    <span className="recent-job__role">{job.positionName}</span>
                    <span className="recent-job__location"><Icon name="map" size={15} />{job.workLocation}</span>
                    <strong className="recent-job__deadline">{dDay(job)}</strong>
                    <button className="favorite-button" type="button" onClick={handleFavorite} aria-label="관심 공고 저장">
                      <Icon name="heart" size={19} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">최근 등록된 채용공고가 없습니다.</div>
            )}
          </div>
        </section>

        <section id="community" className="community-section">
          <div className="container community-layout">
            <div className="community-intro">
              <span>SAILING COMMUNITY</span>
              <h2>바다 사람들의<br />진짜 이야기를 나눠요</h2>
              <p>승선 후기부터 자격증, 면접, 선박 생활까지. 현직자와 예비 해운인이 경험을 나누는 공간입니다.</p>
              <button className="button button--primary" type="button" onClick={() => navigate("/community/write")}>
                <Icon name="pen" size={18} />글쓰기
              </button>
            </div>
            <div className="post-panel">
              <div className="post-tabs">
                {COMMUNITY_TABS.map((tab) => (
                  <button key={tab} type="button" className={postTab === tab ? "is-active" : ""} onClick={() => setPostTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
              {visiblePosts.length > 0 ? visiblePosts.map((post) => (
                <button className="post" type="button" key={post.boardId} onClick={() => navigate(`/community/${post.boardId}`)}>
                  <span>{post.category}</span>
                  {post.upCount >= 10 && <em>HOT</em>}
                  <h3>{post.title}</h3>
                  <p>
                    {post.nickname}<span>{timeAgo(post.createdAt)}</span><span>조회 {post.hit}</span>
                    <span><Icon name="comment" size={13} />{post.replyCount}</span>
                  </p>
                </button>
              )) : (
                <div className="empty-state post-empty">{error ? "커뮤니티 API 연결 후 게시글이 표시됩니다." : "등록된 게시글이 없습니다."}</div>
              )}
            </div>
          </div>
        </section>

        <section className="company-cta">
          <div className="container">
            <div><span>기업회원이라면</span><h2>필요한 해운 인재를 만나보세요</h2></div>
            <button className="button button--dark" type="button" onClick={() => navigate("/jobs/new")}>
              무료 구인등록 <Icon name="arrow" size={18} />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}