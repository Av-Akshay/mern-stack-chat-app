import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat App",
  initialState: {
    selectedChat: {},
    chats: [],
  },
  reducers: {
    handelSelectedChat: (state, action) => {
      state.selectedChat = action?.payload;
    },
    handelAddNewChat: (state, action) => {
      state.chats.push(action.payload);
    },
    handelAddChats: (state, action) => {
      state.chats.push(...action.payload);
    },
  },
});

export const { handelSelectedChat, handelAddNewChat, handelAddChats } =
  chatSlice.actions;

export default chatSlice;
