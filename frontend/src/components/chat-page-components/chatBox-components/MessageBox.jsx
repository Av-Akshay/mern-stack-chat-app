import React, { useCallback, useEffect, useRef, memo, useState } from "react";
import useMyChats from "../../../hooks/useMyChats";
import Lottie from 'react-lottie';
import animationData from "../../../animation/animation.json";
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const MessageBox = ({ chatMessages, isTyping, isLoading, onUserClick }) => {
  const { userInfo } = useMyChats();
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  
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
    const shouldAutoScroll = !chatMessages || 
                            chatMessages.length === 0 || 
                            prevMessagesLengthRef.current === 0 ||
                            chatMessages.length > prevMessagesLengthRef.current ||
                            isTyping;
                            
    if (shouldAutoScroll) {
      scrollToBottom();
    }
    
    if (chatMessages) {
      prevMessagesLengthRef.current = chatMessages.length;
    }
  }, [chatMessages, isTyping, scrollToBottom]);

  // Enhanced time formatting with relative times
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Today: show time only
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Yesterday
    if (diffDays === 1) {
      return 'Yesterday';
    }
    // Within a week: show day name
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Older: show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, []);

  // Format date for separators
  const formatDateSeparator = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }, []);

  // Check if we should show date separator
  const shouldShowDateSeparator = useCallback((currentMsg, prevMsg) => {
    if (!currentMsg || !currentMsg.createdAt) return false;
    if (!prevMsg || !prevMsg.createdAt) return true;
    
    const currentDate = new Date(currentMsg.createdAt);
    const prevDate = new Date(prevMsg.createdAt);
    
    return currentDate.toDateString() !== prevDate.toDateString();
  }, []);

  // Check if messages are from same sender and within 5 minutes
  const isMessageGrouped = useCallback((currentMsg, prevMsg) => {
    if (!prevMsg || !currentMsg) return false;
    if (!currentMsg.sender || !prevMsg.sender) return false;
    
    const isSameSender = currentMsg.sender._id === prevMsg.sender._id;
    const currentTime = new Date(currentMsg.createdAt);
    const prevTime = new Date(prevMsg.createdAt);
    const timeDiff = currentTime - prevTime;
    
    return isSameSender && timeDiff < 5 * 60 * 1000; // 5 minutes
  }, []);

  const handleUserClick = useCallback((userId) => {
    if (onUserClick) onUserClick(userId);
  }, [onUserClick]);

  // Modern empty state
  const EmptyMessages = memo(() => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No messages yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Start the conversation by sending a message!</p>
      </div>
    </div>
  ));

  // Modern typing indicator
  const TypingIndicator = memo(() => (
    <div className="flex items-start px-4 py-2 animate-fadeIn">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">typing...</span>
        </div>
      </div>
    </div>
  ));

  // Modern loading state
  const LoadingMessages = memo(() => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">Loading messages...</p>
    </div>
  ));

  // Date separator component
  const DateSeparator = memo(({ date }) => (
    <div className="flex items-center justify-center my-6 px-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      <span className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 rounded-full">
        {formatDateSeparator(date)}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
    </div>
  ));

  // Render messages with modern design
  const renderMessages = useCallback(() => {
    if (isLoading) {
      return <LoadingMessages />;
    }
    
    if (!chatMessages || chatMessages.length === 0) {
      return <EmptyMessages />;
    }

    // Filter out invalid messages first
    const validMessages = chatMessages.filter(msg => msg && msg.sender && msg._id);
    
    return validMessages.map((message, index) => {
      const isSender = message.sender._id === userInfo?._id;
      const prevMessage = index > 0 ? validMessages[index - 1] : null;
      const nextMessage = index < validMessages.length - 1 ? validMessages[index + 1] : null;
      const isGrouped = isMessageGrouped(message, prevMessage);
      const isLastInGroup = !isMessageGrouped(nextMessage, message);
      const showDateSep = shouldShowDateSeparator(message, prevMessage);
      
      return (
        <React.Fragment key={message._id}>
          {showDateSep && <DateSeparator date={message.createdAt} />}
          
          <div
            className={`w-full flex ${isSender ? "justify-end" : "justify-start"} 
              ${isGrouped ? 'mt-0.5' : 'mt-4'} px-4 group transition-all duration-200`}
            onMouseEnter={() => setHoveredMessage(message._id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            {/* Avatar for received messages */}
            {!isSender && (
              <div className={`mr-2 ${isGrouped ? 'w-10' : ''}`}>
                {!isGrouped && (
                  <div 
                    className="relative cursor-pointer transform transition-transform hover:scale-110"
                    onClick={() => handleUserClick(message.sender._id)}
                  >
                    <img 
                      src={message.sender.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                      alt={message.sender.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                    />
                    {message.sender.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Message content */}
            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[70%] md:max-w-[60%]`}>
              {/* Sender name for received messages */}
              {!isSender && !isGrouped && (
                <span 
                  className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ml-3 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => handleUserClick(message.sender._id)}
                >
                  {message.sender.name}
                </span>
              )}
              
              {/* Message bubble */}
              <div className={`relative group`}>
                <div 
                  className={`
                    relative px-4 py-2.5 shadow-sm transition-all duration-200
                    ${isSender 
                      ? `bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white
                         ${isGrouped ? 'rounded-2xl' : 'rounded-2xl rounded-tr-md'}
                         ${isLastInGroup ? 'rounded-br-md' : ''}
                         hover:shadow-lg hover:from-blue-600 hover:to-blue-700`
                      : `bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100
                         ${isGrouped ? 'rounded-2xl' : 'rounded-2xl rounded-tl-md'}
                         ${isLastInGroup ? 'rounded-bl-md' : ''}
                         hover:shadow-md border border-gray-100 dark:border-slate-600`
                    }
                  `}
                >
                  {/* Message text */}
                  <p className="text-sm leading-relaxed break-words">
                    {message.content}
                  </p>
                  
                  {/* Time and status */}
                  <div className={`flex items-center gap-1 mt-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs ${
                      isSender ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </span>
                    {isSender && (
                      <span className="text-blue-100">
                        {message.read ? <FaCheckDouble className="w-3 h-3" /> : <FaCheck className="w-3 h-3" />}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Message options (visible on hover) */}
                {hoveredMessage === message._id && (
                  <div className={`absolute top-0 ${isSender ? 'right-full mr-2' : 'left-full ml-2'} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    <button className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                      <BsThreeDots className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Avatar for sent messages */}
            {isSender && (
              <div className={`ml-2 ${isGrouped ? 'w-10' : ''}`}>
                {!isGrouped && (
                  <div className="relative transform transition-transform hover:scale-110">
                    <img 
                      src={message.sender.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                      alt={message.sender.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      );
    });
  }, [chatMessages, userInfo?._id, handleUserClick, formatTime, formatDateSeparator, 
      shouldShowDateSeparator, isMessageGrouped, hoveredMessage, EmptyMessages, isLoading, LoadingMessages]);

  return (
    <div 
      ref={messagesEndRef} 
      className="w-full h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 
        dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 
        dark:hover:scrollbar-thumb-gray-500 transition-colors"
    >
      <div className="flex-1">
        {renderMessages()}
      </div>
      
      {isTyping && <TypingIndicator />}
      
      {/* Scroll to bottom button (shown when scrolled up) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default memo(MessageBox);