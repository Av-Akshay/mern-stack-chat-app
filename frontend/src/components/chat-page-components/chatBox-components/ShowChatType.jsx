import React from "react";

import useShowChatType from "../../../hooks/useShowChatType";
import UsersChats from "../navbar-component/slider-component/UsersChats";

const ShowChatType = ({ handelToggle }) => {
  const {
    selectedChat,
    setUpdateGroupChat,
    initialValue,
    handelChangeTheGroupName,
    userChat,
    handelAddToGroup,
  } = useShowChatType();
  console.log(selectedChat);

  return (
    <div className="absolute z-20 left-0 top-0 flex items-center justify-center w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.4)] ">
      <div className="relative w-[60%] h-[70vh] bg-white rounded-xl shadow-xl shadow-black p-5">
        <div className="z-30 text-end">
          <button
            onClick={handelToggle}
            className="font-semibold text-lg border-2 px-2 py-1 rounded-md"
          >
            X
          </button>
        </div>
        {selectedChat.isGroupChat ? (
          <div className="absolute top-16 w-full flex items-center justify-center flex-col gap-5">
            <h1 className="capitalize">
              chat name:- <span>{selectedChat?.chatName}</span>
            </h1>
            <div className="capitalize flex gap-2">
              group chat users:-
              <div className="flex items-center flex-wrap gap-2">
                {selectedChat?.users?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="bg-violet-500 inline-block px-5 py-1 rounded-md relative text-white "
                    >
                      {item.name}
                      <button
                        // onClick={() => {
                        //   handelRemoveSelectedUser(item._id);
                        // }}
                        className="absolute -top-1 right-1 border-none outline-none bg-transparent ml-1"
                      >
                        x
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid w-fit gap-5 grid-cols-2 grid-rows-1">
              <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-lg">
                Want to change the group name:-
                <form
                  className=" flex flex-col gap-2"
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
                    className="capitalize px-2 py-1 border-2 border-blue-500 outline-none rounded-md"
                  />
                  <button
                    className="border-2 outline-none border-blue-500 px-3 p-1 rounded-md hover:bg-blue-500 hover:text-white transition-all"
                    type="submit"
                  >
                    Change the name
                  </button>
                </form>
              </div>
              <div className="p-2 bg-gray-200 rounded-lg flex flex-col items-center">
                want to add a user:-
                <input
                  name="chats"
                  type="text"
                  onChange={(e) => {
                    setUpdateGroupChat((pre) => {
                      return {
                        ...pre,
                        [e.target.name]: e.target.value,
                      };
                    });
                  }}
                  placeholder="Add User eg. Akshay "
                  className="border-2 w-fit border-blue-500 px-2 py-1 rounded-md"
                />
                <div
                  className={`${
                    userChat.length > 0
                      ? "bg-white top-[5.2rem] mt-1 w-fit h-[32vh] rounded-md overflow-auto flex flex-col gap-2 z-10 "
                      : "hidden"
                  }`}
                >
                  {userChat?.map((item) => {
                    return (
                      <UsersChats
                        key={item._id}
                        handelAccessChat={handelAddToGroup}
                        item={item}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ShowChatType;
