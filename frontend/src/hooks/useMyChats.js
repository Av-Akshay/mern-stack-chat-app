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

  const { chats, selectedChat, groupChatFormModel } = useSelector(
    (store) => store.chatStore
  );

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
      console.log(response);

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

  const handelSendMessage = async () => {};

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
  };
};

export default useMyChats;
