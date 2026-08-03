import { createBrowserRouter } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
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
]);
