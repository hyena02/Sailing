import type { ReactNode } from "react";

export type IconName =
  | "anchor" | "arrow" | "bell" | "briefcase" | "building" | "chevron"
  | "comment" | "compass" | "heart" | "map" | "menu" | "pen"
  | "search" | "ship" | "user" | "x";

interface IconProps {
  name: IconName;
  size?: number;
  filled?: boolean;
}

export default function Icon({ name, size = 20, filled = false }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    anchor: <><circle cx="12" cy="5" r="3" /><path d="M12 8v13M5 12H2a10 10 0 0 0 20 0h-3M8 12h8" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    building: <><path d="M3 21h18M5 21V5l7-3v19M12 8h7v13M8 7h1M8 11h1M8 15h1M15 11h1M15 15h1" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    comment: <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-5a9 9 0 1 1 18-5Z" />,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4 4-2Z" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    pen: <><path d="m15 5 4 4L8 20H4v-4L15 5Z" /><path d="m13 7 4 4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    ship: <><path d="m3 13 2 7h14l2-7-9-4-9 4Z" /><path d="M8 11V5h8v6M10 5V2h4v3M2 22c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}