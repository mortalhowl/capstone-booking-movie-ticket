import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { bannerReducer } from "@/features/banner";
import { movieReducer } from "@/features/movie";
import adminMovieReducer from "@/features/admin/slice";
import adminUserReducer from "@/features/admin/userSlice";
import adminShowtimeReducer from "@/features/admin/showtimeSlice";

/**
 * Cấu hình Redux Store tập trung cho toàn bộ ứng dụng
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
    movies: movieReducer,
    adminMovie: adminMovieReducer,
    adminUser: adminUserReducer,
    adminShowtime: adminShowtimeReducer,
  },
});
