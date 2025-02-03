import React from "react";
import useMyChats from "../../../hooks/useMyChats";

const MessageBox = ({ chatMessages }) => {
  const { userInfo } = useMyChats();

  return (
    <div className="h-full w-full fex !flex-col gap-5 py-2 overflow-y-auto">
      <div className={`w-full h-full flex flex-col gap-1 my-1`}>
        {chatMessages?.map((messages) => {
          return (
            <div
              key={messages._id}
              className={`w-full flex items-center  ${
                messages?.sender?._id === userInfo?._id
                  ? "justify-end"
                  : "justify-start"
              } `}
            >
              <span
                className={`p-2 ${
                  messages?.sender?._id === userInfo?._id
                    ? "bg-gray-200 rounded-sendMessage"
                    : "bg-green-100 rounded-receiveMessage"
                } `}
              >
                {messages.content}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageBox;
