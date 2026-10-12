
import type { ReactNode } from "react";

type ProfileSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ProfileSection({
  title,
  description,
  children,
}: ProfileSectionProps) {
  return (
    <section className="profile-section">
      <div className="profile-section__heading">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
