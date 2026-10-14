import type { ReactNode } from "react";

interface VerificationCardProps {
  status: string;
  label: string;
  description: string;
  children?: ReactNode;
}

/** Shared status wrapper for document verification UI. */
export default function VerificationCard({ status, label, description, children }: VerificationCardProps) {
  const statusClass = status === "APPROVED" ? "is-approved" : status === "REJECTED" ? "is-rejected" : "";
  return (
    <div className="verification-card">
      <div className="verification-status">
        <span className={`status-dot ${statusClass}`} />
        <div><span>현재 인증 상태</span><strong>{label}</strong><p>{description}</p></div>
      </div>
      {children}
    </div>
  );
}