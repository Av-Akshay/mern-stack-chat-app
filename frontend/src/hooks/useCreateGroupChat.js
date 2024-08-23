import axios from "../axiosInstance";
import { useState } from "react";

const useCreateGroupChat = () => {
  const initialValue = {
    name: "",
    users: "",
  };
  const [selectToGroupChat, setSelectToGroupChat] = useState([]);
  const [modelSearch, setModelSearch] = useState(initialValue);

  //================== add user into group chat====================

  const handelAddToGroup = (item) => {
    if (selectToGroupChat.includes(item)) {
      alert("User is already selected");
    } else {
      setSelectToGroupChat([...selectToGroupChat, item]);
    }
  };

  // ============== create group chat ===================
  const handelCreateGroupChat = async () => {
    try {
      const response = await axios.post("chat/group", {
        name: modelSearch.name,
        users: selectToGroupChat,
      });
      console.log(response);
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  // ======================handel input change =========================

  const handelInputChange = (e) => {
    const { name, value } = e.target;
    setModelSearch((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  // ============handel remove user from selected user for group chat=========================
  const handelRemoveSelectedUser = (id) => {
    let newSelectedUser = selectToGroupChat.filter((item) => {
      return item._id !== id;
    });
    setSelectToGroupChat(newSelectedUser);
  };

  return {
    handelAddToGroup,
    selectToGroupChat,
    handelCreateGroupChat,
    modelSearch,
    handelInputChange,
    handelRemoveSelectedUser,
  };
};

export default useCreateGroupChat;
