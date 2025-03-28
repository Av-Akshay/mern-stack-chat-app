import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import axios from "../axiosInstance";
import {
  handelSelectedChat,
  handelAddNewChat,
  handelAddChats,
  handelAddGroupChat,
  addNotifiation,
  clearNotification,
  handelFetchUsersChat
} from "../store/slice";
import instance from "../axiosInstance";
import useSocket from "./useSocket";
import useSound from "./useSound";


const useMyChats = () => {
  const { socket } = useSocket();
  const { playNotificationSound } = useSound();
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
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false)
  //---------------------- redux-toolkit store data --------------------------
  const { chats, selectedChat, groupChatFormModel, user,notifiaction,fetchUsersChats} = useSelector(
    (store) => store.chatStore
  );

  // --------------------- connect socket io ------------------------------
  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))
  }, []);

  // ------------sending message or notifiacation----------------
  useEffect(() => {
    socket.on("message_received", (newMessageReceived) => {
      // If no selected chat or the message is from a different chat than the selected one
      if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
        // Check if this notification is not already in the array
        const notificationExists = notifiaction.some(
          n => n._id === newMessageReceived._id
        );
        
        if (!notificationExists) {
          // Play sound notification
          playNotificationSound();
          
          // Add notification and trigger chat list refresh to update latest messages
          dispatch(addNotifiation(newMessageReceived));
          dispatch(handelFetchUsersChat());
        }
      } else {
        // Message is for the currently selected chat, just add it to the current messages
        setChatMessages(prevMessages => [...prevMessages, newMessageReceived]);
      }
    });
    
    // Cleanup
    return () => {
      socket.off("message_received");
    };
  }, [selectedChat, notifiaction, playNotificationSound]);

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

  // ------------------- handel search user -----------------------
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
  }, [fetchUsersChats]);

  //-------------------handel fetch all chats messages---------------------

  const handleFetchAllChats = useCallback(async () => {
    try {
      const response = await instance.get(`messages/${selectedChat._id}`);

      if (response.status === 200) {
        setChatMessages(response?.data);
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat?._id) {
      handleFetchAllChats();
    }
  }, [selectedChat]);

  //-------------------- handel send message --------------------
  const handelSendMessage = async (data) => {
    setSendingMessage(true);
    try {
      const response = await instance.post("messages", {
        ...data,
        chatId: selectedChat._id,
      });

      if (response.status === 200) {
        handleFetchAllChats();
        socket.emit("new_message", response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendingMessage(false);
      reset();
    }
  };

  // ---------------------- handel typing message -------------------
  const handelChangeMessage = (event)=>{
    const {value} = event.target;
   if(!socketConnected) return;
   if(!typing){
    setTyping(true);
    socket.emit("typing",selectedChat._id);
   };
   let lastTypingTime = new Date().getTime();
   var timeLength = 3000;
   setTimeout(()=>{
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if(timeDiff >= timeLength && typing){
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
   },timeLength)
     
  }

  const handleSelectChat = (chat) => {
    dispatch(handelSelectedChat(chat));
    
    // Clear notifications for this chat when selected
    if (chat && chat._id) {
      dispatch(clearNotification(chat._id));
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
    io,
    socket,
    handelChangeMessage,
    isTyping,
    handleSelectChat
  };
};

export default useMyChats;