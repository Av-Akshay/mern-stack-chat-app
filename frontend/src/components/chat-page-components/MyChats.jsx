import React, { useState } from "react";
import useFetchChats from "../../hooks/useFetchChats";
import { handelSelectedChat } from "../../store/slice";
import CreateGroupChat from "./mychats-component/CreateGroupChat";

const MyChats = () => {
  const [model, setModel] = useState(false);
  const { chats, dispatch, selectedChat, getSender } = useFetchChats();

  const handelPopupModel = () => {
    model ? setModel(false) : setModel(true);
  };

  return (
    <div className="w-[35%] h-full bg-slate-100 rounded-md">
      <div className="w-[95%] mx-auto my-2 flex items-center justify-between">
        <h1 className="text-2xl font-normal ">My Chats</h1>
        <button
          onClick={handelPopupModel}
          className="text-base bg-slate-200 text-black  px-3 py-1 w-2/5 rounded-md outline-none"
        >
          New Chat Group +
        </button>
        {model && <CreateGroupChat handelPopupModel={handelPopupModel} />}
      </div>
      <div className="my-2 w-[95%] mx-auto flex flex-col gap-5">
        {chats.map((chat, index) => {
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
              } p-2 rounded-md overflow-auto`}
            >
              <p className="capitalize">
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
