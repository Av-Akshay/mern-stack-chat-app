import React, { useState } from "react";

import UsersChats from "../navbar-component/slider-component/UsersChats";
import useChatBox from "../../../hooks/useChatBox";
import useMyChats from "../../../hooks/useMyChats";

const ShowChatType = ({ handelToggle }) => {
  const {
    selectedChat,
    setUpdateGroupChat,
    initialValue,
    handelChangeTheGroupName,
    userChat,
    handelAddToGroup,
    isAddingMember,
    addMemberMessage,
  } = useChatBox();
  
  const { userInfo, getSenderFull } = useMyChats();
  const [searchDisabled, setSearchDisabled] = useState(false);

  return (
    <div
      className={`${
        selectedChat &&
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      }`}
    >
      {selectedChat && (
        <div className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={handelToggle}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-lg w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          {selectedChat?.isGroupChat ? (
            <div className="w-full h-full overflow-auto p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800 mt-8 sm:mt-0">Group Chat Information</h2>
              
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                {/* Group Name Section */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Group Name</h3>
                  <p className="text-lg sm:text-xl text-gray-900 break-words">{selectedChat?.chatName}</p>
                </div>
                
                {/* Group Members Section */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Group Members ({selectedChat?.users?.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {selectedChat?.users?.map((item) => {
                      const isCurrentUser = item._id === userInfo?._id;
                      return (
                        <div
                          key={item._id}
                          className="flex items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200"
                        >
                          <img 
                            src={item.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                            alt={item.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base text-gray-800 truncate">
                              {item.name} {isCurrentUser && <span className="text-xs text-blue-500">(You)</span>}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{item.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Group Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Change Group Name</h3>
                    <form
                      className="flex flex-col gap-2 sm:gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handelChangeTheGroupName(selectedChat._id);
                      }}
                    >
                      <input
                        onChange={(e) => {
                          setUpdateGroupChat(() => {
                            return {
                              ...initialValue,
                              groupName: e.target.value,
                            };
                          });
                        }}
                        type="text"
                        placeholder="Enter New Name"
                        className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-600 transition-all"
                        type="submit"
                      >
                        Update Name
                      </button>
                    </form>
                  </div>
                  
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Add New Member</h3>
                    
                    {/* Notification Messages */}
                    {addMemberMessage && (
                      <div className={`mb-3 p-3 rounded-md text-sm font-medium animate-fadeIn ${
                        addMemberMessage.type === 'success' 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : addMemberMessage.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        {addMemberMessage.text}
                      </div>
                    )}
                    
                    <input
                      name="chats"
                      type="text"
                      onChange={(e) => {
                        if (!isAddingMember) {
                          setUpdateGroupChat((pre) => {
                            return {
                              ...pre,
                              [e.target.name]: e.target.value,
                            };
                          });
                        }
                      }}
                      placeholder={isAddingMember ? "Adding member..." : "Search user by name..."}
                      disabled={isAddingMember}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-3 transition-all ${
                        isAddingMember 
                          ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' 
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    
                    {/* Loading State */}
                    {isAddingMember && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-600">Adding member to group...</span>
                        </div>
                      </div>
                    )}
                    
                    {/* User Search Results */}
                    {!isAddingMember && (
                      <div
                        className={`${
                          userChat.length > 0
                            ? "bg-white border border-gray-200 rounded-md max-h-48 overflow-auto"
                            : "hidden"
                        }`}
                      >
                        {userChat?.map((item) => {
                          // Check if user is already in the group
                          const isAlreadyMember = selectedChat?.users?.some(user => user._id === item._id);
                          
                          return (
                            <UsersChats
                              key={item._id}
                              handelAddToGroup={handelAddToGroup}
                              item={item}
                              disabled={isAddingMember || isAlreadyMember}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Single Chat Information
            <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 lg:p-8 overflow-auto">
              {(() => {
                const otherUser = getSenderFull(userInfo, selectedChat?.users);
                return otherUser ? (
                  <div className="w-full max-w-md mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800 mt-8 sm:mt-0">Chat Information</h2>
                    
                    {/* User Profile Picture */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="relative">
                        <img 
                          src={otherUser.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                          alt={otherUser.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        />
                        {otherUser.isOnline && (
                          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-white"></span>
                        )}
                      </div>
                    </div>
                    
                    {/* User Details */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Name</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">{otherUser.name}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-sm sm:text-lg text-gray-800 break-all">{otherUser.email}</p>
                      </div>
                      
                      {otherUser.bio && (
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">Bio</p>
                          <p className="text-sm sm:text-base text-gray-800 break-words">{otherUser.bio}</p>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Status</p>
                        <div className="flex items-center flex-wrap">
                          <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 flex-shrink-0 ${otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <p className="text-sm sm:text-base text-gray-800">
                            {otherUser.isOnline ? 'Online' : `Last seen ${otherUser.lastSeen ? new Date(otherUser.lastSeen).toLocaleString() : 'recently'}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Chat Type</p>
                        <p className="text-base sm:text-lg text-gray-800">Private Chat</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Member Since</p>
                        <p className="text-sm sm:text-base text-gray-800">
                          {otherUser.createdAt ? new Date(otherUser.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">Unable to load user information</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowChatType;
