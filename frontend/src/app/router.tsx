import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({ Component: (await import("../features/Home/HomePage")).default }),
  },
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("../features/auth/pages/LoginPage")).default }),
  },
  {
    path: "/signup",
    lazy: async () => ({ Component: (await import("../features/auth/pages/SignupTypePage")).default }),
  },
  {
    path: "/signup/personal",
    lazy: async () => ({ Component: (await import("../features/auth/pages/PersonalSignupPage")).default }),
  },
  {
    path: "/signup/company",
    lazy: async () => ({ Component: (await import("../features/auth/pages/CompanySignupPage")).default }),
  },
  {
    path: "/signup/store",
    lazy: async () => ({ Component: (await import("../features/auth/pages/StoreSignupPage")).default }),
  },
  {
    path: "/jobs",
    lazy: async () => ({ Component: (await import("../features/job/pages/JobListPage")).default }),
  },
  { path: "/jobs/detail", element: <Navigate to="/jobs" replace /> },
  {
    path: "/jobs/detail/:jobId",
    lazy: async () => ({ Component: (await import("../features/job/pages/JobDetailPage")).default }),
  },
  {
    path: "/jobs/new",
    lazy: async () => ({ Component: (await import("../features/job/pages/JobCreatePage")).default }),
  },
  {
    path: "/talents",
    lazy: async () => ({ Component: (await import("../features/talents/TalentsPage")).default }),
  },
  {
    path: "/companies",
    lazy: async () => ({ Component: (await import("../features/companies/pages/CompanyListPage")).default }),
  },
  {
    path: "/companies/:companyId",
    lazy: async () => ({ Component: (await import("../features/companies/pages/CompanyDetailPage")).default }),
  },
  {
    path: "/stores",
    lazy: async () => ({ Component: (await import("../features/stores/pages/StoreListPage")).default }),
  },
  {
    path: "/stores/detail/:storeId",
    lazy: async () => ({ Component: (await import("../features/stores/pages/StoreDetailPage")).default }),
  },
  {
    path: "/stores/:storeId",
    lazy: async () => ({ Component: (await import("../features/stores/pages/StoreDetailPage")).default }),
  },
  {
    path: "/community",
    lazy: async () => ({ Component: (await import("../features/community/pages/CommunityPage")).default }),
  },
  {
    path: "/community/write",
    lazy: async () => ({ Component: (await import("../features/community/pages/CommunityWritePage")).default }),
  },
  {
    path: "/community/:postId",
    lazy: async () => ({ Component: (await import("../features/community/pages/CommunityDetailPage")).default }),
  },
  {
    path: "/chats",
    lazy: async () => ({ Component: (await import("../features/chats/ChatsPage")).default }),
  },
  {
    path: "/chats/:storeId",
    lazy: async () => ({ Component: (await import("../features/chats/ChatsPage")).default }),
  },
  {
    path: "/mypage/personal",
    lazy: async () => ({ Component: (await import("../features/mypage/personal/PersonalMyPage")).default }),
  },
  {
    path: "/mypage/personal/likes",
    lazy: async () => {
      const PersonalActivityPage = (await import("../features/mypage/personal/PersonalActivityPage")).default;
      return { Component: () => <PersonalActivityPage type="likes" /> };
    },
  },
  {
    path: "/mypage/personal/writing",
    lazy: async () => {
      const PersonalActivityPage = (await import("../features/mypage/personal/PersonalActivityPage")).default;
      return { Component: () => <PersonalActivityPage type="writing" /> };
    },
  },
  {
    path: "/mypage/company",
    lazy: async () => ({ Component: (await import("../features/mypage/company/CompanyMyPage")).default }),
  },
  {
    path: "/mypage/store",
    lazy: async () => ({ Component: (await import("../features/mypage/store/storeMyPage")).default }),
  },
  {
    path: "/users",
    lazy: async () => ({ Component: (await import("../features/users/UserListPage")).default }),
  },
  { path: "/mypage", element: <Navigate to="/mypage/personal" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);