# ⚓ SAILING

### 해운·선박 전문 구인구직 플랫폼

해운·선박 분야의 채용정보와 해운 관련 업체정보를 제공하고,
구직자와 기업 및 해운업체를 연결하는 웹 서비스입니다.

해운업 특성에 맞춰 직무, 선박, 항로, 근무형태 등의 정보를
구조화하여 제공하고 간편지원, 해운정보, 실시간 문의 채팅,
면접·CBT·AI 기능 등을 구현하는 것을 목표로 합니다.

---

## 📌 프로젝트 개요

- 프로젝트명 : SAILING
- 서비스 : 해운·선박 전문 구인구직 플랫폼
- 개발 형태 : 개인 프로젝트
- 개발 기간 : 2026.10 ~
- 현재 단계 : 요구사항 정의 및 초기 개발환경 구성

---

##  기술 스택
### Backend
- Java 25
- Spring Boot
- MyBatis
- Spring Security
- Spring WebSocket / STOMP

### Frontend
- React
- Vite

### Database
- MariaDB

### Development
- Docker Compose
- GitHub

### 예정
- Google / Kakao OAuth2
- AWS 배포

---

## 📂 프로젝트 구조
frontend/
├── public/
│   └── (공개 정적 파일)
│
├── src/
│   ├── app/
│   │   └── router.tsx                 ← 페이지 라우팅 설정
│   │
│   ├── assets/
│   │   ├── images/                    ← 이미지 파일
│   │   ├── icons/                     ← SVG 등 아이콘 파일
│   │   └── fonts/                     ← 폰트 파일
│   │
│   ├── components/
│   │   └── common/
│   │       ├── Header.tsx             ← 사이트 공통 상단
│   │       ├── Footer.tsx             ← 사이트 공통 하단
│   │       └── Icon.tsx               ← 공통 SVG 아이콘 컴포넌트
│   │
│   ├── features/
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── CompanyLogo.tsx    ← 회사 로고
│   │   │   │   ├── HeroSearch.tsx     ← 메인 검색 영역
│   │   │   │   ├── SearchDropdown.tsx ← 지역·직무 드롭다운
│   │   │   │   └── JobCard.tsx        ← 채용공고 카드
│   │   │   ├── Home.tsx               ← 메인 페이지
│   │   │   ├── homeApi.ts             ← 메인 페이지 데이터 요청
│   │   │   ├── homeAssets.ts          ← 메인 페이지 이미지 경로
│   │   │   ├── homeTypes.ts           ← 메인 페이지 데이터 타입
│   │   │   └── homeUtils.ts           ← 메인 페이지 계산 함수
│   │   │
│   │   ├── job/
│   │   │   ├── components/            ← 채용공고 전용 UI
│   │   │   ├── JobList.tsx            ← 채용공고 목록
│   │   │   ├── JobDetail.tsx          ← 채용공고 상세
│   │   │   ├── jobApi.ts              ← 채용공고 API
│   │   │   └── jobTypes.ts            ← 채용공고 데이터 타입
│   │   │
│   │   ├── company/
│   │   │   ├── components/            ← 회사 전용 UI
│   │   │   ├── CompanyList.tsx        ← 회사 목록
│   │   │   ├── CompanyDetail.tsx      ← 회사 상세
│   │   │   ├── companyApi.ts          ← 회사 API
│   │   │   └── companyTypes.ts        ← 회사 데이터 타입
│   │   │
│   │   ├── board/
│   │   │   ├── components/            ← 게시판 전용 UI
│   │   │   ├── BoardList.tsx          ← 게시글 목록
│   │   │   ├── BoardDetail.tsx        ← 게시글 상세
│   │   │   ├── BoardWrite.tsx         ← 게시글 작성
│   │   │   ├── boardApi.ts            ← 게시판 API
│   │   │   └── boardTypes.ts          ← 게시판 데이터 타입
│   │   │
│   │   ├── store/
│   │   │   ├── components/            ← 스토어 전용 UI
│   │   │   ├── StoreList.tsx          ← 상품 목록
│   │   │   ├── StoreDetail.tsx        ← 상품 상세
│   │   │   ├── storeApi.ts            ← 스토어 API
│   │   │   └── storeTypes.ts          ← 스토어 데이터 타입
│   │   │
│   │   └── user/
│   │       ├── components/            ← 회원 전용 UI
│   │       ├── Login.tsx              ← 로그인
│   │       ├── Signup.tsx             ← 회원가입
│   │       ├── userApi.ts             ← 회원 API
│   │       └── userTypes.ts           ← 회원 데이터 타입
│   │
│   ├── lib/
│   │   └── http.ts                    ← 공통 HTTP 요청 설정
│   │
│   ├── styles/                        ← 모든 CSS 파일 중앙 관리
│   │   ├── common.css                 ← 전역 CSS
│   │   ├── components/                ← 공통 컴포넌트 스타일
│   │   │   ├── Header.css
│   │   │   └── Footer.css
│   │   └── features/                  ← 도메인/기능별 스타일
│   │       ├── Home.css
│   │       ├── Job.css
│   │       ├── Company.css
│   │       ├── Board.css
│   │       ├── Store.css
│   │       └── User.css
│   │
│   ├── App.tsx                        ← 앱의 최상위 구성
│   ├── index.css                      ← 전역 CSS 연결
│   └── main.tsx                       ← React 진입점
│
├── .env                               ← 환경변수 (필요할 때 생성)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts