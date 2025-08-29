import React from "react";

import useMyChats from "../../hooks/useMyChats";
import {
  handelToggleGroupChatModel,
} from "../../store/slice";
import CreateGroupChat from "./mychats-component/CreateGroupChat";

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
              <p className="capitalize h-full font-medium">
                {!chat.isGroupChat ? getSender(userInfo, chat?.users) : chat.chatName}
              </p>
              {chat.latestMessage && (
                <p className={`text-xs truncate mt-1 ${selectedChat?._id === chat?._id ? 'text-blue-100' : 'text-slate-500'}`}>
                  <span className="font-medium">
                    {chat.latestMessage.sender.name}:
                  </span>{" "}
                  {chat.latestMessage.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyChats;
