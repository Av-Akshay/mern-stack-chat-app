import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat App",
  initialState: {
    selectedChat: null,
    chats: [],
    groupChatFormModel: false,
    user: null,
  },
  reducers: {
    handleSaveUser: (state, action) => {
      state.user = action.payload;
    },
    handelSelectedChat: (state, action) => {
      state.selectedChat = action?.payload;
    },
    handelAddNewChat: (state, action) => {
      state.chats.push(action.payload);
    },
    handelAddChats: (state, action) => {
      state.chats = action.payload;
    },
    handelAddGroupChat: (state, action) => {
      state.chats.push(action.payload);
    },
    handelToggleGroupChatModel: (state, action) => {
      state.groupChatFormModel = !state.groupChatFormModel;
    },
    changeTheGroupName: (state, action) => {
      state.selectedChat = action.payload;
      let allChats = state.chats.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
      state.chats = allChats;
    },
  },
});

export const {
  handleSaveUser,
  handelSelectedChat,
  handelAddNewChat,
  handelAddChats,
  handelAddGroupChat,
  handelToggleGroupChatModel,
  changeTheGroupName,
} = chatSlice.actions;

export default chatSlice;
