import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat App",
  initialState: {
    selectedChat: null,
    chats: [],
    groupChatFormModel: false,
    user: null,
    notifiaction: [],
    fetchUsersChats: false,
    onlineUsers: {},
    chatProfiles: {},
    messagesFetched: {}, // Track which chats have had messages fetched
    lastProfileFetch: {}, // Track when profiles were last fetched
  },
  reducers: {
    handleSaveUser: (state, action) => {
      state.user = action.payload;
    },
    handelSelectedChat: (state, action) => {
      // Only update if the chat has actually changed
      if (!state.selectedChat || state.selectedChat._id !== action.payload?._id) {
        state.selectedChat = action?.payload;
      }
    },
    handelAddNewChat: (state, action) => {
      // Check if the chat already exists to prevent duplicates
      const exists = state.chats.some(chat => chat._id === action.payload._id);
      if (!exists) {
        state.chats.push(action.payload);
      }
    },
    handelAddChats: (state, action) => {
      state.chats = action.payload;
    },
    handelAddGroupChat: (state, action) => {
      // Check if the group chat already exists
      const exists = state.chats.some(chat => chat._id === action.payload._id);
      if (!exists) {
        state.chats.push(action.payload);
      }
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
      // Check for duplicates
      const exists = state.notifiaction.some(n => 
        n.chatId && action.payload.chatId && n.chatId._id === action.payload.chatId._id
      );
      if (!exists) {
        state.notifiaction = [...state.notifiaction, action.payload];
      }
    },
    clearNotification: (state, action) => {
      // Remove notification by chatId
      state.notifiaction = state.notifiaction.filter(
        notification => notification.chatId._id !== action.payload
      );
    },
    handelFetchUsersChat: (state, action) => {
      state.fetchChats = state.fetchChats ? false : true;
    },
    // New reducers for user profiles and online status
    updateUserOnlineStatus: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;
      
      // Only update if status changed
      if (state.onlineUsers[userId] !== isOnline) {
        state.onlineUsers = {
          ...state.onlineUsers,
          [userId]: isOnline
        };
        
        // Update cached profile if exists
        if (state.chatProfiles[userId]) {
          state.chatProfiles[userId] = {
            ...state.chatProfiles[userId],
            isOnline,
            ...(lastSeen && { lastSeen })
          };
        }
        
        // Also update in chats if user is part of any chat
        state.chats = state.chats.map(chat => {
          if (chat.users.some(user => user._id === userId)) {
            return {
              ...chat,
              users: chat.users.map(user => 
                user._id === userId 
                  ? { ...user, isOnline, ...(lastSeen && { lastSeen }) } 
                  : user
              )
            };
          }
          return chat;
        });
        
        // Update in selectedChat if present
        if (state.selectedChat && state.selectedChat.users.some(user => user._id === userId)) {
          state.selectedChat = {
            ...state.selectedChat,
            users: state.selectedChat.users.map(user => 
              user._id === userId 
                ? { ...user, isOnline, ...(lastSeen && { lastSeen }) } 
                : user
            )
          };
        }
      }
    },
    // Add user profile to cache
    addUserProfile: (state, action) => {
      const { userId, profile } = action.payload;
      
      // Record fetch time for cache freshness
      state.lastProfileFetch[userId] = Date.now();
      
      // Add profile to cache
      state.chatProfiles[userId] = profile;
      
      // If this is the current user, update user info
      if (state.user && state.user._id === userId) {
        state.user = { ...state.user, ...profile };
      }
    },
    // Update user profile
    updateUserProfile: (state, action) => {
      const updatedProfile = action.payload;
      
      // Update main user object
      state.user = { ...state.user, ...updatedProfile };
      
      // Also update in cached profiles
      if (state.user && state.chatProfiles[state.user._id]) {
        state.chatProfiles[state.user._id] = {
          ...state.chatProfiles[state.user._id],
          ...updatedProfile
        };
      }
    },
    // Mark a chat as having its messages fetched
    markMessagesFetched: (state, action) => {
      const chatId = action.payload;
      state.messagesFetched[chatId] = true;
    },
    // Check if a profile needs refresh (older than 5 minutes)
    refreshProfileIfNeeded: (state, action) => {
      const userId = action.payload;
      const lastFetch = state.lastProfileFetch[userId];
      const fiveMinutes = 5 * 60 * 1000;
      
      if (!lastFetch || (Date.now() - lastFetch > fiveMinutes)) {
        // Profile needs refresh
        return true;
      }
      return false;
    },
    // Logout - clear all state
    handleLogout: (state) => {
      state.selectedChat = null;
      state.chats = [];
      state.groupChatFormModel = false;
      state.user = null;
      state.notifiaction = [];
      state.fetchUsersChats = false;
      state.onlineUsers = {};
      state.chatProfiles = {};
      state.messagesFetched = {};
      state.lastProfileFetch = {};
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
  handelFetchUsersChat,
  updateUserOnlineStatus,
  addUserProfile,
  updateUserProfile,
  markMessagesFetched,
  refreshProfileIfNeeded,
  handleLogout
} = chatSlice.actions;

export default chatSlice;
