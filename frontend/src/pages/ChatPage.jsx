import React from "react";
import chatBackground from "../assets/images/chatAppBackground.avif";
import MyChats from "../components/chat-page-components/MyChats";
import ChatBox from "../components/chat-page-components/ChatBox";
import Navbar from "../components/chat-page-components/Navbar";

const ChatPage = () => {
  return (
    <div
      style={{
        backgroundImage: ` url(${chatBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" w-full h-screen"
    >
      <Navbar />
      <div className="w-full flex items-center gap-2 h-[90vh]">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
