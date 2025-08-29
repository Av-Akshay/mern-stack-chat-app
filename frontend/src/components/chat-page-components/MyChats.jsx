import React from "react";

import useMyChats from "../../hooks/useMyChats";
import {
  handelToggleGroupChatModel,
} from "../../store/slice";
import CreateGroupChat from "./mychats-component/CreateGroupChat";

// Helper function to format message time
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // Format as date for older messages
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const MyChats = () => {
  const {
    chats,
    dispatch,
    getSender,
    groupChatFormModel,
    handelFetchChats,
    loading,
    selectedChat,
    handleSelectChat,
    userInfo,
  } = useMyChats();

  return (
    <div className="w-full md:w-[35%] h-[90vh] overflow-auto bg-slate-100 rounded-md shadow-md">
      <div className="w-[95%] mx-auto my-5 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-medium text-slate-800">My Chats</h1>
        <button
          onClick={() => {
            dispatch(handelToggleGroupChatModel());
          }}
          className="text-sm md:text-base bg-slate-700 text-white px-3 py-2 w-auto md:w-2/5 rounded-md outline-none hover:bg-slate-600 transition-all duration-300 shadow-sm"
        >
          New Chat Group +
        </button>
        {groupChatFormModel && <CreateGroupChat />}
      </div>
      
      <div className="my-2 w-[95%] mx-auto flex flex-col justify-center gap-3">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-slate-500">Loading chats...</div>
          </div>
        ) : chats?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-slate-500">
            No chats available. Start a new conversation!
          </div>
        ) : (
          chats?.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                handleSelectChat(chat);
              }}
              className={`${
                selectedChat?._id === chat?._id
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              } p-3 h-full rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="capitalize font-medium truncate flex-1">
                  {!chat.isGroupChat ? getSender(userInfo, chat?.users) : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <span className={`text-xs ml-2 ${selectedChat?._id === chat?._id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatMessageTime(chat.latestMessage.createdAt || chat.updatedAt)}
                  </span>
                )}
              </div>
              {chat.latestMessage && (
                <div className={`text-xs truncate ${selectedChat?._id === chat?._id ? 'text-blue-100' : 'text-slate-500'}`}>
                  <span className="font-medium">
                    {chat.latestMessage.sender._id === userInfo?._id 
                      ? "You" 
                      : chat.latestMessage.sender.name}:
                  </span>{" "}
                  {chat.latestMessage.content}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyChats;
