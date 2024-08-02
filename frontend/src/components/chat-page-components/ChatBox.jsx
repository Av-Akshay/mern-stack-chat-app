import React from "react";

const ChatBox = () => {
  return (
    <div className="w-[65%] h-full bg-slate-100 rounded-md p-2">
      <div className="h-[8vh] flex items-center justify-between">
        <h1 className="text-xl font-medium">Akshay Chauhan</h1>
        <p>Online</p>
      </div>
      <div className=" bg-slate-300 h-[74vh] px-2 rounded-lg">
        <div className=" h-full w-full"></div>
        <form className="flex items-center gap-2 h-[6vh]">
          <input
            className="w-full bg-transparent py-2 outline-none"
            type="text"
            placeholder="Send a message"
          />
          <button className="bg-transparent font-medium ">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
