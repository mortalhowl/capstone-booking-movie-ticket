import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

/**
 * Khởi tạo state ban đầu cho quản lý phim Admin
 */
const initialState = {
  loading: false,
  data: null, // Danh sách phim lấy từ API
  error: null,
  successMessage: null,
};

/**
 * 1. AsyncThunk: Lấy danh sách phim từ API
 * GET: /api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01
 */
export const fetchListMovie = createAsyncThunk(
  "adminMovie/fetchListMovie",
  async (maNhom = import.meta.env.VITE_MA_NHOM || "GP01", { rejectWithValue }) => {
    try {
      const response = await api.get(`QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải danh sách phim");
    }
  }
);

/**
 * 2. AsyncThunk: Thêm phim mới kèm upload hình ảnh
 * POST: /api/QuanLyPhim/ThemPhimUploadHinh
 */
export const actAddMovie = createAsyncThunk(
  "adminMovie/actAddMovie",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("QuanLyPhim/ThemPhimUploadHinh", formData);
      // Sau khi thêm thành công, gọi lại API tải lại danh sách mới
      dispatch(fetchListMovie());
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Thêm phim thất bại");
    }
  }
);

/**
 * 3. AsyncThunk: Cập nhật thông tin phim kèm hình ảnh
 * POST: /api/QuanLyPhim/CapNhatPhimUpload
 */
export const actUpdateMovie = createAsyncThunk(
  "adminMovie/actUpdateMovie",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("QuanLyPhim/CapNhatPhimUpload", formData);
      // Sau khi cập nhật thành công, gọi lại API tải lại danh sách mới
      dispatch(fetchListMovie());
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Cập nhật phim thất bại");
    }
  }
);

/**
 * 4. AsyncThunk: Xóa phim theo mã phim
 * DELETE: /api/QuanLyPhim/XoaPhim?MaPhim={maPhim}
 */
export const actDeleteMovie = createAsyncThunk(
  "adminMovie/actDeleteMovie",
  async (maPhim, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
      // Sau khi xóa thành công, gọi lại API tải lại danh sách mới
      dispatch(fetchListMovie());
      return maPhim;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Xóa phim thất bại");
    }
  }
);

/**
 * 5. AsyncThunk: Tạo lịch chiếu phim
 * POST: /api/QuanLyDatVe/TaoLichChieu
 */
export const actCreateShowtime = createAsyncThunk(
  "adminMovie/actCreateShowtime",
  async (showtimeData, { rejectWithValue }) => {
    try {
      const response = await api.post("QuanLyDatVe/TaoLichChieu", showtimeData);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Tạo lịch chiếu thất bại");
    }
  }
);

/**
 * Redux Slice cho Admin Movie
 */
const adminMovieSlice = createSlice({
  name: "adminMovieSlice",
  initialState,
  reducers: {
    // Hàm reset thông báo lỗi/thành công nếu cần
    clearStatusMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // --- Xử lý Lấy danh sách phim ---
    builder
      .addCase(fetchListMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchListMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Xử lý Thêm phim mới ---
    builder
      .addCase(actAddMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actAddMovie.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Thêm phim mới thành công!";
      })
      .addCase(actAddMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Xử lý Cập nhật phim ---
    builder
      .addCase(actUpdateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actUpdateMovie.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Cập nhật phim thành công!";
      })
      .addCase(actUpdateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Xử lý Xóa phim ---
    builder
      .addCase(actDeleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actDeleteMovie.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Xóa phim thành công!";
      })
      .addCase(actDeleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Xử lý Tạo lịch chiếu ---
    builder
      .addCase(actCreateShowtime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actCreateShowtime.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Tạo lịch chiếu phim thành công!";
      })
      .addCase(actCreateShowtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatusMessage } = adminMovieSlice.actions;
export default adminMovieSlice.reducer;
