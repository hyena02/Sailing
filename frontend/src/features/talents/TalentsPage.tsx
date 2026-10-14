import { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import Icon from "../../components/common/icon";
import { getErrorMessage } from "../../lib/api";
import "../../styles/home.css";
import { getTalents, type TalentItem } from "./talentsApi";
import "./Talents.css";

export default function TalentsPage() {
  const [talents, setTalents] = useState<TalentItem[]>([]);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("전체 직무");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTalents()
      .then((rows) => {
        if (active) setTalents(Array.isArray(rows) ? rows : []);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "인재정보를 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const positions = [
    "전체 직무",
    ...new Set(talents.map((talent) => talent.positionName || "").filter(Boolean)),
  ];
  const filteredTalents = talents.filter((talent) => {
    const searchable = [
      talent.nickname,
      talent.name,
      talent.positionName,
      talent.introduction,
      talent.desiredLocation,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    const matchesQuery = searchable.includes(query.trim().toLocaleLowerCase());
    const matchesPosition = position === "전체 직무" || talent.positionName === position;
    return matchesQuery && matchesPosition;
  });

  return (
    <div className="subpage talents-page">
      <Header />
      <main>
        <section className="talents-hero">
          <div className="container">
            <span>SAILING TALENTS</span>
            <h1>바다에서 쌓은 경험,<br />새로운 기회로</h1>
            <p>해운·선박 업계에서 활동하는 인재 프로필을 확인하세요.</p>
          </div>
        </section>

        <section className="talents-board container">
          <div className="talents-heading">
            <div>
              <span>MARITIME TALENT POOL</span>
              <h2>인재정보</h2>
              <p>공개 설정된 인재정보만 조회할 수 있습니다.</p>
            </div>
            <strong>총 {filteredTalents.length}명</strong>
          </div>

          <div className="talent-filters">
            <label>
              <Icon name="search" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="직무, 소개, 희망 지역 검색"
              />
            </label>
            <div>
              {positions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={position === item ? "is-active" : ""}
                  onClick={() => setPosition(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="community-empty" role="status">인재정보를 불러오는 중입니다.</div>
          ) : error ? (
            <div className="community-empty" role="alert">
              <Icon name="bell" size={28} />
              <strong>인재정보 API에 연결할 수 없습니다.</strong>
              <p>{error}</p>
              <small>현재 백엔드에 인재 목록 조회 API가 구현되어 있는지 확인해주세요.</small>
            </div>
          ) : filteredTalents.length > 0 ? (
            <div className="talent-grid">
              {filteredTalents.map((talent) => (
                <article className="talent-card" key={talent.userInfoId}>
                  <div className="talent-card__top">
                    <span className="talent-avatar"><Icon name="user" size={24} /></span>
                    <span>{talent.nationality || "인재 프로필"}</span>
                  </div>
                  <h3>{talent.nickname || talent.name || "이름 비공개"}</h3>
                  <strong>{talent.positionName || "희망 직무 미등록"}</strong>
                  <p>{talent.introduction || "등록된 자기소개가 없습니다."}</p>
                  <div className="talent-meta">
                    {talent.experience && <span>{talent.experience}</span>}
                    {talent.desiredLocation && (
                      <span><Icon name="map" size={13} />{talent.desiredLocation}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="community-empty">
              <Icon name="search" size={28} />
              <strong>{talents.length > 0 ? "검색 결과가 없습니다." : "공개된 인재정보가 없습니다."}</strong>
              <p>
                {talents.length > 0
                  ? "검색 조건을 변경해보세요."
                  : "인재 프로필 공개 기능과 API가 연결되면 이곳에 표시됩니다."}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}