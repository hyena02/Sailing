import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/common/icon";
import HomeHeader from "../Home/components/HomeHeader";
import { communityPosts } from "../Community/communityData";
import { jobsWithMeta } from "../Jobs/jobsData";
import "../Home/Home.css";
import "./Admin.css";

type AdminMenu = "jobs" | "community" | "personal" | "company" | "vendor";
type ChatRoom = { name: string; partner: string; lastMessage: string; date: string };

const menus: Array<{ id: AdminMenu; label: string; icon: "briefcase" | "comment" | "user" | "building" }> = [
  { id: "jobs", label: "채용정보 관리", icon: "briefcase" },
  { id: "community", label: "커뮤니티 관리", icon: "comment" },
  { id: "personal", label: "일반유저 관리", icon: "user" },
  { id: "company", label: "기업유저 관리", icon: "building" },
  { id: "vendor", label: "업체유저 관리", icon: "ship" as "building" },
];

const personalUsers = [
  { id: 1, name: "김도윤", nickname: "푸른항로", phone: "010-2534-7812", email: "doyun@example.com", birth: "1994.03.18", posts: ["첫 승선 6개월 후기", "면접 준비 질문드립니다"], chats: [{ name: "부산 오션서플라이", partner: "김도윤", lastMessage: "부산항 입항 일정 전달드립니다.", date: "오늘 10:32" }] },
  { id: 2, name: "이서준", nickname: "기관실막내", phone: "010-4388-1120", email: "seojun@example.com", birth: "1999.11.02", posts: ["3등 기관사 면접 질문"], chats: [{ name: "싱가포르 K-Marine", partner: "이서준", lastMessage: "견적서 확인했습니다.", date: "어제" }] },
  { id: 3, name: "박준영", nickname: "해양엔지니어", phone: "010-7621-3290", email: "junyoung@example.com", birth: "1985.07.21", posts: ["선박 수리 감독 업무 공유"], chats: [] },
  { id: 4, name: "최영수", nickname: "베테랑기관장", phone: "010-9120-4522", email: "youngsoo@example.com", birth: "1972.01.09", posts: [], chats: [{ name: "요코하마 블루마린", partner: "최영수", lastMessage: "부품 재고 확인 부탁드립니다.", date: "5월 28일" }] },
];

const companies = [
  { id: 1, name: "대한해운 주식회사", manager: "김민수", phone: "051-620-2400", email: "hr@daehanshipping.co.kr", business: "123-45-67890", status: "승인됨", document: "사업자등록증_대한해운.pdf", favorites: 382, jobs: ["LNG선 1등 기관사 긴급 모집", "신입 해상직원 공개채용"], applicants: ["김도윤 · 2등 항해사", "이서준 · 3등 기관사", "최영수 · 기관장"] },
  { id: 2, name: "오션브릿지", manager: "박서연", phone: "032-450-1120", email: "recruit@oceanbridge.co.kr", business: "234-56-78901", status: "검토중", document: "사업자등록증명원.pdf", favorites: 216, jobs: ["컨테이너선 갑판부 선원 모집"], applicants: ["Nguyen Minh · 갑판부"] },
  { id: 3, name: "블루마린", manager: "이준호", phone: "051-332-9900", email: "jobs@bluemarine.co.kr", business: "345-67-89012", status: "미제출", document: "-", favorites: 97, jobs: ["외항 상선 조리장 경력직 채용"], applicants: [] },
];

const vendors = [
  { id: 1, name: "부산 오션서플라이", manager: "이도현", phone: "+82 51-234-5678", email: "contact@oceansupply.co.kr", business: "234-56-78901", status: "승인됨", document: "사업자등록증.pdf", views: 1284, chats: [{ name: "김도윤", partner: "부산 오션서플라이", lastMessage: "부산항 입항 일정 전달드립니다.", date: "오늘 10:32" }, { name: "최영수", partner: "부산 오션서플라이", lastMessage: "선식 목록을 보내주세요.", date: "어제" }] },
  { id: 2, name: "싱가포르 K-Marine", manager: "Daniel Kim", phone: "+65 6123 4567", email: "sales@kmarine.sg", business: "SG-2025-1142", status: "검토중", document: "Business_Profile.pdf", views: 936, chats: [{ name: "이서준", partner: "K-Marine", lastMessage: "견적서 확인했습니다.", date: "어제" }] },
  { id: 3, name: "LA 한인선식센터", manager: "Alex Park", phone: "+1 310 234 5678", email: "hello@kprovision.us", business: "미등록", status: "미제출", document: "-", views: 689, chats: [] },
];

export default function AdminDashboard() {
  const [menu, setMenu] = useState<AdminMenu>("jobs");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hiddenPosts, setHiddenPosts] = useState<number[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<number[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const currentLabel = menus.find((item) => item.id === menu)?.label;
  const toggle = (key: string) => setExpanded((current) => current === key ? null : key);

  return (
    <div className="subpage admin-page">
      <HomeHeader />
      <main className="admin-main">
        <section className="admin-banner"><div className="container"><span>SAILING ADMIN</span><h1>관리자 마이페이지</h1><p>회원과 콘텐츠, 채용정보 운영 현황을 관리합니다.</p></div></section>
        <div className="container admin-layout">
          <aside className="admin-sidebar">
            <div><span><Icon name="user" size={24} /></span><strong>SAILING 관리자</strong><small>최고 관리자</small></div>
            <nav>{menus.map((item) => <button key={item.id} className={menu === item.id ? "is-active" : ""} onClick={() => { setMenu(item.id); setExpanded(null); }}><Icon name={item.icon} size={18} />{item.label}<Icon name="chevron" size={14} /></button>)}</nav>
          </aside>
          <section className="admin-content">
            <header><div><span>ADMINISTRATION</span><h2>{currentLabel}</h2></div><strong>최근 업데이트 · 방금 전</strong></header>
            {menu === "jobs" && <JobManagement expanded={expanded} toggle={toggle} />}
            {menu === "community" && <CommunityManagement hidden={hiddenPosts} deleted={deletedPosts} onHide={(id) => setHiddenPosts((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} onDelete={(id) => setDeletedPosts((current) => [...current, id])} />}
            {menu === "personal" && <PersonalManagement expanded={expanded} toggle={toggle} onChats={setChatRooms} />}
            {menu === "company" && <CompanyManagement expanded={expanded} toggle={toggle} />}
            {menu === "vendor" && <VendorManagement expanded={expanded} toggle={toggle} onChats={setChatRooms} />}
          </section>
        </div>
      </main>
      {chatRooms && <ChatListModal rooms={chatRooms} onClose={() => setChatRooms(null)} />}
    </div>
  );
}

function JobManagement({ expanded, toggle }: { expanded: string | null; toggle: (key: string) => void }) {
  const [query, setQuery] = useState("");
  const grouped = jobsWithMeta.filter((job) => job.status !== "모집마감").reduce<Record<string, typeof jobsWithMeta>>((result, job) => {
    (result[job.company] ||= []).push(job);
    return result;
  }, {});
  const visible = Object.entries(grouped).filter(([company, jobs]) => `${company} ${jobs.map((job) => job.title).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <><label className="admin-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="회사명 또는 채용공고 검색" /><span>{visible.length}개 기업</span></label><div className="admin-accordion">{visible.map(([company, jobs]) => <div className="admin-group" key={company}><button onClick={() => toggle(`job-${company}`)}><span className="admin-company-icon"><Icon name="building" size={20} /></span><div><strong>{company} <em>({jobs.length})</em></strong><small>현재 모집 중인 채용공고</small></div><Icon name="chevron" size={18} /></button>{expanded === `job-${company}` && <div className="admin-sublist">{jobs.map((job) => <div key={job.id}><span>{job.role}</span><strong>{job.title}</strong><small>{job.location} · {job.deadline}</small><button>공고 보기</button></div>)}</div>}</div>)}</div></>;
}

function CommunityManagement({ hidden, deleted, onHide, onDelete }: { hidden: number[]; deleted: number[]; onHide: (id: number) => void; onDelete: (id: number) => void }) {
  const navigate = useNavigate();
  const [reportPost, setReportPost] = useState<number | null>(null);
  return <><div className="community-admin-list"><div className="community-admin-head"><span>분류</span><span>게시글 제목</span><span>작성자</span><span>신고</span><span>반응·조회</span><span>관리</span></div>{communityPosts.map((post) => {
    const reports = post.id % 3 === 0 ? 5 : post.id % 4;
    return <div className={deleted.includes(post.id) ? "is-deleted" : hidden.includes(post.id) ? "is-hidden" : ""} key={post.id}><span className="admin-category">{post.category}</span><button className="admin-post-title" onClick={() => navigate(`/community/${post.id}`)}>{post.title}</button><span className="admin-post-author">{post.author}</span><button disabled={reports === 0} className={`report-count ${reports ? "has-report" : ""}`} onClick={() => setReportPost(post.id)}>{reports}</button><div className="admin-post-stats"><span>댓글 {post.comments}</span><span>추천 {post.likes}</span><span>비추천 {post.dislikes}</span><span>조회 {post.views}</span></div><div className="admin-actions"><button onClick={() => onHide(post.id)}>{hidden.includes(post.id) ? "공개" : "숨김"}</button><button onClick={() => onDelete(post.id)}>{deleted.includes(post.id) ? "삭제됨" : "삭제"}</button></div></div>;
  })}</div>{reportPost && <ReportHistoryModal postId={reportPost} onClose={() => setReportPost(null)} />}</>;
}

function PersonalManagement({ expanded, toggle, onChats }: { expanded: string | null; toggle: (key: string) => void; onChats: (rooms: ChatRoom[]) => void }) {
  return <div className="admin-accordion">{personalUsers.map((user) => <div className="admin-group" key={user.id}><button onClick={() => toggle(`user-${user.id}`)}><span className="admin-user-avatar">{user.name.slice(0, 1)}</span><div><strong>{user.name} <em>@{user.nickname}</em></strong><small>{user.phone} · {user.email} · {user.birth}</small></div><Icon name="chevron" size={18} /></button>{expanded === `user-${user.id}` && <div className="user-detail-panel"><SectionList title="작성 글 목록" items={user.posts} empty="작성한 글이 없습니다." /><button className="chat-list-button" onClick={() => onChats(user.chats)}><Icon name="comment" size={17} />채팅방 목록 <strong>{user.chats.length}</strong></button></div>}</div>)}</div>;
}

function CompanyManagement({ expanded, toggle }: { expanded: string | null; toggle: (key: string) => void }) {
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [document, setDocument] = useState<{ name: string; file: string } | null>(null);
  return <><div className="admin-accordion">{companies.map((company) => { const status = statuses[company.id] || company.status; return <div className="admin-group" key={company.id}><button onClick={() => toggle(`company-${company.id}`)}><span className="admin-company-icon"><Icon name="building" size={20} /></span><div><strong>{company.name}</strong><small>{company.manager} · {company.phone} · {company.email}</small></div><StatusBadge status={status} /><Icon name="chevron" size={18} /></button>{expanded === `company-${company.id}` && <div className="company-detail-panel"><div className="admin-info-grid"><Info label="사업자등록번호" value={company.business} /><div><span>제출 서류</span><button className="document-view" disabled={company.document === "-"} onClick={() => setDocument({ name: company.name, file: company.document })}>{company.document === "-" ? "미제출" : "서류 확인"}</button></div><Info label="관심기업 수" value={`${company.favorites}명`} /><label className="status-select"><span>인증 상태 변경</span><select value={status} onChange={(event) => setStatuses({ ...statuses, [company.id]: event.target.value })}>{["승인됨", "검토중", "미제출", "반려", "서류 요청"].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="company-lists"><SectionList title="작성한 구인공고" items={company.jobs} /><SectionList title="받은 지원자" items={company.applicants} empty="아직 지원자가 없습니다." /></div></div>}</div>; })}</div>{document && <DocumentViewer data={document} onClose={() => setDocument(null)} />}</>;
}

function VendorManagement({ expanded, toggle, onChats }: { expanded: string | null; toggle: (key: string) => void; onChats: (rooms: ChatRoom[]) => void }) {
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [document, setDocument] = useState<{ name: string; file: string } | null>(null);
  return <><div className="admin-accordion">{vendors.map((vendor) => { const status = statuses[vendor.id] || vendor.status; return <div className="admin-group" key={vendor.id}><button onClick={() => toggle(`vendor-${vendor.id}`)}><span className="admin-company-icon"><Icon name="ship" size={20} /></span><div><strong>{vendor.name}</strong><small>{vendor.manager} · {vendor.phone} · 조회 {vendor.views.toLocaleString()}</small></div><StatusBadge status={status} /><Icon name="chevron" size={18} /></button>{expanded === `vendor-${vendor.id}` && <div className="company-detail-panel"><div className="admin-info-grid"><Info label="사업자등록번호" value={vendor.business} /><div><span>제출 서류</span><button className="document-view" disabled={vendor.document === "-"} onClick={() => setDocument({ name: vendor.name, file: vendor.document })}>{vendor.document === "-" ? "미제출" : "서류 확인"}</button></div><Info label="이메일" value={vendor.email} /><label className="status-select"><span>인증 상태 변경</span><select value={status} onChange={(event) => setStatuses({ ...statuses, [vendor.id]: event.target.value })}>{["승인됨", "검토중", "미제출", "반려", "서류 요청"].map((item) => <option key={item}>{item}</option>)}</select></label></div><button className="chat-list-button" onClick={() => onChats(vendor.chats)}><Icon name="comment" size={17} />업체 채팅방 목록 <strong>{vendor.chats.length}</strong></button></div>}</div>; })}</div>{document && <DocumentViewer data={document} onClose={() => setDocument(null)} />}</>;
}

function ReportHistoryModal({ postId, onClose }: { postId: number; onClose: () => void }) {
  const reasons = ["비방/욕설", "광고/도배", "기타"];
  return <div className="admin-modal-backdrop" onMouseDown={onClose}><div className="admin-chat-modal report-history" onMouseDown={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={onClose}><Icon name="x" size={20} /></button><span><Icon name="flag" size={22} /></span><h2>신고 내역</h2><p>게시글 #{postId}에 접수된 신고입니다.</p><div>{reasons.slice(0, postId % 3 === 0 ? 3 : 1).map((reason, index) => <section key={reason}><strong>{reason}</strong><p>신고자 user_{120 + index} · 2025.05.{28 - index}</p><span>운영 정책 위반 여부를 확인해주세요.</span></section>)}</div><button className="button button--dark" onClick={onClose}>확인</button></div></div>;
}

function DocumentViewer({ data, onClose }: { data: { name: string; file: string }; onClose: () => void }) {
  return <div className="admin-modal-backdrop" onMouseDown={onClose}><div className="document-modal" onMouseDown={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={onClose}><Icon name="x" size={20} /></button><span><Icon name="briefcase" size={25} /></span><h2>{data.name} 제출 서류</h2><p>{data.file}</p><div className="document-preview"><Icon name="building" size={48} /><strong>사업자등록증</strong><small>문서 미리보기 영역</small></div><div><button className="button button--outline">원본 다운로드</button><button className="button button--dark" onClick={onClose}>확인</button></div></div></div>;
}

function ChatListModal({ rooms, onClose }: { rooms: ChatRoom[]; onClose: () => void }) {
  return <div className="admin-modal-backdrop" onMouseDown={onClose}><div className="admin-chat-modal" onMouseDown={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={onClose}><Icon name="x" size={20} /></button><span><Icon name="comment" size={22} /></span><h2>채팅방 목록</h2><p>회원이 참여 중인 업체 채팅방입니다.</p><div>{rooms.length ? rooms.map((room, index) => <button key={`${room.name}-${index}`}><span className="admin-user-avatar">{room.name.slice(0, 1)}</span><div><strong>{room.name}</strong><p>{room.lastMessage}</p></div><small>{room.date}</small><Icon name="chevron" size={16} /></button>) : <div className="admin-empty">참여 중인 채팅방이 없습니다.</div>}</div><button className="button button--dark" onClick={onClose}>확인</button></div></div>;
}

function StatusBadge({ status }: { status: string }) { return <span className={`admin-status admin-status--${status === "승인됨" ? "approved" : status === "검토중" ? "review" : "empty"}`}>{status}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function SectionList({ title, items, empty = "등록된 항목이 없습니다." }: { title: string; items: string[]; empty?: string }) { return <section className="admin-section-list"><h3>{title} <span>{items.length}</span></h3>{items.length ? items.map((item) => <div key={item}><Icon name="chevron" size={14} />{item}</div>) : <p>{empty}</p>}</section>; }