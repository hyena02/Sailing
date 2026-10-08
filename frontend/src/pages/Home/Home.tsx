import { useEffect, useMemo, useState } from "react";
import Icon, { type IconName } from "../../components/common/Icon";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "../../styles/Home.css";
import HeroSearch from "./components/HeroSearch";
import JobCard from "./components/JobCard";
import CompanyLogo from "./components/CompanyLogo";
import { emptyHome, fetchHomeData } from "./homeApi";
import { dDay, timeAgo } from "./homeUtils";
import type { HomeData } from "./homeTypes";

const ALL_REGION = "지역 전체";
const ALL_JOB = "직무 전체";
const REGIONS = [ALL_REGION, "부산", "인천", "울산", "여수", "목포"]; // 우선 고정 목록
const POPULAR_KEYWORDS = ["항해사", "LNG선", "기관사", "신입 선원"];
const POST_TABS = ["전체", "승선후기", "질문답변", "정보공유"];
const HOT_VOTE = 10; // 추천(UP) 수가 이 이상이면 HOT 표시

// 아이콘은 화면에서만 쓰는 값이라 DB에 두지 않고 카테고리 이름으로 연결
const CATEGORY_ICONS: Record<string, IconName> = {
  "해기사": "compass",
  "기관·엔지니어": "anchor",
  "감독·검사": "search",
  "운항·관리": "map",
  "해운·항만": "ship",
  "용선·중개": "briefcase",
  "조선·수리": "building",
  "원양·수산": "anchor",
  "요트·보트": "compass",
  "사무직": "user",
  "IT·개발": "pen",
  "기타": "bell",
};

export default function Home() {
  const [data, setData] = useState<HomeData>(emptyHome);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(ALL_REGION);
  const [jobType, setJobType] = useState(ALL_JOB);
  const [activeCategory, setActiveCategory] = useState("해기사");
  const [postTab, setPostTab] = useState("전체");
  const [searched, setSearched] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"region" | "job" | null>(null);

  // 화면이 처음 뜰 때 데이터를 한 번 가져옴
  useEffect(() => {
    let ignore = false; // 개발 모드(StrictMode)에서 effect가 두 번 돌아도 안전하게
    fetchHomeData()
      .then((result) => {
        if (ignore) return;
        console.log("[Home] data:", result); // 확인용: F12 → Console. 나중에 지우세요
        setData(result);
      })
      .catch(() => {
        if (!ignore) setError("데이터를 불러오지 못했습니다.");
      });
    return () => { ignore = true; };
  }, []);

  const jobTypes = [ALL_JOB, ...data.categories.map((category) => category.name)];

  // 긴급 + 최근 공고를 합치되, 같은 공고가 두 번 나오지 않게 중복 제거
  const allJobs = useMemo(
    () => Array.from(new Map([...data.urgentJobs, ...data.recentJobs].map((job) => [job.jobPostId, job])).values()),
    [data],
  );

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return allJobs.filter((job) => {
      const keywordMatch = !keyword
        || `${job.companyName} ${job.title} ${job.positionName}`.toLowerCase().includes(keyword);
      const regionMatch = region === ALL_REGION || job.workLocation === region;
      const jobMatch = jobType === ALL_JOB || job.positionCategory === jobType;
      return keywordMatch && regionMatch && jobMatch;
    });
  }, [allJobs, query, region, jobType]);

  const visibleJobs = searched ? filteredJobs : data.urgentJobs;
  const visiblePosts = data.posts.filter((post) => postTab === "전체" || post.category === postTab);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const search = () => {
    setSearched(true);
    setOpenDropdown(null);
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetSearch = () => {
    setSearched(false);
    setQuery("");
    setRegion(ALL_REGION);
    setJobType(ALL_JOB);
  };

  const stats = [
    { label: "진행중 채용", value: data.stats.activeJobs, unit: "건" },
    { label: "등록 기업", value: data.stats.companies, unit: "곳" },
    { label: "오늘의 신규공고", value: data.stats.todayJobs, unit: "건" },
    { label: "누적 회원", value: data.stats.members, unit: "명" },
  ];

  return (
    <div className="home">
      <Header />
      <main>
        <HeroSearch
          query={query} region={region} jobType={jobType}
          regions={REGIONS} jobTypes={jobTypes} keywords={POPULAR_KEYWORDS}
          openDropdown={openDropdown}
          onQueryChange={setQuery} onRegionChange={setRegion} onJobTypeChange={setJobType}
          onDropdownChange={setOpenDropdown} onSearch={search}
        />

        <section className="stats">
          <div className="container stats__grid">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value.toLocaleString()}<small>{stat.unit}</small></strong>
              </div>
            ))}
          </div>
        </section>

        <section id="jobs" className="jobs-section">
          <div className="container">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">
                  <Icon name="bell" size={18} />
                  {searched ? "검색 결과" : "지금 바로 지원하세요"}
                </span>
                <h2 className="section-heading">
                  {searched ? <>조건에 맞는 공고 <em>{filteredJobs.length}건</em></> : "긴급 구인 공고"}
                </h2>
                <p>{searched ? "선택한 검색 조건을 반영한 결과입니다." : "채용 마감이 임박한 공고를 놓치지 마세요."}</p>
              </div>
              {searched && <button className="text-button" onClick={resetSearch}>검색 초기화</button>}
            </div>

            <div className="job-card-grid">
              {visibleJobs.map((job) => (
                <JobCard key={job.jobPostId} job={job} favorite={favorites.includes(job.jobPostId)} onFavorite={toggleFavorite} />
              ))}
            </div>

            {error && <div className="empty-state"><strong>{error}</strong></div>}
            {!error && visibleJobs.length === 0 && (
              <div className="empty-state">
                <strong>{searched ? "조건에 맞는 채용 공고가 없습니다." : "현재 긴급 공고가 없습니다."}</strong>
                {searched && <p>검색 조건을 조금 넓혀보세요.</p>}
              </div>
            )}
          </div>
        </section>

        <section className="category-section">
          <div className="container">
            <span className="section-kicker">나에게 맞는 포지션 찾기</span>
            <h2 className="section-heading">직무별 채용정보</h2>
            <div className="category-grid">
              {data.categories.map((category) => (
                <button
                  key={category.name}
                  className={`category-card ${activeCategory === category.name ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <span><Icon name={CATEGORY_ICONS[category.name] ?? "briefcase"} size={22} /></span>
                  <strong>{category.name}</strong>
                  <small>채용 {category.count}건</small>
                </button>
              ))}
            </div>

            <div className="recent-heading">
              <h2>최근 등록 채용</h2>
              <button>더보기 <Icon name="chevron" size={16} /></button>
            </div>
            <div className="recent-list">
              {data.recentJobs.map((job) => (
                <article className="recent-job" key={job.jobPostId}>
                  <CompanyLogo name={job.companyName} imageUrl={job.companyLogo} compact />
                  <div className="recent-job__title">
                    <span>{job.companyName}</span>
                    <strong>{job.title}</strong>
                  </div>
                  <span className="recent-job__role">{job.positionName}</span>
                  <span className="recent-job__location"><Icon name="map" size={15} />{job.workLocation}</span>
                  <strong className="recent-job__deadline">{dDay(job)}</strong>
                  <button
                    className={`favorite-button ${favorites.includes(job.jobPostId) ? "is-active" : ""}`}
                    onClick={() => toggleFavorite(job.jobPostId)}
                    aria-label="관심 공고 저장"
                  >
                    <Icon name="heart" size={19} filled={favorites.includes(job.jobPostId)} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="community-section">
          <div className="container community-layout">
            <div className="community-intro">
              <span>SAILING COMMUNITY</span>
              <h2>바다 사람들의<br />진짜 이야기를 나눠요</h2>
              <p>승선 후기부터 자격증, 면접, 선박 생활까지. 현직자와 예비 해운인이 자유롭게 묻고 답합니다.</p>
              <button className="button button--primary"><Icon name="pen" size={18} />글쓰기</button>
            </div>
            <div className="post-panel">
              <div className="post-tabs">
                {POST_TABS.map((tab) => (
                  <button key={tab} className={postTab === tab ? "is-active" : ""} onClick={() => setPostTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
              {visiblePosts.map((post) => (
                <article className="post" key={post.boardId}>
                  <div>
                    <span>{post.category}</span>
                    {post.upCount >= HOT_VOTE && <em>HOT</em>}
                  </div>
                  <h3>{post.title}</h3>
                  <p>
                    {post.nickname}
                    <span>{timeAgo(post.createdAt)}</span>
                    <span>조회 {post.hit}</span>
                    <span><Icon name="comment" size={13} />{post.replyCount}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="company-cta">
          <div className="container">
            <div>
              <span>기업회원이라면</span>
              <h2>필요한 해운 인재를 지금 만나보세요</h2>
            </div>
            <button className="button button--dark">무료 구인등록 <Icon name="arrow" size={18} /></button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}