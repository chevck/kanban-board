import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  rows: [],
  tickets: [],
  error: "",
};

export const boardReducerSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    error_call: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    fetch_rows: (state) => {},
    fetch_rows_success: (state, { payload }) => {
      state.rows = payload;
    },
    create_row: () => {},
    create_row_success: (state, { payload }) => {
      state.rows = [...state.rows, payload];
    },
    delete_row: (state) => {},
    delete_row_success: (state, { payload }) => {
      state.loading = false;
      state.rows = state.rows.filter((x) => x.id !== payload.id);
    },
    fetch_tickets: (state) => {},
    fetch_tickets_success: (state) => {},
    create_tickets: (state) => {},
    create_tickets_success: (state, { payload }) => {},
  },
});

export const {
  fetch_rows,
  fetch_rows_success,
  create_row,
  create_row_success,
  error_call,
  delete_row,
  delete_row_success,
  create_tickets,
  create_tickets_success,
  fetch_tickets,
  fetch_tickets_success,
} = boardReducerSlice.actions;

export default boardReducerSlice.reducer;
