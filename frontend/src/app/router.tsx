
import { createBrowserRouter, Navigate } from "react-router-dom";

// 페이지는 접속할 때 불러오도록 설정
export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("../features/Home/home")).default,
    }),
  },
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("../features/auth/login")).default,
    }),
  },
  {
    path: "/signup",
    lazy: async () => ({
      Component: (await import("../features/User/signup")).default,
    }),
  },
  {
    path: "/signup/personal",
    lazy: async () => ({
      Component: (await import("../features/User/personalSignup")).default,
    }),
  },
  {
    path: "/signup/company",
    lazy: async () => ({
      Component: (await import("../features/User/companySignup")).default,
    }),
  },
  {
    path: "/signup/vendor",
    lazy: async () => ({
      Component: (await import("../features/User/storeSignup")).default,
    }),
  },
  {
    path: "/users",
    lazy: async () => ({
      Component: (await import("../features/User/userList")).default,
    }),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);