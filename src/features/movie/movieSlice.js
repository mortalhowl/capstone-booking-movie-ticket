import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { movieApi, movieDetailApi } from "./movieApi";

export const getMovies = createAsyncThunk(
  "movie/getMovies",
  async (params, thunkAPI) => {
    try {
      const { data } = await movieApi(params);
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const searchMovies = createAsyncThunk(
  "movie/searchMovies",
  async (params, thunkAPI) => {
    try {
      const { data } = await movieApi(params);
      return data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getMovieDetail = createAsyncThunk(
  "movie/getMovieDetail",
  async (params, thunkAPI) => {
    try {
      const { data } = await movieDetailApi(params);
      return data.content;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  },
);

const initialState = {
  data: [],
  loading: false,
  error: null,

  searchResults: [],
  searchLoading: false,
  searchError: null,

  movieDetail: {},
  movieDetailLoading: false,
  movieDetailError: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(searchMovies.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })

      .addCase(getMovieDetail.pending, (state) => {
        state.movieDetailLoading = true;
        state.movieDetailError = null;
      })
      .addCase(getMovieDetail.fulfilled, (state, action) => {
        state.movieDetailLoading = false;
        state.movieDetail = action.payload;
      })
      .addCase(getMovieDetail.rejected, (state, action) => {
        state.movieDetailLoading = false;
        state.movieDetailError = action.payload;
      });
  },
});

export default movieSlice.reducer;
