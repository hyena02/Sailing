import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import { getCompanies } from "../companyApi";
import type { CompanyItem } from "../companyTypes";
import "../Companies.css";

export default function CompanyListPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCompanies()
      .then((data) => {
        if (active) setCompanies(Array.isArray(data) ? data : []);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "기업정보를 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const searchable = [company.companyName, company.address, company.introduction]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return searchable.includes(query.trim().toLocaleLowerCase());
  });

  return (
    <div className="subpage companies-page">
      <Header />
      <main>
        <section className="companies-hero">
          <div className="container">
            <span>SAILING COMPANIES</span>
            <h1>해운 산업의 기업을<br />한곳에서 만나보세요</h1>
            <p>기업 정보를 확인하고 해당 기업의 채용 기회를 찾아보세요.</p>
          </div>
        </section>

        <section className="companies-board container">
          <div className="companies-heading">
            <div>
              <span>COMPANY DIRECTORY</span>
              <h2>기업정보</h2>
              <p>플랫폼에 등록된 기업 정보를 제공합니다.</p>
            </div>
            <strong>총 {filteredCompanies.length}곳</strong>
          </div>

          <label className="companies-search">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="기업명, 주소로 검색"
            />
          </label>

          {loading ? (
            <div className="company-state" role="status">기업정보를 불러오는 중입니다.</div>
          ) : error ? (
            <div className="company-state" role="alert">
              <strong>기업정보 API에 연결할 수 없습니다.</strong>
              <p>{error}</p>
              <small>현재 백엔드에는 기업회원 가입 API만 있고 기업 목록 조회 API는 확인되지 않았습니다.</small>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="companies-grid">
              {filteredCompanies.map((company) => (
                <article
                  className="company-card"
                  role="link"
                  tabIndex={0}
                  key={company.companyInfoId}
                  onClick={() => navigate(`/companies/${company.companyInfoId}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/companies/${company.companyInfoId}`);
                    }
                  }}
                >
                  <span className="company-card__icon"><Icon name="building" size={26} /></span>
                  <span className="company-card__status">
                    {company.verificationStatus === "APPROVED"
                      ? "인증 완료"
                      : company.verificationStatus === "PENDING"
                        ? "인증 심사 중"
                        : "기업정보"}
                  </span>
                  <h3>{company.companyName}</h3>
                  <p>{company.introduction || company.address || "등록된 기업 소개가 없습니다."}</p>
                  <span className="company-card__link">기업 정보 보기 <Icon name="arrow" size={15} /></span>
                </article>
              ))}
            </div>
          ) : (
            <div className="company-state">
              <Icon name="search" size={27} />
              <strong>{companies.length > 0 ? "검색 결과가 없습니다." : "등록된 기업정보가 없습니다."}</strong>
              <p>
                {companies.length > 0
                  ? "검색어를 변경해 다시 확인해주세요."
                  : "기업정보가 등록되면 이곳에 표시됩니다."}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}