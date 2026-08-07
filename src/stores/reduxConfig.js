import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { bannerReducer } from "@/features/banner";
import { movieReducer } from "@/features/movie";
import { cinemaReducer } from "@/features/cinema";
import { bookingReducer } from "@/features/booking";
import adminMovieReducer from "@/features/admin/slice";
import adminUserReducer from "@/features/admin/userSlice";

/**
 * Cấu hình Redux Store tập trung cho toàn bộ ứng dụng
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
    movies: movieReducer,
    cinema: cinemaReducer,
    booking: bookingReducer,
    adminMovie: adminMovieReducer,
    adminUser: adminUserReducer,
  },
});
