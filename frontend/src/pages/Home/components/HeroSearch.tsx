import Icon from "../../../components/common/Icon";
import { HOME_ASSETS } from "../homeAssets";
import SearchDropdown from "./SearchDropdown";

interface HeroSearchProps {
  query: string;
  region: string;
  jobType: string;
  regions: string[];
  jobTypes: string[];
  keywords: string[];
  openDropdown: "region" | "job" | null;
  onQueryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
  onDropdownChange: (value: "region" | "job" | null) => void;
  onSearch: () => void;
}

export default function HeroSearch(props: HeroSearchProps) {
  return (
    <section className="hero">
      <img className="hero__image" src={HOME_ASSETS.hero} alt="푸른 바다 위를 항해하는 선박" />
      <div className="hero__overlay" />
      <div className="container hero__content">
        <span className="hero__eyebrow"><i /> 바다에서 시작하는 새로운 커리어</span>
        <h1>대한민국 해운 인재와<br /><em>좋은 일자리</em>를 잇습니다</h1>
        <p>선원부터 해기사, 육상직까지. 검증된 해운·선박 채용정보를<br />세일링에서 가장 빠르게 만나보세요.</p>
        <div className="search-panel">
          <label className="search-panel__keyword">
            <Icon name="search" size={22} />
            <input
              value={props.query}
              onChange={(event) => props.onQueryChange(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && props.onSearch()}
              placeholder="직무, 회사명, 선박 종류 검색"
            />
          </label>
          <SearchDropdown
            icon="map"
            value={props.region}
            options={props.regions}
            open={props.openDropdown === "region"}
            onToggle={() => props.onDropdownChange(props.openDropdown === "region" ? null : "region")}
            onChange={(value) => { props.onRegionChange(value); props.onDropdownChange(null); }}
          />
          <SearchDropdown
            icon="briefcase"
            value={props.jobType}
            options={props.jobTypes}
            open={props.openDropdown === "job"}
            onToggle={() => props.onDropdownChange(props.openDropdown === "job" ? null : "job")}
            onChange={(value) => { props.onJobTypeChange(value); props.onDropdownChange(null); }}
          />
          <button className="search-panel__submit" onClick={props.onSearch}>검색하기</button>
        </div>
        <div className="popular-search">
          <strong>인기 검색어</strong>
          <div>
            {props.keywords.map((keyword) => (
              <button key={keyword} onClick={() => props.onQueryChange(keyword)}>#{keyword}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}