import { handelAddChats } from "../store/slice";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axios from "../axiosInstance";

const useFetchChats = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const { chats, selectedChat } = useSelector((store) => store.chatStore);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handelFetchChats = async () => {
    try {
      const response = await axios.get("chat");
      if (response?.statusText === "OK") {
        dispatch(handelAddChats(response?.data));
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (!hasFetched.current) {
      handelFetchChats();
      hasFetched.current = true;
    }
  }, []);

  const getSender = (users) => {
    return userInfo._id === users[0]._id ? users[1].name : users[0].name;
  };
  return {
    chats,
    dispatch,
    selectedChat,
    getSender,
  };
};

export default useFetchChats;
