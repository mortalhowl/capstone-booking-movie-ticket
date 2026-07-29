import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { bannerReducer } from "@/features/banner";
import { movieReducer } from "@/features/movie";
import adminMovieReducer from "@/features/admin/slice";

/**
 * Cấu hình Redux Store tập trung cho toàn bộ ứng dụng
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
    movies: movieReducer,
    adminMovie: adminMovieReducer,
  },
});
