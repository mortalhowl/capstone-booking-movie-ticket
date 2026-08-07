import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ticketRoomApi, bookingTicketApi } from "./bookingApi";

export const getTicketRoom = createAsyncThunk(
  "booking/getTicketRoom",
  async (params, thunkApi) => {
    try {
      const { data } = await ticketRoomApi(params);
      return data.content;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const postBookingTicket = createAsyncThunk(
  "booking/postBookingTicket",
  async (body, thunkApi) => {
    try {
      const { data } = await bookingTicketApi(body);
      return data.content;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTicketRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTicketRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(postBookingTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBookingTicket.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postBookingTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
