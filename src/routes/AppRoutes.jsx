import { createBrowserRouter } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import TestPage from "@/pages/TestPage";
import TestSearchPage from "@/pages/TestSearchPage";
import TestMovieDetailPage from "@/pages/TestMovieDetailPage";
import TestApi from "@/pages/TestApi";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/test/movie",
        element: <TestSearchPage />,
      },
      {
        path: "/movie/:maPhim",
        element: <TestMovieDetailPage />,
      },
      {
        path: "/test/api",
        element: <TestApi />,
      },
    ],
  },
]);
