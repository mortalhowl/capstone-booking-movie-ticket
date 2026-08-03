import { useSelector, useDispatch } from "react-redux";
import {
  loginServices,
  logoutUser,
  registerServices,
  getUserProfileServices,
  updateUserProfileServices,
} from "../authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (data && data.accessToken) {
      if (data.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin/movies");
      } else {
        navigate("/");
      }
    }
  }, [data, error, navigate]);

  const handleLogin = async (body) => {
    try {
      await dispatch(loginServices(body)).unwrap();
      toast.success("Đăng nhập thành công!");
      if (data.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin/movies");
      } else {
        navigate("/");
      }
    } catch {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Đăng xuất thành công");
  };

  const handleRegister = async (body) => {
    try {
      await dispatch(registerServices(body)).unwrap();
      toast.success("Đăng kí thành công, vui lòng đăng nhập");
      navigate("/auth/login");
    } catch {
      toast.error(error.content);
    }
  };

  const handleGetProfile = () => {
    dispatch(getUserProfileServices());
  };

  const handleUpdateProfile = async (body) => {
    try {
      await dispatch(updateUserProfileServices(body)).unwrap();
      toast.success("Cập nhật thông tin thành công");
      handleGetProfile();
    } catch {
      toast.error(error);
    }
  };

  return {
    handleLogin,
    handleLogout,
    handleRegister,
    handleGetProfile,
    handleUpdateProfile,
    userInfo,
    loading,
    error,
  };
}
