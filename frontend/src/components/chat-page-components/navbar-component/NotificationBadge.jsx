import React, { useState, useEffect, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import { useSelector } from "react-redux";
import useMyChats from "../../../hooks/useMyChats";

const NotificationBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifiaction, chats } = useSelector((store) => store.chatStore);
  const { handleSelectChat } = useMyChats();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    // Find the chat from notification and set as selected chat
    const chat = chats.find(c => c._id === notification.chatId._id);
    if (chat) {
      handleSelectChat(chat);
    }
    setIsOpen(false);
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-white hover:text-slate-300 px-2 py-2 transition-all duration-300"
        aria-label="Notifications"
      >
        <IoNotifications className="text-xl md:text-2xl" />
        {notifiaction.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifiaction.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 py-1 text-black max-h-96 overflow-y-auto transition-all duration-300 transform origin-top-right">
          <div className="p-3 border-b border-gray-200 font-semibold text-slate-800 flex justify-between items-center">
            <span>Notifications</span>
            {notifiaction.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifiaction.length} new
              </span>
            )}
          </div>
          
          {notifiaction.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              No new notifications
            </div>
          ) : (
            notifiaction.map((notif, index) => (
              <div 
                key={index} 
                className="p-3 hover:bg-slate-100 cursor-pointer border-b border-gray-100 transition-colors duration-200"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    {notif.sender.pic ? (
                      <img src={notif.sender.pic} alt={notif.sender.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-xs font-medium">
                        {notif.sender.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="font-semibold">
                        {notif.sender.name}
                      </span>
                      {' '}sent a message in{' '}
                      <span className="font-semibold">
                        {notif.chatId.isGroupChat 
                          ? notif.chatId.chatName 
                          : "your chat"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge; 