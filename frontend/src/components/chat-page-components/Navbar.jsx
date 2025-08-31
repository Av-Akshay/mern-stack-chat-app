import React, { useState, useEffect, useRef } from "react";
import chatBackground from "../../assets/images/chatAppBackground.avif";
import Slider from "./navbar-component/Slider";
import DropDown from "./navbar-component/DropDown";
import Popup from "./navbar-component/Popup";
import NotificationBadge from "./navbar-component/NotificationBadge";
import ThemeToggle from "../../helper/ThemeToggle";
import useMyChats from "../../hooks/useMyChats";
import useLogout from "../../hooks/useLogout";
import { useSelector } from "react-redux";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = ({ toggleChatList, isMobile }) => {
  const [dropDown, setDropDown] = useState(false);
  const [popup, setPopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { selectedChat, user } = useSelector((store) => store.chatStore);
  const { logout, isLoading: isLoggingOut } = useLogout();
  
  const {
    sliderIsOpen,
    handelCloseSlider,
    handelOpenSlider,
    handelAccessChat,
  } = useMyChats();

  const handleMouseLeave = () => {
    setDropDown(false);
  };
  const handleMouseEnter = () => {
    setDropDown(true);
  };
  const handelShowPopup = () => {
    setPopup(true);
  };

  const handelClosePopup = () => {
    setPopup(false);
  };
  
  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };
  
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowLogoutConfirm(false);
      }
    };
    
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileMenu]);
  
  return (
    <>
      <div className="h-[10vh] flex items-center justify-center bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm">
        <Slider
          handelAccessChat={handelAccessChat}
          slider={sliderIsOpen}
          closeSlider={handelCloseSlider}
        />
        <div className="w-full px-3 sm:px-6 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {isMobile && selectedChat && !sliderIsOpen && (
              <button
                onClick={toggleChatList}
                className="text-white bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <button
              onClick={handelOpenSlider}
              className="flex items-center gap-2 border border-gray-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 sm:px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search User</span>
              <span className="sm:hidden">Search</span>
            </button>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white text-lg md:text-xl font-medium">Talk-A-Tive</h1>
          </div>
          <div className="relative flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <NotificationBadge />
            
            {/* User Profile & Logout Section */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white px-2 sm:px-3 py-2 transition-all"
              >
                {user?.pic ? (
                  <img
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                    src={user.pic}
                    alt="user"
                  />
                ) : (
                  <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="hidden sm:block text-sm md:text-base font-medium">
                  {user?.name?.split(' ')[0] || 'Profile'}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-slate-700">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    
                    {showLogoutConfirm ? (
                      <div className="px-4 py-2">
                        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">Are you sure?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded"
                            disabled={isLoggingOut}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex-1 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut ? 'Logging out...' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {popup && <Popup handelClosePopup={handelClosePopup} />} */}
    </>
  );
};

export default Navbar;
