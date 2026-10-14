import type { ReactNode } from "react";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import "../../../styles/home.css";
import "../Community.css";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="subpage"><Header />{children}<Footer /></div>;
}