import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import catalogReducer from "./catalogSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    catalog: catalogReducer,
  },
});