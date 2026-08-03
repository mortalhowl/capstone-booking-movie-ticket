import { useState } from "react";
import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Film,
  Calendar,
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Clapperboard,
} from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra thông tin người dùng đăng nhập trong localStorage
  const currentUser = localStorage.getItem("USER_ADMIN")
    ? JSON.parse(localStorage.getItem("USER_ADMIN"))
    : localStorage.getItem("USER_DATA")
    ? JSON.parse(localStorage.getItem("USER_DATA"))
    : null;

  // BẢO VỆ ROUTE ADMIN: Nếu chưa đăng nhập hoặc không phải Quản Trị Viên -> Đẩy về trang Login
  if (!currentUser || currentUser.maLoaiNguoiDung !== "QuanTri") {
    return <Navigate to="/auth/login" replace />;
  }

  // Xử lý đăng xuất tài khoản Admin
  const handleLogout = () => {
    localStorage.removeItem("USER_ADMIN");
    localStorage.removeItem("USER_DATA");
    navigate("/auth/login");
  };

  const navItems = [
    {
      title: "Quản Lý Phim",
      path: "/admin/movies",
      icon: Film,
    },
    {
      title: "Quản Lý Người Dùng",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "Tạo Lịch Chiếu",
      path: "/admin/showtime",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-blue-600 rounded-full shadow-lg text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-white tracking-wide">
                Admin Portal
              </h1>
              <span className="text-[11px] text-blue-400 font-medium">
                Movie Booking CyberSoft
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quản Lý Chức Năng
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-semibold text-sm flex-shrink-0">
                {(currentUser?.hoTen || currentUser?.taiKhoan || "AD").slice(0, 2).toUpperCase()}
              </div>
              <div className="text-xs truncate">
                <p className="font-semibold text-slate-200 truncate">{currentUser?.hoTen || currentUser?.taiKhoan || "Quản Trị Viên"}</p>
                <p className="text-slate-400 truncate">{currentUser?.email || currentUser?.taiKhoan || "Admin"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/60 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-slate-400 hidden sm:block">
              Hệ thống Quản lý Phim & Đặt vé Phim
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </button>

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Hệ thống Hoạt động</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
