import React, { useState } from "react";
import chatBackground from "../assets/images/chatAppBackground.avif";
import MyChats from "../components/chat-page-components/MyChats";
import ChatBox from "../components/chat-page-components/ChatBox";
import Navbar from "../components/chat-page-components/Navbar";
import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";

const ChatPage = () => {
  const [showChatList, setShowChatList] = useState(true);
  const { selectedChat } = useSelector((store) => store.chatStore);
  
  // Initialize socket connection
  const socket = useSocket();

  // On mobile, when a chat is selected, switch to chat view
  React.useEffect(() => {
    if (selectedChat && window.innerWidth < 768) {
      setShowChatList(false);
    }
  }, [selectedChat]);

  return (
    <div
      style={{
        backgroundImage: ` url(${chatBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full h-screen"
    >
      <Navbar toggleChatList={() => setShowChatList(!showChatList)} isMobile={window.innerWidth < 768} />
      
      {/* Desktop layout */}
      <div className="hidden md:flex w-full items-start gap-2 h-[90vh]">
        <MyChats />
        <ChatBox />
      </div>
      
      {/* Mobile layout */}
      <div className="md:hidden w-full h-[90vh]">
        {showChatList || !selectedChat ? (
          <MyChats />
        ) : (
          <div className="relative h-full">
            <button 
              onClick={() => setShowChatList(true)}
              className="absolute top-2 left-2 z-10 bg-gray-700 text-white p-2 rounded-full shadow-lg"
            >
              ←
            </button>
            <ChatBox />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
