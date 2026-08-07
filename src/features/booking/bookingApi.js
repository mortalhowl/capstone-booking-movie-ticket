import { api } from "@/services/axiosConfig";

export const ticketRoomApi = (maLichChieu) =>
  api.get("QuanLyDatVe/LayDanhSachPhongVe", {
    params: {
      maLichChieu: maLichChieu,
    },
  });

export const bookingTicketApi = (body) => api.post("QuanLyDatVe/DatVe", body);
