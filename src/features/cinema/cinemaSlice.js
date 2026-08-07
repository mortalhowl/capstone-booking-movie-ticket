import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cinemaSystemScheduleApi, movieShowTimeApi } from "./cinemaApi";

export const getCinemaSystemSchedule = createAsyncThunk(
  "cinema/getCinemaSystemSchedule",
  async (params, thunkAPI) => {
    try {
      const { data } = await cinemaSystemScheduleApi(params);
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getMovieShowTime = createAsyncThunk(
  "cinema/getMovieShowTime",
  async (params, thunkAPI) => {
    try {
      const { data } = await movieShowTimeApi(params);
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const initialState = {
  systemSchedule: [],
  showTime: [],
  loading: false,
  error: null,
};

const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCinemaSystemSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCinemaSystemSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.systemSchedule = action.payload;
      })
      .addCase(getCinemaSystemSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMovieShowTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovieShowTime.fulfilled, (state, action) => {
        state.loading = false;
        state.showTime = action.payload;
      })
      .addCase(getMovieShowTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cinemaSlice.reducer;
