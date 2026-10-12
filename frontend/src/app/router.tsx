
import { createBrowserRouter, Navigate } from "react-router-dom";

// 페이지는 접속할 때 불러오도록 설정
export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("../features/Home/HomePage")).default,
    }),
  },
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/LoginPage")).default,
    }),
  },
  {
    path: "/signup",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/SignupTypePage")).default,
    }),
  },
  {
    path: "/signup/personal",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/PersonalSignupPage")).default,
    }),
  },
  {
    path: "/signup/company",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/CompanySignupPage")).default,
    }),
  },
  {
    path: "/signup/vendor",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/StoreSignupPage")).default,
    }),
  },
  {
    path: "/users",
    lazy: async () => ({
      Component: (await import("../features/User/UserListPage")).default,
    }),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);