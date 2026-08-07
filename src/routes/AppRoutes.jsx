import { createBrowserRouter, Navigate } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import AdminGuard from "@/routes/AdminGuard";
import ProtectedRoute from "@/routes/ProtectedRoute";

import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import TicketRoomPage from "@/pages/TicketRoomPage";
import AccountPage from "@/pages/AccountPage";
import TestApi from "@/pages/TestApi";

export const router = createBrowserRouter([
  {
    path: "auth/login",
    element: <LoginPage />,
  },
  {
    path: "auth/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movie/:maPhim",
        element: <MovieDetailPage />,
      },
      {
        path: "booking/:maLichChieu",
        element: (
          <ProtectedRoute>
            <TicketRoomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-info",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking-history",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "test-api",
        element: <TestApi />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/showtimes" replace />,
          },
          {
            path: "movies",
            element: (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <h1 className="text-xl font-bold text-slate-100 mb-2">Quản Lý Phim</h1>
                <p className="text-sm text-slate-400">
                  Trang Quản lý danh sách phim thuộc hệ thống Quản Trị Admin CyberSoft.
                </p>
              </div>
            ),
          },
          {
            path: "showtimes",
            element: (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <h1 className="text-xl font-bold text-slate-100 mb-2">Quản Lý Lịch Chiếu</h1>
                <p className="text-sm text-slate-400">
                  Trang Quản lý Lịch chiếu phim thuộc hệ thống Quản Trị Admin CyberSoft.
                </p>
              </div>
            ),
          },
          {
            path: "users",
            element: (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <h1 className="text-xl font-bold text-slate-100 mb-2">Quản Lý Người Dùng</h1>
                <p className="text-sm text-slate-400">
                  Trang Quản lý Người dùng thuộc hệ thống Quản Trị Admin CyberSoft.
                </p>
              </div>
            ),
          },
        ],
      },
    ],
  },
]);
