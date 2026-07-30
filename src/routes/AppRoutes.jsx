import { createBrowserRouter } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";

import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";

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
    ],
  },
]);
