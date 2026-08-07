import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  getUserProfileApi,
  updateUserProfileApi,
} from "./authApi";

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("USER_DATA");
  return user ? JSON.parse(user) : null;
};

export const loginServices = createAsyncThunk(
  "auth/loginServices",
  async (body, thunkAPI) => {
    try {
      const { data } = await loginApi(body);
      const userInfo = data.content;
      return userInfo;
    } catch (error) {
      let errorMsg =
        error.response?.data?.content ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        error.response?.data?.message ||
        error.message ||
        "Tài khoản hoặc mật khẩu không chính xác!";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const registerServices = createAsyncThunk(
  "auth/registerServices",
  async (body, thunkAPI) => {
    try {
      const { data } = await registerApi(body);
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.content || error.message || "Đăng ký thất bại"
      );
    }
  }
);

export const getUserProfileServices = createAsyncThunk(
  "auth/getUserProfileServices",
  async (_, thunkAPI) => {
    try {
      const { data } = await getUserProfileApi();
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.content ||
          error.message ||
          "Lấy thông tin tài khoản thất bại"
      );
    }
  }
);

export const updateUserProfileServices = createAsyncThunk(
  "auth/updateUserProfileServices",
  async (body, thunkAPI) => {
    try {
      const { data } = await updateUserProfileApi(body);
      return data.content || body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.content ||
          error.message ||
          "Cập nhật thông tin thất bại"
      );
    }
  }
);

const initialState = {
  data: getUserFromLocalStorage(),
  userInfo: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.data = null;
      state.error = null;
      state.userInfo = null;
      localStorage.removeItem("USER_DATA");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerServices.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserProfileServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileServices.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserProfileServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfileServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileServices.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.userInfo = { ...state.userInfo, ...action.payload };
          if (state.data) {
            const updatedData = { ...state.data, ...action.payload };
            state.data = updatedData;
            localStorage.setItem("USER_DATA", JSON.stringify(updatedData));
          }
        }
      })
      .addCase(updateUserProfileServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
