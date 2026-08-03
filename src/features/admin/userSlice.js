import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

/**
 * Khởi tạo state ban đầu cho Quản lý Người Dùng Admin
 */
const initialState = {
  loading: false,
  data: null, // Danh sách người dùng
  userTypes: [], // Danh sách loại người dùng (QuanTri, KhachHang)
  error: null,
  successMessage: null,
};

/**
 * 1. AsyncThunk: Lấy danh sách người dùng từ API CyberSoft
 * GET: /api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01
 */
export const fetchListUser = createAsyncThunk(
  "adminUser/fetchListUser",
  async (maNhom = import.meta.env.VITE_MA_NHOM || "GP01", { rejectWithValue }) => {
    try {
      const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải danh sách người dùng");
    }
  }
);

/**
 * 2. AsyncThunk: Lấy danh sách Loại Người Dùng (Quản Trị, Khách Hàng)
 * GET: /api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung
 */
export const fetchUserTypes = createAsyncThunk(
  "adminUser/fetchUserTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("QuanLyNguoiDung/LayDanhSachLoaiNguoiDung");
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không thể tải danh sách loại người dùng");
    }
  }
);

/**
 * 3. AsyncThunk: Tìm kiếm người dùng theo từ khóa/tài khoản
 * GET: /api/QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP01&tuKhoa={tuKhoa}
 */
export const actSearchUser = createAsyncThunk(
  "adminUser/actSearchUser",
  async ({ tuKhoa, maNhom = import.meta.env.VITE_MA_NHOM || "GP01" }, { rejectWithValue }) => {
    try {
      if (!tuKhoa || !tuKhoa.trim()) {
        const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
        return response.data.content;
      }
      const response = await api.get(
        `QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=${maNhom}&tuKhoa=${encodeURIComponent(tuKhoa.trim())}`
      );
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Không tìm thấy người dùng");
    }
  }
);

/**
 * 4. AsyncThunk: Thêm người dùng mới
 * POST: /api/QuanLyNguoiDung/ThemNguoiDung
 */
export const actAddUser = createAsyncThunk(
  "adminUser/actAddUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        ...userData,
        maNhom: import.meta.env.VITE_MA_NHOM || "GP01",
      };
      const response = await api.post("QuanLyNguoiDung/ThemNguoiDung", payload);
      dispatch(fetchListUser());
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Thêm người dùng thất bại");
    }
  }
);

/**
 * 5. AsyncThunk: Cập nhật thông tin người dùng
 * POST: /api/QuanLyNguoiDung/CapNhatThongTinNguoiDung
 */
export const actUpdateUser = createAsyncThunk(
  "adminUser/actUpdateUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const payload = {
        ...userData,
        maNhom: import.meta.env.VITE_MA_NHOM || "GP01",
      };
      let response;
      try {
        response = await api.post("QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload);
      } catch (err) {
        response = await api.put("QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload);
      }
      dispatch(fetchListUser());
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Cập nhật thông tin người dùng thất bại");
    }
  }
);

/**
 * 6. AsyncThunk: Xóa người dùng theo TaiKhoan
 * DELETE: /api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan={taiKhoan}
 */
export const actDeleteUser = createAsyncThunk(
  "adminUser/actDeleteUser",
  async (taiKhoan, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
      dispatch(fetchListUser());
      return taiKhoan;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Xóa người dùng thất bại");
    }
  }
);

/**
 * Redux Slice cho Admin User
 */
const adminUserSlice = createSlice({
  name: "adminUserSlice",
  initialState,
  reducers: {
    clearUserStatusMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // --- Lấy danh sách người dùng ---
    builder
      .addCase(fetchListUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListUser.fulfilled, (state, action) => {
        state.loading = false;
        const list = action.payload || [];
        if (state.lastAddedUser) {
          const account = state.lastAddedUser.taiKhoan;
          const foundIndex = list.findIndex((u) => u.taiKhoan === account);
          if (foundIndex > 0) {
            const [addedObj] = list.splice(foundIndex, 1);
            state.data = [addedObj, ...list];
          } else if (foundIndex === 0) {
            state.data = list;
          } else {
            state.data = [state.lastAddedUser, ...list];
          }
        } else {
          state.data = list;
        }
        state.error = null;
      })
      .addCase(fetchListUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Lấy danh sách loại người dùng ---
    builder.addCase(fetchUserTypes.fulfilled, (state, action) => {
      state.userTypes = action.payload;
    });

    // --- Tìm kiếm người dùng ---
    builder
      .addCase(actSearchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actSearchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(actSearchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Thêm người dùng ---
    builder
      .addCase(actAddUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actAddUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Thêm người dùng mới thành công!";
        if (action.meta && action.meta.arg) {
          state.lastAddedUser = action.meta.arg;
        }
      })
      .addCase(actAddUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Cập nhật người dùng ---
    builder
      .addCase(actUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actUpdateUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Cập nhật thông tin người dùng thành công!";
      })
      .addCase(actUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Xóa người dùng ---
    builder
      .addCase(actDeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actDeleteUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Xóa người dùng thành công!";
      })
      .addCase(actDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserStatusMessage } = adminUserSlice.actions;
export default adminUserSlice.reducer;
