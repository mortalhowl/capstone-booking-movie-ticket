import { useSelector, useDispatch } from "react-redux";
import {
  loginServices,
  logoutUser,
  getUserProfileServices,
  updateUserProfileServices,
} from "../authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (data && data.accessToken) {
      toast.success("Đăng nhập thành công!");
      if (data.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast.error(error);
    }
  }, [data, error, navigate]);

  const handleLogin = (body) => {
    dispatch(loginServices(body));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Đăng xuất thành công");
  };

  const handleGetProfile = () => {
    dispatch(getUserProfileServices());
  };

  const handleUpdateProfile = async (body) => {
    try {
      await updateUserProfileServices(body);
      toast.success("Cập nhật thông tin thành công");
    } catch {
      toast.error(error);
    }
  };

  return {
    handleLogin,
    handleLogout,
    handleGetProfile,
    handleUpdateProfile,
    userInfo,
    loading,
    error,
  };
}
