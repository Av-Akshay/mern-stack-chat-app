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

// Move MessageForm outside to prevent recreation on every render
const MessageForm = memo(({ onSubmit, register, isLoading, onChange }) => (
  <form
    onSubmit={onSubmit}
    className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-200"
    autoComplete="off"
  >
    <input
      name="message"
      className="w-full bg-transparent py-3 px-4 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
      type="text"
      placeholder="Type your message..."
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      {...register("content", {
        required: "Message is required",
        onChange: onChange,
      })}
    />
 
    {isLoading ? (
      <span className="px-3 py-2 text-slate-500 dark:text-slate-400 font-medium">
        <div className="w-5 h-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </span>
    ) : (
      <button 
        type="submit" 
        className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all transform hover:scale-105 shadow-md"
      >
        <IoMdSend className="w-5 h-5" />
      </button>
    )}
  </form>
));

MessageForm.displayName = 'MessageForm';

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
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-full">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Select a chat to start messaging</p>
          </div>
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
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-md"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  chatPartner?.isOnline 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
                } ring-2 ring-white dark:ring-slate-700 shadow-sm`}
              ></span>
            </div>
          )}
          
          <div>
            <h1 className="text-base md:text-lg font-semibold capitalize text-slate-800 dark:text-slate-100 truncate max-w-[70%]">
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : getSender(userInfo, selectedChat?.users)}
            </h1>
            
            {!selectedChat.isGroupChat && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {chatPartner?.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
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
              className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 mr-2"
            >
              <FaUser className="text-lg" />
            </button>
          )}
          
          <button 
            onClick={handelToggleChatTypePopup} 
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <IoEye className="text-xl md:text-2xl" />
          </button>
        </div>
      </>
    );
  });

  // Memoize the welcome message component
  const WelcomeMessage = memo(() => (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-[74vh] flex items-center justify-center rounded-2xl">
      <div className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md mx-auto border border-gray-200 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Welcome to Talk-A-Tive</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Select a chat from the sidebar or search for users to start a conversation.</p>
      </div>
    </div>
  ));

  return (
    <div className="w-full md:w-[65%] h-full bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-xl border border-gray-200 dark:border-slate-800 flex flex-col">
      <div className="h-[8vh] flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-800">
        <ChatHeader />
      </div>
      
      {toggle && <ShowChatType handelToggle={handelToggleChatTypePopup} />}

      {selectedChat ? (
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 h-[74vh] rounded-xl z-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MessageBox 
              isTyping={isTyping} 
              chatMessages={chatMessages}
              isLoading={messagesLoading}
              onUserClick={handleOpenProfile}
            />
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <MessageForm 
              onSubmit={handleSubmit(handelSendMessage)}
              register={register}
              isLoading={sendingMessage}
              onChange={handleMessageChange}
            />
          </div>
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
