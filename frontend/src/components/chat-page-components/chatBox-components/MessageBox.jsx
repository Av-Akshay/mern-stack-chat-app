import React, { useCallback, useEffect, useRef, memo } from "react";
import useMyChats from "../../../hooks/useMyChats";
import Lottie from 'react-lottie';
import animationData from "../../../animation/animation.json"

const MessageBox = ({ chatMessages, isTyping, isLoading, onUserClick }) => {
  const { userInfo } = useMyChats();
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, []);

  // Only scroll when messages change or typing status changes
  useEffect(() => {
    // Only auto-scroll if new messages were added or if the first messages load
    const shouldAutoScroll = !chatMessages || 
                            chatMessages.length === 0 || 
                            prevMessagesLengthRef.current === 0 ||
                            chatMessages.length > prevMessagesLengthRef.current ||
                            isTyping;
                            
    if (shouldAutoScroll) {
      scrollToBottom();
    }
    
    // Update the reference for next comparison
    if (chatMessages) {
      prevMessagesLengthRef.current = chatMessages.length;
    }
  }, [chatMessages, isTyping, scrollToBottom]);

  // Memoize formatTime function to prevent recreating it on each render
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Handle user click with proper callback
  const handleUserClick = useCallback((userId) => {
    if (onUserClick) onUserClick(userId);
  }, [onUserClick]);

  // Memoize the empty messages view
  const EmptyMessages = memo(() => (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
    </div>
  ));

  // Memoize the typing indicator
  const TypingIndicator = memo(() => (
    <div className="flex items-start">
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  ));

  // Loading component
  const LoadingMessages = memo(() => (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm font-medium">Loading messages...</p>
        </div>
      </div>
      
      {/* Skeleton messages for better UX */}
      <div className="w-full mt-6 space-y-3 px-3">
        <div className="flex justify-start">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse mr-2"></div>
          <div className="bg-white p-3 rounded-lg shadow-sm w-[60%]">
            <div className="h-3 bg-slate-200 rounded animate-pulse mb-2 w-16"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mt-1"></div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="bg-blue-100 p-3 rounded-lg shadow-sm w-[60%]">
            <div className="h-4 bg-blue-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-blue-200 rounded animate-pulse w-2/3 mt-1"></div>
          </div>
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse ml-2"></div>
        </div>
        
        <div className="flex justify-start">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse mr-2"></div>
          <div className="bg-white p-3 rounded-lg shadow-sm w-[50%]">
            <div className="h-3 bg-slate-200 rounded animate-pulse mb-2 w-16"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Prevent unnecessary message renders
  const renderMessages = useCallback(() => {
    if (isLoading) {
      return <LoadingMessages />;
    }
    
    if (!chatMessages || chatMessages.length === 0) {
      return <EmptyMessages />;
    }

    return chatMessages.map((message) => {
      const isSender = message?.sender?._id === userInfo?._id;
      return (
        <div
          key={message._id}
          className={`w-full flex ${
            isSender ? "justify-end" : "justify-start"
          } mb-2 items-end`}
        >
          {!isSender && (
            <div 
              className="mr-2 cursor-pointer"
              onClick={() => handleUserClick(message.sender._id)}
            >
              <div className="relative">
                <img 
                  src={message.sender.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                  alt={message.sender.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                {message.sender.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                )}
              </div>
            </div>
          )}
          
          <div 
            className={`max-w-[70%] p-3 shadow-sm rounded-lg ${
              isSender
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-white text-slate-800 rounded-bl-none"
            }`}
          >
            {!isSender && (
              <p 
                className="text-xs font-semibold mb-1 cursor-pointer hover:underline"
                onClick={() => handleUserClick(message.sender._id)}
              >
                {message.sender.name}
              </p>
            )}
            <p>{message.content}</p>
            <p className={`text-xs text-right mt-1 ${
              isSender ? "text-blue-100" : "text-slate-400"
            }`}>
              {formatTime(message.createdAt)}
            </p>
          </div>
          
          {isSender && (
            <div 
              className="ml-2 cursor-pointer"
              onClick={() => handleUserClick(message.sender._id)}
            >
              <div className="relative">
                <img 
                  src={message.sender.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                  alt={message.sender.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              </div>
            </div>
          )}
        </div>
      );
    });
  }, [chatMessages, userInfo?._id, handleUserClick, formatTime, EmptyMessages, isLoading, LoadingMessages]);

  return (
    <div 
      ref={messagesEndRef} 
      className="w-full h-full flex flex-col gap-2 p-3 overflow-y-auto"
    >
      {renderMessages()}
      
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default memo(MessageBox);
