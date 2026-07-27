import { api } from "@/services/axiosConfig";

export const loginApi = (body) => api.post("QuanLyNguoiDung/DangNhap", body);
export const registerApi = (body) => api.post("QuanLyNguoiDung/DangKy", body);
export const getUserProfileApi = () =>
  api.post("QuanLyNguoiDung/ThongTinTaiKhoan");
export const updateUserProfileApi = (body) =>
  api.put("QuanLyNguoiDung/CapNhatThongTinNguoiDung", body);
