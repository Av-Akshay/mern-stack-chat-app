import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axiosInstance";

import useGetAllChats from "./useGetAllChats";
import useGetChats from "./useGetChats";
import { handelSelectedChat } from "../store/slice";

const useShowChatType = () => {
  const { handelFetchChats } = useGetAllChats();
  const { submitForm, userChat } = useGetChats();
  const dispatch = useDispatch();

  let initialValue = {
    groupName: "",
    chats: "",
  };
  const { selectedChat } = useSelector((store) => store.chatStore);
  const [updateGroupChat, setUpdateGroupChat] = useState(initialValue);
  const [toggle, setToggle] = useState(false);

  //======================group name change handler===========================

  const handelChangeTheGroupName = async (chatId) => {
    try {
      const response = await axios.put(`chat/rename`, {
        chatId: chatId,
        chatName: updateGroupChat?.groupName,
      });
      if (response?.statusText === "OK") {
        handelFetchChats();
        alert("group name changes sussesfully");
        setToggle(!toggle);
      }
    } catch (error) {
      alert(error?.message);
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      submitForm(updateGroupChat);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [updateGroupChat]);

  const handelToggleChatTypePopup = () => {
    console.log("clicked");

    setToggle(!toggle);
  };

  const handelAddToGroup = async (userId) => {
    try {
      const response = await axios.post("chat/groupadd", {
        chatId: selectedChat._id,
        userId: userId,
      });

      if (response?.statusText === "OK") {
        dispatch(handelSelectedChat(response?.data));
        handelFetchChats();
      }
    } catch (error) {
      console.log(`error on adding user to group chat ${error}`);
    }
  };

  return {
    selectedChat,
    setUpdateGroupChat,
    initialValue,
    updateGroupChat,
    handelChangeTheGroupName,
    toggle,
    handelToggleChatTypePopup,
    userChat,
    handelAddToGroup,
  };
};

export default useShowChatType;
