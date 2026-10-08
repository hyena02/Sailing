import { useState } from "react";

// 로고 이미지가 없을 때 쓰는 마크 색상 (Home.css 의 .mark-* 와 이름이 같아야 함)
const MARK_COLORS = ["blue", "cyan", "indigo", "green", "purple", "orange"];

// 회사 이름이 같으면 항상 같은 색이 나오도록 이름 → 색상 변환
function pickColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return MARK_COLORS[hash % MARK_COLORS.length];
}

interface CompanyLogoProps {
  name: string;                    // COMPANY_USER.COMPANY_NAME
  imageUrl?: string | null;        // COMPANY_USER.LOGO_IMAGE (없으면 첫 글자 마크로 대체)
  compact?: boolean;
}

export default function CompanyLogo({ name, imageUrl, compact = false }: CompanyLogoProps) {
  const [imageFailed, setImageFailed] = useState(false); // 이미지 주소가 깨졌을 때 대비
  const size = compact ? "is-compact" : "";

  if (imageUrl && !imageFailed) {
    return (
      <img
        className={`logo-img ${size}`}
        src={imageUrl}
        alt={`${name} 회사 로고`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={`company-logo ${size}`}>
      <span className={`company-logo-mark mark-${pickColor(name)}`}>{name.charAt(0)}</span>
      <span className="company-logo-name">{name}</span>
    </div>
  );
}