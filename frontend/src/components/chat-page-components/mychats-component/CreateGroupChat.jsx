import React, { useEffect, useState } from "react";
import useGetChats from "../../../hooks/useGetChats";
import UsersChats from "../navbar-component/slider-component/UsersChats";
import useCreateGroupChat from "../../../hooks/useCreateGroupChat";

const CreateGroupChat = ({ handelPopupModel }) => {
  const initialValue = {
    chatName: "",
    chats: "",
  };
  const {
    handelAddToGroup,
    handelCreateGroupChat,
    selectToGroupChat,
    modelSearch,
    handelInputChange,
    handelRemoveSelectedUser,
  } = useCreateGroupChat();

  const { submitForm, userChat } = useGetChats();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      submitForm(modelSearch);
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [modelSearch]);
  return (
    <div className="absolute top-0 left-0 h-screen w-full bg-[rgba(0,0,0,0.8)] flex items-center justify-center">
      <div className=" w-[50%] bg-white p-14 relative rounded-lg flex flex-col gap-3 items-center justify-center">
        <h1 className="text-2xl font-medium m-0">Create Group Chat</h1>

        {/* close button */}
        <button
          onClick={handelPopupModel}
          className="absolute top-5 right-5 text-xl font-medium"
        >
          X
        </button>

        {/* added users to group chat */}
        <div className={" w-full overflow-x-auto"}>
          <div className="flex gap-1">
            {selectToGroupChat?.map((item) => {
              return (
                <div
                  key={item._id}
                  className="bg-violet-500 inline-block px-5 py-1 rounded-md relative "
                >
                  {item.name}
                  <button
                    onClick={() => {
                      handelRemoveSelectedUser(item._id);
                    }}
                    className="absolute -top-1 right-1 border-none outline-none bg-transparent ml-1"
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {/* chat name form */}
        <form className="w-3/4">
          <input
            name="name"
            value={modelSearch?.name}
            onChange={(e) => {
              handelInputChange(e);
            }}
            type="text"
            placeholder="Chat Name"
            className="border-2 border-black px-2 py-1 rounded-md w-full"
          />
        </form>

        {/* selected users for chat */}
        <form className="relative w-3/4">
          <input
            name="users"
            value={modelSearch?.users}
            onChange={(e) => {
              handelInputChange(e);
            }}
            type="text"
            placeholder="Add User eg. Akshay "
            className="border-2 border-black px-2 py-1 rounded-md w-full"
          />
          <div
            className={`${
              userChat.length > 0
                ? "bg-white top-[5.2rem] mt-1 w-full h-[32vh] rounded-md overflow-auto flex flex-col gap-2 z-10 "
                : "hidden"
            }`}
          >
            {userChat?.map((item, index) => {
              return (
                <UsersChats
                  key={item._id}
                  handelAddToGroup={handelAddToGroup}
                  item={item}
                />
              );
            })}
          </div>
        </form>

        {/* create group chat */}
        <button
          onClick={handelCreateGroupChat}
          className="w-full rounded-md font-medium px-3 py-1 bg-blue-500 text-white "
        >
          create Group Chat
        </button>
      </div>
    </div>
  );
};

export default CreateGroupChat;
