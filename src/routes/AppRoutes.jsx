import { createBrowserRouter } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import TestPage from "@/pages/TestPage";
import TestSearchPage from "@/pages/TestSearchPage";
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
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/test/search",
        element: <TestSearchPage />,
      },
    ],
  },
]);
