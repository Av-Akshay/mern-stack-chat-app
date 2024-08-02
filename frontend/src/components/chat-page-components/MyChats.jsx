import React, { useState } from "react";

const MyChats = () => {
  const [activeChat, setActiveChat] = useState(false);

  return (
    <div className="w-[35%] h-full bg-slate-100 rounded-md">
      <div className="w-[95%] mx-auto my-2 flex items-center justify-between">
        <h1 className="text-2xl font-normal ">My Chats</h1>
        <input
          className="text-base bg-slate-200 text-black  px-3 py-1 w-2/5 rounded-md outline-none"
          type="text"
          placeholder="New Chat Group +"
        />
      </div>
      <div className="my-2 w-[95%] mx-auto flex flex-col gap-5">
        <div
          onClick={() => {
            activeChat ? setActiveChat(false) : setActiveChat(true);
          }}
          className={`${
            activeChat ? "bg-blue-500 text-white" : "bg-slate-200 text-black"
          } p-2 rounded-md overflow-auto`}
        >
          <p className="capitalize">Akshay chauhan</p>
          <p className="">
            <span className="font-semibold">Akshay chauhan</span> :{" "}
            <span> hello...</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyChats;
