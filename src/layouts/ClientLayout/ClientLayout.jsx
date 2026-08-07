import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { scrollToTop } from "@/utils/scrollToTop";

export default function ClientLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="grow pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
