import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slice";

const store = configureStore({
  reducer: {
    chatStore: chatSlice.reducer,
  },
});
export default store;
