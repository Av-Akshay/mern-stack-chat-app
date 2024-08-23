import React from "react";
import useGetChats from "../../../../hooks/useGetChats";

const UsersChats = ({ item, handelAccessChat, handelAddToGroup }) => {
  return (
    <div
      onClick={() => {
        handelAccessChat && handelAccessChat(item._id);
        handelAddToGroup && handelAddToGroup(item);
      }}
      className="w-full flex items-center justify-center rounded-xl gap-2 p-2 text-black hover:text-white bg-slate-300 hover:bg-blue-500 transition-all"
    >
      <div>
        <img className="h-8 w-8 rounded-full" src={item.pic} alt="user" />
      </div>
      <div className="flex flex-col gap-2 ">
        <p> {item?.name} </p>
        <p>
          <span className="font-semibold">Email:-</span> {item?.email}{" "}
        </p>
      </div>
    </div>
  );
};

export default UsersChats;
