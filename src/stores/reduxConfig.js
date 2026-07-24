import { configureStore } from "@reduxjs/toolkit";

import { bannerReducer } from "@/features/banner";

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
  },
});
