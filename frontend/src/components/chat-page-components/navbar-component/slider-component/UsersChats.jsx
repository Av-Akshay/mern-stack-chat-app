import React from "react";

const UsersChats = ({ item, handelAccessChat, handelAddToGroup, disabled = false }) => {
  return (
    <div
      onClick={() => {
        if (!disabled) {
          handelAccessChat && handelAccessChat(item._id);
          handelAddToGroup && handelAddToGroup(item._id);
        }
      }}
      className={`w-full flex items-center gap-3 p-3 transition-all cursor-pointer ${
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'text-gray-700 dark:text-gray-200 hover:text-white bg-gray-50 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-600'
      } rounded-lg border border-gray-200 dark:border-slate-600`}
    >
      <div className="flex-shrink-0">
        <img 
          className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" 
          src={item.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
          alt="user" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item?.name}</p>
        <p className="text-xs opacity-80 truncate">
          {item?.email}
        </p>
      </div>
      <div className="flex-shrink-0">
        {disabled ? (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default UsersChats;
