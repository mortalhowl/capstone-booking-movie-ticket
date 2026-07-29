import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { bannerReducer } from "@/features/banner";
import { movieReducer } from "@/features/movie";
import { cinemaReducer } from "@/features/cinema";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
    movies: movieReducer,
    cinema: cinemaReducer,
  },
});
