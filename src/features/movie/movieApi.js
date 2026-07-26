import { api } from "@/services/axiosConfig";

export const movieApi = (params = {}) => {
  const queryParams = {
    maNhom: params.maNhom || "GP01",
  };
  if (params.tenPhim && params.tenPhim.trim() !== "") {
    queryParams.tenPhim = params.tenPhim;
  }
  return api.get("QuanLyPhim/LayDanhSachPhim", {
    params: queryParams,
  });
};

export const movieDetailApi = (params = {}) => {
  const queryParams = {
    maPhim: params.maPhim,
  };

  return api.get("QuanLyPhim/LayThongTinPhim", {
    params: queryParams,
  });
};
