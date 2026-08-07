import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Film, Lock, User, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { loginServices, logoutUser } from "@/features/auth/authSlice";
import { LoginForm } from "@/features/auth";
import { scrollToTop } from "@/utils/scrollToTop";

export default function LoginPage() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    scrollToTop();
  }, []);

  // TỰ ĐỘNG CHUYỂN VỀ /admin NẾU ĐÃ ĐĂNG NHẬP ADMIN RỒI
  useEffect(() => {
    if (!isAdminPath) return;
    const localUserStr = localStorage.getItem("USER_DATA");
    if (localUserStr) {
      try {
        const user = JSON.parse(localUserStr);
        if (user && user.accessToken && user.maLoaiNguoiDung === "QuanTri") {
          navigate("/admin", { replace: true });
        }
      } catch (e) {
        console.error("Invalid USER_DATA in localStorage", e);
      }
    }
  }, [navigate, isAdminPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!taiKhoan.trim() || !matKhau.trim()) {
      setLocalError("Vui lòng điền đầy đủ Tài khoản và Mật khẩu!");
      return;
    }

    const actionResult = await dispatch(loginServices({ taiKhoan, matKhau }));

    if (loginServices.rejected.match(actionResult)) {
      const errorMsg =
        actionResult.payload ||
        "Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
      setLocalError(errorMsg);
      setMatKhau("");
      return;
    }

    if (loginServices.fulfilled.match(actionResult)) {
      const user = actionResult.payload;

      if (!user || user.maLoaiNguoiDung !== "QuanTri") {
        dispatch(logoutUser());
        setLocalError(
          "Tài khoản của bạn là Khách Hàng. Bạn không có quyền truy cập vào hệ thống Quản Trị (Admin)!"
        );
        setMatKhau("");
        return;
      }

      localStorage.setItem("USER_DATA", JSON.stringify(user));
      navigate("/admin");
    }
  };

  if (!isAdminPath) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Đăng Nhập Admin</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Hệ thống Quản trị Đặt vé Phim CyberSoft
            </p>
          </div>
        </div>

        {(localError || error) && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start space-x-3 text-rose-400 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{localError || error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tài Khoản Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập tài khoản admin..."
                value={taiKhoan}
                onChange={(e) => setTaiKhoan(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu..."
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Quản Trị</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
          <p className="text-[11px] text-slate-500">
            Trang đăng nhập dành riêng cho Ban Quản Trị Hệ Thống.
          </p>
        </div>
      </div>
    </div>
  );
}
