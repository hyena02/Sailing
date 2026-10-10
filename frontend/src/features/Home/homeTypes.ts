// 채용공고 카드 1개 = JOB_POST + JOB_RECRUITMENT(대표 1건) + COMPANY_USER 를 JOIN 한 결과
export interface JobItem {
  jobPostId: number;                        // JOB_POST.JOB_POST_ID
  companyName: string;                      // COMPANY_USER.COMPANY_NAME
  companyLogo: string | null;               // COMPANY_USER.LOGO_IMAGE
  title: string;                            // JOB_POST.TITLE
  recruitmentType: "ONGOING" | "DEADLINE";  // JOB_POST.RECRUITMENT_TYPE
  deadline: string | null;                  // JOB_POST.DEADLINE ("2026-10-20")
  positionCategory: string;                 // JOB_RECRUITMENT.POSITION_CATEGORY
  positionName: string;                     // JOB_RECRUITMENT.POSITION_NAME
  workLocation: string;                     // JOB_RECRUITMENT.WORK_LOCATION
  salary: string | null;                    // JOB_RECRUITMENT.SALARY
}

// 직무 카테고리별 공고 수 = JOB_RECRUITMENT 를 POSITION_CATEGORY 로 GROUP BY COUNT
export interface CategoryItem {
  name: string;
  count: number;
}

// 커뮤니티 글 = BOARD + USERS(닉네임) + REPLY 개수 + BOARD_VOTE(UP) 개수
export interface PostItem {
  boardId: number;      // BOARD.BOARD_ID
  category: string;     // BOARD.CATEGORY
  title: string;        // BOARD.TITLE
  nickname: string;     // USERS.NICKNAME (실명 NAME 아님!)
  createdAt: string;    // BOARD.CREATED_AT
  hit: number;          // BOARD.HIT
  replyCount: number;   // COUNT(REPLY)
  upCount: number;      // COUNT(BOARD_VOTE where VOTE_TYPE = 'UP')
}

// 상단 통계 = 각각 COUNT 쿼리
export interface HomeStats {
  activeJobs: number;
  companies: number;
  todayJobs: number;
  members: number;
}

export interface HomeData {
  stats: HomeStats;
  urgentJobs: JobItem[];   // DEADLINE 임박순
  recentJobs: JobItem[];   // CREATED_AT 최신순
  categories: CategoryItem[];
  posts: PostItem[];
}