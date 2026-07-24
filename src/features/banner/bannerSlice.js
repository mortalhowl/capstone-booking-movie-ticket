import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bannerApi } from "./bannerApi";

export const getBanners = createAsyncThunk(
  "data/getBanners",
  async (_, thunkAPI) => {
    try {
      const { data } = await bannerApi();
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
