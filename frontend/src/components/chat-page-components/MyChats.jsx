import React from "react";

import useGetAllChats from "../../hooks/useGetAllChats";
import useFetchChats from "../../hooks/useFetchChats";
import {
  handelSelectedChat,
  handelToggleGroupChatModel,
} from "../../store/slice";
import CreateGroupChat from "./mychats-component/CreateGroupChat";

const MyChats = () => {
  const { groupChatFormModel, dispatch, selectedChat, getSender } =
    useFetchChats();
  const { chats } = useGetAllChats();

  return (
    <div className="w-[35%] h-[90vh] overflow-auto bg-slate-100 rounded-md">
      <div className="w-[95%] mx-auto my-5 flex items-center justify-between">
        <h1 className="text-2xl font-normal ">My Chats</h1>
        <button
          onClick={() => {
            dispatch(handelToggleGroupChatModel());
          }}
          className="text-base bg-slate-200 text-black  px-3 py-1 w-2/5 rounded-md outline-none"
        >
          New Chat Group +
        </button>
        {groupChatFormModel && <CreateGroupChat />}
      </div>
      <div className="my-2 w-[95%]  mx-auto flex flex-col justify-center gap-5">
        {chats?.map((chat, index) => {
          return (
            <div
              key={chat._id}
              onClick={() => {
                dispatch(handelSelectedChat(chat));
              }}
              className={`${
                selectedChat._id === chat._id
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-black"
              } p-2 h-full rounded-md overflow-auto`}
            >
              <p className="capitalize h-full">
                {!chat.isGroupChat ? getSender(chat?.users) : chat.chatName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyChats;
