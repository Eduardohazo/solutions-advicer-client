import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCatalog } from "../api";

export const loadCatalog = createAsyncThunk(
  "catalog/load",
  () => fetchCatalog(),
  {
    condition: (_, { getState }) => getState().catalog.status === "idle",
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState: { areas: [], capas: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.areas = action.payload.areas;
        state.capas = action.payload.capas;
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectCatalog = (state) => state.catalog;

export default catalogSlice.reducer;