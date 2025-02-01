import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import axios from "../axiosInstance";
import {
  handelSelectedChat,
  handelAddNewChat,
  handelAddChats,
  handelAddGroupChat,
} from "../store/slice";
import instance from "../axiosInstance";

const useMyChats = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const initialValue = {
    name: "",
    chats: "",
    message: "",
  };

  // ---------------------------states-------------------------
  const [loading, setLoading] = useState(false);
  const [userChat, setUserChat] = useState([]);
  const [accessLoading, setAccessLoading] = useState();
  const [message, setMessage] = useState();
  const [sliderIsOpen, setSliderIsOpen] = useState(false);
  const [selectToGroupChat, setSelectToGroupChat] = useState([]);
  const [modelSearch, setModelSearch] = useState(initialValue);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  //---------------------- redux-toolkit store data --------------------------
  const { chats, selectedChat, groupChatFormModel } = useSelector(
    (store) => store.chatStore
  );

  //------------------------------------ create group chat component------------------------------

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

      if (response?.statusText === "OK") {
        dispatch(handelAddGroupChat(response?.data));
      }
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

  //---------------------- handel open and close slider--------------------
  const handelCloseSlider = () => {
    setSliderIsOpen(false);
  };
  const handelOpenSlider = () => {
    setSliderIsOpen(true);
  };

  const submitForm = async (data) => {
    try {
      setLoading(true);
      const response = await instance.get(`user?search=${data?.chats}`);

      if (response?.statusText === "OK") {
        setUserChat(response?.data);
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      setLoading(false);
      setMessage(error.message);
    }
  };

  //------------------------- handel add the user into chat--------------------
  const handelAccessChat = async (userId) => {
    try {
      setAccessLoading(true);
      const response = await instance.post("chat", {
        userId,
      });
      if (response?.statusText === "OK") {
        dispatch(handelSelectedChat(response?.data));
        dispatch(handelAddNewChat(response?.data));
        setSliderIsOpen(false);
      }
      setAccessLoading(false);
    } catch (error) {
      // setAccessChatMessage(error?.message);
      setAccessLoading(false);
    }
  };

  //-------------------------------------------------- my chat component -----------------------------------------

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  //------------------------ active chat--------------
  const getSender = (users) => {
    return userInfo._id === users[0]._id ? users[1].name : users[0].name;
  };

  //----------------  get all users with which have chats---------------
  const handelFetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("chat");

      if (response?.statusText === "OK") {
        dispatch(handelAddChats(response?.data));
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      handelFetchChats();
      hasFetched.current = true;
    }
  }, []);

  //-------------------handel fetch all chats---------------------
  const handleFetchAllChats = async () => {
    const queryParams = {
      chatId: `${selectedChat._id}`,
    };
    try {
      const response = await instance.post(`messages/${selectedChat._id}`);

      if (response.status === 200) {
        setChatMessages(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    if (selectedChat?._id) {
      handleFetchAllChats();
    }
  }, [selectedChat]);

  //-------------------- handel send message --------------------
  const handelSendMessage = async (data) => {
    console.log(selectedChat._id);

    setSendingMessage(true);
    try {
      const response = await instance.post("messages", {
        ...data,
        chatId: selectedChat._id,
      });
      console.log(response);

      if (response.status === 200) {
        handleFetchAllChats();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendingMessage(false);
      reset();
    }
  };

  return {
    handelFetchChats,
    chats,
    dispatch,
    selectedChat,
    getSender,
    groupChatFormModel,
    register,
    handleSubmit,
    errors,
    submitForm,
    userChat,
    message,
    loading,
    handelAccessChat,
    accessLoading,
    handelOpenSlider,
    handelCloseSlider,
    sliderIsOpen,
    handelAddToGroup,
    selectToGroupChat,
    handelCreateGroupChat,
    modelSearch,
    handelInputChange,
    handelRemoveSelectedUser,
    handelSendMessage,
    sendingMessage,
    chatMessages,
    userInfo,
  };
};

export default useMyChats;
