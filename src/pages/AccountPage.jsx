import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Ticket, Loader2 } from "lucide-react";
import { useAuth, ProfileForm, BookingHistory } from "@/features/auth";

export default function AccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userInfo,
    data,
    loading,
    isAuthenticated,
    handleGetProfile,
    handleUpdateProfile,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes("booking-history")) {
      return "history";
    }
    return "profile";
  });

  useEffect(() => {
    if (location.pathname.includes("booking-history")) {
      setActiveTab("history");
    } else if (location.pathname.includes("user-info")) {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      handleGetProfile();
    }
  }, [isAuthenticated]);

  const currentUser = userInfo || data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 text-white font-bold text-2xl rounded-full flex items-center justify-center border-2 border-white/40 shadow-inner">
              {currentUser?.hoTen
                ? currentUser.hoTen.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Xin chào, {currentUser?.hoTen || "Bạn"}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                Tài khoản: {currentUser?.taiKhoan || ""} | Email:{" "}
                {currentUser?.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sticky top-24">
              <div className="flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" /> Thông tin chung
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                    activeTab === "history"
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Ticket className="w-5 h-5" /> Lịch sử đặt vé
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading && !userInfo ? (
              <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-gray-500 text-sm font-medium">
                  Đang tải thông tin tài khoản...
                </p>
              </div>
            ) : activeTab === "profile" ? (
              <ProfileForm
                key={currentUser?.taiKhoan || "profile"}
                userInfo={currentUser}
              />
            ) : (
              <BookingHistory thongTinDatVe={userInfo?.thongTinDatVe || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
