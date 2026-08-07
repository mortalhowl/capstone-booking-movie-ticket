import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminGuard() {
  const { data } = useSelector((state) => state.auth);

  // Lấy dữ liệu từ Redux hoặc từ localStorage
  const localUserStr = localStorage.getItem("USER_DATA");
  const user = data || (localUserStr ? JSON.parse(localUserStr) : null);

  // Nếu chưa đăng nhập HOẶC không phải là Loại Tài Khoản Quản Trị -> Đẩy về /admin/login
  if (!user || !user.accessToken || user.maLoaiNguoiDung !== "QuanTri") {
    return <Navigate to="/admin/login" replace />;
  }

  // Hợp lệ -> Cho phép truy cập vào các trang Admin
  return <Outlet />;
}
