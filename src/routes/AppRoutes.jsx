import { createBrowserRouter, Navigate } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

import TestPage from "@/pages/TestPage";
import TestSearchPage from "@/pages/TestSearchPage";
import TestMovieDetailPage from "@/pages/TestMovieDetailPage";
import TestApi from "@/pages/TestApi";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";

import AdminMoviePage from "@/pages/AdminMoviePage";
import AdminShowtimePage from "@/pages/AdminShowtimePage";

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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/movies" replace />,
      },
      {
        path: "movies",
        element: <AdminMoviePage />,
      },
      {
        path: "showtime",
        element: <AdminShowtimePage />,
      },
    ],
  },
]);
