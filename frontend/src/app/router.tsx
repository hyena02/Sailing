
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
    path: "/login", // 로그인
    lazy: async () => ({
      Component: (await import("../features/auth/pages/LoginPage")).default,
    }),
  },
  {
    path: "/signup", // 회원가입
    lazy: async () => ({
      Component: (await import("../features/auth/pages/SignupTypePage")).default,
    }),
  },
  {
    path: "/signup/personal", //회원가입 일반회원
    lazy: async () => ({
      Component: (await import("../features/auth/pages/PersonalSignupPage")).default,
    }),
  },
  {
    path: "/signup/company",  //회원가입 기업회원
    lazy: async () => ({
      Component: (await import("../features/auth/pages/CompanySignupPage")).default,
    }),
  },
  {
    path: "/signup/store",  //회원가입 업체회원
    lazy: async () => ({
      Component: (await import("../features/auth/pages/StoreSignupPage")).default,
    }),
  },
  {
    path: "/users", 
    lazy: async () => ({
      Component: (await import("../features/users/UserListPage")).default,
    }),
  },
  {
    path: "/mypage/personal", //마이페이지 일반
    lazy: async () => ({
      Component: (
        await import("../features/mypage/personal/PersonalMyPage")).default,
    }),
  },
  {
    path: "/mypage/personal/likes",  //마이페이지-일반 관심공고
    lazy: async () => {
      const PersonalActivityPage = (
        await import("../features/mypage/personal/PersonalActivityPage")
      ).default;

      return {
        Component: () => <PersonalActivityPage type="likes" />,
      };
    },
  },
  {
    path: "/mypage/personal/writing", //마이페이지 - 일반 내가쓴글
    lazy: async () => {
      const PersonalActivityPage = (
        await import("../features/mypage/personal/PersonalActivityPage")
      ).default;

      return {
        Component: () => <PersonalActivityPage type="writing" />,
      };
    },
  },
  {
    path: "/mypage/company",
    lazy: async () => ({
      Component: (
        await import("../features/mypage/company/CompanyMyPage")
      ).default,
    }),
  },
  {
    // 업체회원 마이페이지 (/mypage/store)
    path: "/mypage/store",
    lazy: async () => ({
      Component: (await import("../features/mypage/store/storeMyPage")).default,
    }),
  },
  {
    path: "/mypage/store",
    lazy: async () => ({
      Component: (await import("../features/mypage/store/storeMyPage")).default,
    }),
  },



  { path: "*", element: <Navigate to="/" replace /> },
]);