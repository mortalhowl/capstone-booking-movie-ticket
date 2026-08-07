import { api } from "@/services/axiosConfig";

export const cinemaSystemScheduleApi = (params = {}) => {
  const queryParams = {
    maNhom: params.maNhom || import.meta.env.VITE_MA_NHOM,
  };

  if (params.maHeThongRap && params.maHeThongRap.trim() !== 0) {
    queryParams.maHeThongRap = params.maHeThongRap;
  }

  return api.get("QuanLyRap/LayThongTinLichChieuHeThongRap", queryParams);
};

export const movieShowTimeApi = (maPhim) =>
  api.get("QuanLyRap/LayThongTinLichChieuPhim", {
    params: {
      maPhim: maPhim,
    },
  });
