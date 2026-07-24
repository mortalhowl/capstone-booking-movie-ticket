import { api } from "@/services/axiosConfig";

export const bannerApi = () => api.get("QuanLyPhim/LayDanhSachBanner");
