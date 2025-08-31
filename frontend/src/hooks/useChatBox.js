import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "../axiosInstance";
import useMyChats from "./useMyChats";
import { handelFetchUsersChat, handelSelectedChat } from "../store/slice";

const useChatBox = () => {
  const { handelFetchChats, userChat, submitForm } = useMyChats();

  const dispatch = useDispatch();

  let initialValue = {
    groupName: "",
    chats: "",
  };
  const { selectedChat } = useSelector((store) => store.chatStore);
  const [updateGroupChat, setUpdateGroupChat] = useState(initialValue);
  const [toggle, setToggle] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberMessage, setAddMemberMessage] = useState(null);

  //====================== change group name ===========================

  const handelChangeTheGroupName = async (chatId) => {
    try {
      const response = await axios.put(`chat/rename`, {
        chatId: chatId,
        chatName: updateGroupChat?.groupName,
      });
      if (response?.statusText === "OK") {
        dispatch(handelFetchUsersChat());
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
    setToggle(!toggle);
  };

  //  ---------------add user to group--------------
  const handelAddToGroup = async (userId) => {
    // Check if user is already in the group
    const isAlreadyMember = selectedChat?.users?.some(user => user._id === userId);
    
    if (isAlreadyMember) {
      setAddMemberMessage({
        type: 'warning',
        text: 'This user is already a member of the group.'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setAddMemberMessage(null);
      }, 3000);
      
      return;
    }
    
    setIsAddingMember(true);
    setAddMemberMessage(null);
    
    try {
      const response = await axios.post("chat/groupadd", {
        chatId: selectedChat._id,
        userId: userId,
      });

      if (response?.statusText === "OK") {
        dispatch(handelSelectedChat(response?.data));
        dispatch(handelFetchUsersChat());
        
        // Find the added user's name
        const addedUser = response.data.users.find(user => user._id === userId);
        const userName = addedUser ? addedUser.name : 'User';
        
        setAddMemberMessage({
          type: 'success',
          text: `${userName} has been successfully added to the group!`
        });
        
        // Clear search results
        setUpdateGroupChat(initialValue);
        
        // Clear message after 4 seconds
        setTimeout(() => {
          setAddMemberMessage(null);
        }, 4000);
      }
    } catch (error) {
      console.log(`error on adding user to group chat ${error}`);
      
      setAddMemberMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add user to group. Please try again.'
      });
      
      // Clear message after 4 seconds
      setTimeout(() => {
        setAddMemberMessage(null);
      }, 4000);
    } finally {
      setIsAddingMember(false);
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
    isAddingMember,
    addMemberMessage,
  };
};

export default useChatBox;
