import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";

const useFetchChats = () => {
  const dispatch = useDispatch();

  const { selectedChat, groupChatFormModel } = useSelector(
    (store) => store.chatStore
  );

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const getSender = (users) => {
    return userInfo._id === users[0]._id ? users[1].name : users[0].name;
  };

  return {
    dispatch,
    selectedChat,
    getSender,
    groupChatFormModel,
  };
};

export default useFetchChats;
