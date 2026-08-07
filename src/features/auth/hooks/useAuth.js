import { useSelector, useDispatch } from "react-redux";
import {
  loginServices,
  logoutUser,
  registerServices,
  getUserProfileServices,
  updateUserProfileServices,
} from "../authSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, userInfo, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (body) => {
    try {
      const res = await dispatch(loginServices(body)).unwrap();
      toast.success("Đăng nhập thành công!");

      const from = location.state?.from?.pathname
        ? `${location.state.from.pathname}${location.state.from.search || ""}`
        : location.state?.from || "/";

      if (res?.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      return res;
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Đăng nhập thất bại"
      );
      throw err;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Đăng xuất thành công");
    navigate("/auth/login");
  };

  const handleRegister = async (body) => {
    try {
      const res = await dispatch(registerServices(body)).unwrap();
      toast.success("Đăng ký thành công, vui lòng đăng nhập!");
      navigate("/auth/login");
      return res;
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Đăng ký thất bại"
      );
      throw err;
    }
  };

  const handleGetProfile = async () => {
    try {
      const res = await dispatch(getUserProfileServices()).unwrap();
      return res;
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Lấy thông tin tài khoản thất bại"
      );
      throw err;
    }
  };

  const handleUpdateProfile = async (body) => {
    try {
      const res = await dispatch(updateUserProfileServices(body)).unwrap();
      toast.success("Cập nhật thông tin thành công!");
      dispatch(getUserProfileServices());
      return res;
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Cập nhật thông tin thất bại"
      );
      throw err;
    }
  };

  const isAuthenticated = Boolean(data && data.accessToken);

  return {
    isAuthenticated,
    handleLogin,
    handleLogout,
    handleRegister,
    handleGetProfile,
    handleUpdateProfile,
    data,
    userInfo,
    loading,
    error,
  };
}
