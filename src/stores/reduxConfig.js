import { configureStore } from "@reduxjs/toolkit";

import { bannerReducer } from "@/features/banner";
import { movieReducer } from "@/features/movie";

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    movies: movieReducer,
  },
});
