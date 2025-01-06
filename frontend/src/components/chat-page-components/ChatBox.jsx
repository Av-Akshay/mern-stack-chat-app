import React, { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";

import { ShowChatType } from "../index";
import useChatBox from "../../hooks/useChatBox";
import useMyChats from "../../hooks/useMyChats";
import MessageBox from "./chatBox-components/MessageBox";

const ChatBox = () => {
  const [loginUser, setLoginUser] = useState(null);
  const { toggle, handelToggleChatTypePopup } = useChatBox();
  const {
    handelInputChange,
    modelSearch,
    register,
    handleSubmit,
    handelSendMessage,
    sendingMessage,
    chatMessages,
    selectedChat,
  } = useMyChats();

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("userInfo"));
    if (localStorageData) {
      setLoginUser(localStorageData);
    }
  }, []);

  return (
    <div className="w-[65%] h-full bg-slate-100 rounded-md p-2">
      <div className="h-[8vh] flex items-center justify-between w-[95%] mx-auto">
        <h1 className="text-xl font-medium capitalize">
          {selectedChat?.isGroupChat
            ? selectedChat?.chatName
            : selectedChat?.chatName}
        </h1>
        <IoEye onClick={handelToggleChatTypePopup} className="text-2xl" />
      </div>
      {toggle ? <ShowChatType handelToggle={handelToggleChatTypePopup} /> : ""}

      <div className=" bg-slate-300 h-[74vh] px-2 rounded-lg z-0">
        <MessageBox chatMessages={chatMessages} />
        <form
          onSubmit={handleSubmit(handelSendMessage)}
          className="flex items-center gap-2 h-[6vh]"
        >
          <input
            name="message"
            className="w-full bg-transparent py-2 outline-none"
            type="text"
            placeholder="Send a message"
            {...register("content", {
              required: "Message is required",
            })}
          />

          {sendingMessage ? (
            <span className="btn bg-transparent font-medium ">Sending...</span>
          ) : (
            <button type="submit" className="btn bg-transparent font-medium ">
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
