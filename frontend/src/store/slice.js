import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat App",
  initialState: {
    selectedChat: null,
    chats: [],
    groupChatFormModel: false,
    user: null,
    notifiaction: [],
    fetchUsersChats : false
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
    addNotifiation: (state, action) => {
      state.notifiaction = [...state.notifiaction, action.payload];
    },
    clearNotification: (state, action) => {
      // Remove notification by chatId
      state.notifiaction = state.notifiaction.filter(
        notification => notification.chatId._id !== action.payload
      );
    },
    handelFetchUsersChat :(state,action)=>{
      state.fetchChats = state.fetchChats? false:true;
    }
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
  addNotifiation,
  clearNotification,
  handelFetchUsersChat
} = chatSlice.actions;

export default chatSlice;
