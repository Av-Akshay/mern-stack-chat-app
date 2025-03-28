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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-white hover:text-slate-300 px-2 py-2 transition-all"
      >
        <IoNotifications className="text-2xl" />
        {notifiaction.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifiaction.length}
          </span>
        )}
      </button>

      {isOpen && notifiaction.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 py-1 text-black max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 font-semibold">
            Notifications
          </div>
          {notifiaction.map((notif, index) => (
            <div 
              key={index} 
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
              onClick={() => handleNotificationClick(notif)}
            >
              <p className="text-sm">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge; 