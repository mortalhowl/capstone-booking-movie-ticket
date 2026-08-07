import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Film, Calendar, Users, LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { logoutUser } from "@/features/auth/authSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.auth);

  const localUserStr = localStorage.getItem("USER_DATA");
  const currentUser = data || (localUserStr ? JSON.parse(localUserStr) : null);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất tài khoản Quản trị?")) {
      dispatch(logoutUser());
      localStorage.removeItem("USER_ADMIN");
      localStorage.removeItem("USER_DATA");
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 tracking-wide uppercase">Admin Portal</h2>
              <p className="text-[10px] text-blue-400 font-mono">CyberSoft Movie</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            <NavLink
              to="/admin/movies"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Film className="w-4 h-4" />
              <span>Quản Lý Phim</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Người Dùng</span>
            </NavLink>

            <NavLink
              to="/admin/showtimes"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Calendar className="w-4 h-4" />
              <span>Quản Lý Lịch Chiếu</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer Logout button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bảng Điều Khiển Quản Trị Viên</span>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info Badge */}
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">
                  {currentUser?.hoTen || currentUser?.taiKhoan || "Admin User"}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium">Quản Trị Viên</p>
              </div>
            </div>

            {/* Topbar Logout Button */}
            <button
              onClick={handleLogout}
              title="Đăng xuất tài khoản"
              className="flex items-center space-x-1.5 bg-slate-950 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
