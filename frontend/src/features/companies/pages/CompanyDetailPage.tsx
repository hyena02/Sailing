import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import { getCompany } from "../companyApi";
import type { CompanyItem } from "../companyTypes";
import "../Companies.css";

export default function CompanyDetailPage() {
  const { companyId = "" } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCompany(companyId)
      .then((data) => {
        if (active) setCompany(data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError, "기업정보를 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [companyId]);

  const homepageUrl = company?.homepage
    ? company.homepage.startsWith("http") ? company.homepage : `https://${company.homepage}`
    : null;

  return (
    <div className="subpage companies-page">
      <Header />
      <main className="company-detail container">
        <button className="page-back" type="button" onClick={() => navigate("/companies")}>
          <Icon name="chevron" size={17} /> 기업 목록
        </button>

        {loading ? (
          <div className="company-state" role="status">기업정보를 불러오는 중입니다.</div>
        ) : error || !company ? (
          <div className="company-state" role="alert">
            <strong>기업정보를 표시할 수 없습니다.</strong>
            <p>{error || "해당 기업을 찾을 수 없습니다."}</p>
            <small>기업 상세 조회 API가 백엔드에 구현되어 있는지 확인해주세요.</small>
          </div>
        ) : (
          <article className="company-detail-card">
            <div className="company-detail-card__heading">
              <span className="company-card__icon"><Icon name="building" size={30} /></span>
              <div>
                <span>{company.verificationStatus === "APPROVED" ? "인증 완료" : "기업 정보"}</span>
                <h1>{company.companyName}</h1>
                <p>{company.introduction || "등록된 기업 소개가 없습니다."}</p>
              </div>
            </div>

            <dl>
              <div><dt>주소</dt><dd>{company.address || "미등록"}</dd></div>
              <div>
                <dt>홈페이지</dt>
                <dd>
                  {homepageUrl
                    ? <a href={homepageUrl} target="_blank" rel="noreferrer">홈페이지 방문</a>
                    : "미등록"}
                </dd>
              </div>
            </dl>
            <button type="button" className="button button--primary" onClick={() => navigate("/jobs")}>
              채용공고 확인 <Icon name="arrow" size={16} />
            </button>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}