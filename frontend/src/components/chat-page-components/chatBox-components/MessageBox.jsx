import React from "react";

const MessageBox = ({ chatMessages }) => {
  return (
    <div className="h-full w-full fex flex-col gap-1">
      {chatMessages?.map((messages) => {
        return <div>{messages.content}</div>;
      })}
    </div>
  );
};

export default MessageBox;
