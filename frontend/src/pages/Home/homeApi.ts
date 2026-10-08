import type { HomeData } from "./homeTypes";

// 오늘 기준으로 날짜를 만들어서 D-day 가 항상 자연스럽게 보이도록 함
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("sv-SE"); // "2026-10-08" 형식
};
const hoursAgo = (n: number) => new Date(Date.now() - n * 3600 * 1000).toISOString();

export const emptyHome: HomeData = {
  stats: { activeJobs: 0, companies: 0, todayJobs: 0, members: 0 },
  urgentJobs: [],
  recentJobs: [],
  categories: [],
  posts: [],
};

const mock: HomeData = {
  stats: { activeJobs: 483, companies: 1204, todayJobs: 32, members: 28451 },
  urgentJobs: [
    { jobPostId: 1, companyName: "대한해운", companyLogo: null, title: "LNG선 1등 기관사 긴급 모집",
      recruitmentType: "DEADLINE", deadline: daysFromNow(2), positionCategory: "기관·엔지니어",
      positionName: "1등 기관사", workLocation: "부산", salary: "월 850만원~" },
    { jobPostId: 2, companyName: "오션브릿지", companyLogo: null, title: "컨테이너선 갑판부 선원 모집",
      recruitmentType: "DEADLINE", deadline: daysFromNow(0), positionCategory: "해기사",
      positionName: "3등 항해사", workLocation: "인천", salary: "월 520만원~" },
    { jobPostId: 3, companyName: "블루마린", companyLogo: null, title: "외항 상선 조리장 경력직 채용",
      recruitmentType: "DEADLINE", deadline: daysFromNow(4), positionCategory: "기타",
      positionName: "조리장", workLocation: "울산", salary: "협의 후 결정" },
  ],
  recentJobs: [
    { jobPostId: 4, companyName: "에이치라인해운", companyLogo: null, title: "해상직원 상시채용",
      recruitmentType: "ONGOING", deadline: null, positionCategory: "해기사",
      positionName: "항해사", workLocation: "부산", salary: "회사 내규" },
    { jobPostId: 5, companyName: "팬오션", companyLogo: null, title: "벌크선 경력 해기사 모집",
      recruitmentType: "DEADLINE", deadline: daysFromNow(8), positionCategory: "해기사",
      positionName: "2등 항해사", workLocation: "여수", salary: "회사 내규" },
    { jobPostId: 6, companyName: "KSS해운", companyLogo: null, title: "LPG선 기관부 해상직원 채용",
      recruitmentType: "DEADLINE", deadline: daysFromNow(15), positionCategory: "기관·엔지니어",
      positionName: "기관사", workLocation: "부산", salary: "회사 내규" },
    { jobPostId: 7, companyName: "씨월드고속훼리", companyLogo: null, title: "여객선 서비스 승무원 모집",
      recruitmentType: "DEADLINE", deadline: daysFromNow(6), positionCategory: "운항·관리",
      positionName: "승무원", workLocation: "목포", salary: "회사 내규" },
  ],
  categories: [
    { name: "해기사", count: 128 },
    { name: "기관·엔지니어", count: 96 },
    { name: "감독·검사", count: 24 },
    { name: "운항·관리", count: 57 },
    { name: "해운·항만", count: 41 },
    { name: "용선·중개", count: 18 },
    { name: "조선·수리", count: 33 },
    { name: "원양·수산", count: 29 },
    { name: "요트·보트", count: 12 },
    { name: "사무직", count: 85 },
    { name: "IT·개발", count: 21 },
    { name: "기타", count: 38 },
  ],
  posts: [
    { boardId: 1, category: "승선후기", title: "첫 LNG선 승선, 3개월 차 솔직 후기입니다", nickname: "바다사람",
      createdAt: hoursAgo(2), hit: 428, replyCount: 18, upCount: 14 },
    { boardId: 2, category: "질문답변", title: "3급 기관사 면접 준비는 어떻게 해야 할까요?", nickname: "기관사준비생",
      createdAt: hoursAgo(4), hit: 186, replyCount: 12, upCount: 5 },
    { boardId: 3, category: "정보공유", title: "2026년도 해기사 시험 일정 한눈에 정리", nickname: "세일링지기",
      createdAt: hoursAgo(30), hit: 962, replyCount: 31, upCount: 23 },
  ],
};

export async function fetchHomeData(): Promise<HomeData> {
  // 백엔드(Spring Boot + MyBatis)가 준비되면 아래 3줄의 주석을 풀고 `return mock;` 을 지우세요.
  // const res = await fetch("/api/home");
  // if (!res.ok) throw new Error("홈 데이터를 불러오지 못했습니다.");
  // return res.json();
  return mock;
}