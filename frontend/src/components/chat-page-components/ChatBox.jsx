import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

import { ShowChatType } from "../index";
import useChatBox from "../../hooks/useChatBox";
import useMyChats from "../../hooks/useMyChats";
import MessageBox from "./chatBox-components/MessageBox";
import UserProfile from "./UserProfile";

const ChatBox = () => {
  const loginUser = useSelector(state => state.chatStore.user);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const { toggle, handelToggleChatTypePopup } = useChatBox();
  
  const {
    handelInputChange,
    modelSearch,
    register,
    handleSubmit,
    handelSendMessage,
    sendingMessage,
    chatMessages,
    messagesLoading,
    selectedChat,
    getSender,
    getSenderFull,
    handelChangeMessage,
    isTyping,
    userInfo
  } = useMyChats();

  // Memoize the profile handler to prevent unnecessary rerenders
  const handleOpenProfile = useCallback((userId) => {
    setSelectedUserId(userId);
    setShowProfile(true);
  }, []);
  
  // Memoize the close handler
  const handleCloseProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  // Memoize the sender full for selected chat
  const chatPartner = useMemo(() => {
    if (selectedChat && !selectedChat.isGroupChat && userInfo) {
      return getSenderFull(userInfo, selectedChat?.users);
    }
    return null;
  }, [selectedChat, getSenderFull, userInfo]);

  // Memoize the header click handler
  const handleHeaderClick = useCallback(() => {
    if (selectedChat && !selectedChat.isGroupChat && chatPartner) {
      handleOpenProfile(chatPartner._id);
    }
  }, [selectedChat, chatPartner, handleOpenProfile]);

  // Memoize the profile button click handler
  const handleProfileButtonClick = useCallback(() => {
    if (chatPartner) {
      handleOpenProfile(chatPartner._id);
    }
  }, [chatPartner, handleOpenProfile]);

  // Memo the form change handler to prevent recreating on each render
  const handleMessageChange = useCallback((e) => {
    handelChangeMessage(e);
  }, [handelChangeMessage]);

  // Memoize the chat header component
  const ChatHeader = memo(() => {
    if (!selectedChat) {
      return (
        <div className="w-full text-center text-slate-500">
          <p className="text-lg md:text-xl">Select a chat to start messaging</p>
        </div>
      );
    }

    return (
      <>
        <div 
          className="flex items-center cursor-pointer" 
          onClick={handleHeaderClick}
        >
          {selectedChat.isGroupChat ? (
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
              <span className="font-bold text-sm">
                {selectedChat.chatName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="relative mr-3">
              <img 
                src={chatPartner?.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  chatPartner?.isOnline 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
                } border-2 border-white`}
              ></span>
            </div>
          )}
          
          <div>
            <h1 className="text-lg md:text-xl font-medium capitalize text-slate-800 truncate max-w-[70%]">
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : getSender(userInfo, selectedChat?.users)}
            </h1>
            
            {!selectedChat.isGroupChat && (
              <p className="text-xs text-slate-500">
                {chatPartner?.isOnline 
                  ? 'Online' 
                  : 'Offline'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {!selectedChat.isGroupChat && (
            <button 
              onClick={handleProfileButtonClick}
              className="text-slate-700 hover:text-slate-900 transition-all p-2 rounded-full hover:bg-slate-200 mr-2"
            >
              <FaUser className="text-lg" />
            </button>
          )}
          
          <button 
            onClick={handelToggleChatTypePopup} 
            className="text-slate-700 hover:text-slate-900 transition-all p-2 rounded-full hover:bg-slate-200"
          >
            <IoEye className="text-xl md:text-2xl" />
          </button>
        </div>
      </>
    );
  });

  // Memoize the welcome message component
  const WelcomeMessage = memo(() => (
    <div className="bg-slate-200 h-[74vh] flex items-center justify-center rounded-lg">
      <div className="text-center p-5 bg-white rounded-lg shadow-sm max-w-md mx-auto">
        <h3 className="text-xl font-medium text-slate-800 mb-2">Welcome to Talk-A-Tive</h3>
        <p className="text-slate-600">Select a chat from the sidebar or search for users to start a conversation.</p>
      </div>
    </div>
  ));

  // Memoize the input form component
  const MessageForm = memo(({ onSubmit, register, isLoading, onChange }) => (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 h-[6vh] bg-white rounded-lg p-1 mt-1 shadow-sm"
    >
      <input
        name="message"
        className="w-full bg-transparent py-2 px-3 outline-none text-slate-800 placeholder-slate-400"
        type="text"
        placeholder="Type a message..."
        {...register("content", {
          required: "Message is required",
          onChange: onChange,
        })}
      />
 
      {isLoading ? (
        <span className="px-3 py-2 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
        </span>
      ) : (
        <button 
          type="submit" 
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
        >
          <IoMdSend />
        </button>
      )}
    </form>
  ));

  return (
    <div className="w-full md:w-[65%] h-full bg-slate-100 rounded-md p-2 shadow-md flex flex-col">
      <div className="h-[8vh] flex items-center justify-between w-[95%] mx-auto">
        <ChatHeader />
      </div>
      
      {toggle && <ShowChatType handelToggle={handelToggleChatTypePopup} />}

      {selectedChat ? (
        <div className="bg-slate-200 h-[74vh] px-2 rounded-lg z-0 flex flex-col shadow-inner">
          <MessageBox 
            isTyping={isTyping} 
            chatMessages={chatMessages}
            isLoading={messagesLoading}
            onUserClick={handleOpenProfile}
          />
          <MessageForm 
            onSubmit={handleSubmit(handelSendMessage)}
            register={register}
            isLoading={sendingMessage}
            onChange={handleMessageChange}
          />
        </div>
      ) : (
        <WelcomeMessage />
      )}
      
      {/* User Profile Modal */}
      <UserProfile 
        userId={selectedUserId}
        isOpen={showProfile}
        onClose={handleCloseProfile}
      />
    </div>
  );
};

export default memo(ChatBox);
