import React, { useCallback, useEffect, useRef } from "react";
import useMyChats from "../../../hooks/useMyChats";
import Lottie from 'react-lottie';
import animationData from "../../../animation/animation.json"

const MessageBox = ({ chatMessages, isTyping}) => {
  const { userInfo } = useMyChats();
  const messagesEndRef =useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  },[chatMessages,isTyping])

  useEffect(()=>{
    scrollToBottom();
  },[chatMessages,isTyping])

  return (
   
      <div ref={messagesEndRef} className={`w-full h-full flex flex-col gap-1 my-1 p-1 overflow-y-auto`}>
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
        {
          isTyping && <p className="font-thin text-sm">typing...</p>
        }
      </div>
   
  );
};

export default MessageBox;
