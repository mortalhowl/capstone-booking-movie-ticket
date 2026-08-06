import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import dayjs from "dayjs";

const initialState = {
  loading: false,
  movies: [],
  cinemaSystems: [],
  cinemaClusters: [],
  error: null,
  successMessage: null,
};

/**
 * 1. Lấy danh sách Phim GP01
 */
export const fetchMoviesForShowtime = createAsyncThunk(
  "adminShowtime/fetchMoviesForShowtime",
  async (maNhom = import.meta.env.VITE_MA_NHOM || "GP01", { rejectWithValue }) => {
    try {
      const response = await api.get(`QuanLyPhim/LayDanhSachPhim?MaNhom=${maNhom}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải danh sách phim");
    }
  }
);

/**
 * 2. Lấy danh sách Hệ Thống Rạp
 */
export const fetchCinemaSystems = createAsyncThunk(
  "adminShowtime/fetchCinemaSystems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("QuanLyRap/LayThongTinHeThongRap");
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải danh sách hệ thống rạp");
    }
  }
);

/**
 * 3. Lấy cụm rạp theo Hệ Thống Rạp
 */
export const fetchCinemaClusters = createAsyncThunk(
  "adminShowtime/fetchCinemaClusters",
  async (maHeThongRap, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
      );
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải cụm rạp");
    }
  }
);

/**
 * 4. Gọi API Tạo Lịch Chiếu Phim
 * POST: /api/QuanLyDatVe/TaoLichChieu
 * Payload: { maPhim, ngayChieuGioChieu: "DD/MM/YYYY HH:mm:ss", maRap, giaVe }
 */
export const actCreateShowtime = createAsyncThunk(
  "adminShowtime/actCreateShowtime",
  async (showtimeData, { rejectWithValue }) => {
    try {
      // Format ngayChieuGioChieu sang dạng DD/MM/YYYY HH:mm:ss
      const formattedDate = dayjs(showtimeData.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss");

      const payload = {
        maPhim: Number(showtimeData.maPhim),
        ngayChieuGioChieu: formattedDate,
        maRap: String(showtimeData.maCumRap || showtimeData.maRap),
        giaVe: Number(showtimeData.giaVe),
      };

      const response = await api.post("QuanLyDatVe/TaoLichChieu", payload);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.content || error.response?.data || "Tạo lịch chiếu thất bại"
      );
    }
  }
);

const adminShowtimeSlice = createSlice({
  name: "adminShowtime",
  initialState,
  reducers: {
    clearShowtimeStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMoviesForShowtime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesForShowtime.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMoviesForShowtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Cinema Systems
      .addCase(fetchCinemaSystems.fulfilled, (state, action) => {
        state.cinemaSystems = action.payload;
      })

      // Fetch Cinema Clusters
      .addCase(fetchCinemaClusters.fulfilled, (state, action) => {
        state.cinemaClusters = action.payload;
      })

      // Create Showtime
      .addCase(actCreateShowtime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actCreateShowtime.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Tạo lịch chiếu thành công!";
      })
      .addCase(actCreateShowtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShowtimeStatus } = adminShowtimeSlice.actions;
export default adminShowtimeSlice.reducer;
