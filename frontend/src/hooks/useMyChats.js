import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import axios from "../axiosInstance";
import {
  handelSelectedChat,
  handelAddNewChat,
  handelAddChats,
  handelAddGroupChat,
  handelToggleGroupChatModel,
  addNotifiation,
  clearNotification,
  handelFetchUsersChat,
  markMessagesFetched,
  updateLatestMessage
} from "../store/slice";
import instance from "../axiosInstance";
import useSocket from "./useSocket";
import useSound from "./useSound";


const useMyChats = () => {
  const socket = useSocket();
  const { playNotificationSound } = useSound();
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const typingTimeoutRef = useRef(null);
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
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(false);
  const selectedChatRef = useRef(null);
  const socketRef = useRef(null);
  
  //---------------------- redux-toolkit store data --------------------------
  const { chats, selectedChat, groupChatFormModel, user, notifiaction, fetchUsersChats, messagesFetched } = useSelector(
    (store) => store.chatStore
  );

  // --------------------- connect socket io ------------------------------
  useEffect(() => {
    if (user && socket) {
      
      if (socket.connected) {
          socket.emit("setup", user);
      } else {
          const handleConnect = () => {
              socket.emit("setup", user);
              setSocketConnected(true);
          };
          socket.once('connect', handleConnect); 
          return () => socket.off('connect', handleConnect);
      }

      const handleConnected = () => setSocketConnected(true);
      const handleTyping = () => setIsTyping(true);
      const handleStopTyping = () => setIsTyping(false);
      
      socket.on("connected", handleConnected);
      socket.on("typing", handleTyping);
      socket.on("stop typing", handleStopTyping);
      
      return () => {
        socket.off("connected", handleConnected);
        socket.off("typing", handleTyping);
        socket.off("stop typing", handleStopTyping);
      };
    } else {
       console.log("useMyChats: User or socket not available for connection setup.");
    }
  }, [user, socket]);

  // ------------sending message or notification----------------
  useEffect(() => {
    if (socket) {
        const handleMessageReceived = (newMessageReceived) => {
          if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
            const notificationExists = notifiaction.some(
              n => n._id === newMessageReceived._id
            );
            
            if (!notificationExists) {
              playNotificationSound();
              
              dispatch(addNotifiation(newMessageReceived));
              dispatch(handelFetchUsersChat());
            }
          } else {
            setChatMessages(prevMessages => [...prevMessages, newMessageReceived]);
          }
        };
        socket.on("message_received", handleMessageReceived);
        
        return () => {
          socket.off("message_received", handleMessageReceived);
        };
    } else {
        console.log("useMyChats: Socket not available for message listener.");
    }
  }, [selectedChat, notifiaction, dispatch, playNotificationSound, socket]);

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
    if (!modelSearch.name || modelSearch.name.trim() === '') {
      alert("Please enter a group name");
      return;
    }
    
    if (selectToGroupChat.length < 2) {
      alert("Please select at least 2 users for a group chat");
      return;
    }
    
    try {
      const response = await axios.post("chat/group", {
        name: modelSearch.name,
        users: selectToGroupChat,
      });

      if (response?.statusText === "OK") {
        // Add the new group chat to the state
        dispatch(handelAddGroupChat(response?.data));
        
        // Close the modal
        dispatch(handelToggleGroupChatModel());
        
        // Clear the form state
        setModelSearch({ name: "", chats: "" });
        setSelectToGroupChat([]);
        setUserChat([]);
        
        // Optional: Show success message
        console.log("Group chat created successfully!");
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

  //---------------------- handel close group chat modal with cleanup--------------------
  const handelCloseGroupChatModal = useCallback(() => {
    // Clear the form state when closing modal
    setModelSearch({ name: "", chats: "" });
    setSelectToGroupChat([]);
    setUserChat([]);
    // Toggle the modal closed
    dispatch(handelToggleGroupChatModel());
  }, [dispatch]);

  //---------------------- handel open and close slider--------------------
  const handelCloseSlider = useCallback(() => {
    setSliderIsOpen(false);
  }, []);
  
  const handelOpenSlider = useCallback(() => {
    setSliderIsOpen(true);
  }, []);

  // ------------------- handel search user -----------------------
  const submitForm = async (data) => {
    if (!data?.chats || data.chats.trim() === '') {
      setMessage("Please enter a search term");
      return;
    }
    
    try {
      setLoading(true);
      const response = await instance.get(`user?search=${data?.chats}`);

      if (response?.statusText === "OK") {
        setUserChat(response?.data);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  //------------------------- handel add the user into chat--------------------
  const handelAccessChat = async (userId) => {
    if (accessLoading) return;
    
    try {
      setAccessLoading(true);
      
      const existingChat = chats.find(chat => 
        !chat.isGroupChat && chat.users.some(user => user._id === userId)
      );
      
      if (existingChat) {
        dispatch(handelSelectedChat(existingChat));
        setSliderIsOpen(false);
        return;
      }
      
      const response = await instance.post("chat", {
        userId,
      });
      
      if (response?.statusText === "OK") {
        dispatch(handelSelectedChat(response?.data));
        
        const chatExists = chats.some(chat => chat._id === response.data._id);
        if (!chatExists) {
          dispatch(handelAddNewChat(response?.data));
        }
        
        setSliderIsOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAccessLoading(false);
    }
  };

  //-------------------------------------------------- my chat component -----------------------------------------

  const userInfo = useSelector(state => state.chatStore.user);

  //------------------------ active chat--------------
  const getSender = useCallback((loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) {
      return "";
    }
    return loggedUser._id === users[0]._id ? users[1].name : users[0].name;
  }, []);

  // Get the full user object of the other chat participant
  const getSenderFull = useCallback((loggedUser, chatUsers) => {
    if (!loggedUser || !chatUsers || chatUsers.length < 2) {
      return null;
    }
    return chatUsers[0]._id === loggedUser._id ? chatUsers[1] : chatUsers[0];
  }, []);

  //----------------  get all users with which have chats---------------
  const handelFetchChats = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await axios.get("chat");

      if (response?.statusText === "OK") {
        dispatch(handelAddChats(response?.data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, loading]);

  // Fetch chats only when needed
  useEffect(() => {
    if (!hasFetched.current || fetchUsersChats) {
      handelFetchChats();
      hasFetched.current = true;
    }
  }, [fetchUsersChats, handelFetchChats]);

  //-------------------handel fetch all chats messages---------------------
  const handleFetchAllChats = useCallback(async () => {
    console.log("entered");
    
    const chatId = selectedChat?._id; // Get ID at the start
    if (!chatId) {
        return;
    }
    setMessagesLoading(true); // Start loading
    try {
      const response = await instance.get(`messages/${chatId}`);

      if (response.status === 200) {
        setChatMessages(response.data); // Update the state with fetched messages

        // Ensure socket is defined before emitting
        if (socket) {
          socket.emit("join chat", chatId);
        } else {
          console.warn("useMyChats: Socket not available when trying to emit 'join chat'.");
        }

        // Mark as fetched *after* successful fetch and state update
        // We can still mark it as fetched if needed elsewhere, even if we fetch again.
        dispatch(markMessagesFetched(chatId));
      } else {
         console.error(`useMyChats: Failed to fetch messages for ${chatId}, status: ${response.status}`);
      }
    } catch (error) {
      // Optionally set an error state here or clear messages
      setChatMessages([]); // Clear messages on error to avoid showing stale data
    } finally {
      setMessagesLoading(false); // Stop loading
    }
  }, [selectedChat?._id, socket, dispatch]); // Dependencies: id, socket, dispatch

  // useEffect for Fetching Messages when selectedChat changes
  useEffect(() => {
    const chatId = selectedChat?._id; // Get the ID

    if (chatId) { // Check if there is a selected chat ID
        handleFetchAllChats(); // Call the fetch function unconditionally
    } else {
      // No chat selected, clear messages
      setChatMessages([]);
    }
    // Depend only on the selected chat ID and the fetch function itself
  }, [selectedChat?._id, handleFetchAllChats]);

  //-------------------- handel send message --------------------
  const handelSendMessage = useCallback(async (data) => {
    if (sendingMessage) return;
    if (!data.content || data.content.trim() === '') return;
    
    setSendingMessage(true);
    try {
      const response = await instance.post("messages", {
        ...data,
        chatId: selectedChat._id,
      });

      if (response.status === 200) {
        setChatMessages(prev => [...prev, response.data]);
        socket.emit("new_message", response?.data);
        
        // Update the latest message in the chat list
        dispatch(updateLatestMessage({
          chatId: selectedChat._id,
          message: {
            _id: response.data._id,
            content: response.data.content,
            sender: response.data.sender,
            createdAt: response.data.createdAt
          }
        }));
        
        // Reset typing state
        if (typingRef.current) {
          if (socketRef.current && selectedChatRef.current) {
            socketRef.current.emit("stop typing", selectedChatRef.current._id);
          }
          typingRef.current = false;
        }
        
        // Clear any typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendingMessage(false);
    }
  }, [selectedChat, socket, reset, sendingMessage, dispatch]);

  // Update refs when values change
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);
  
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  // ---------------------- handel typing message -------------------
  const handelChangeMessage = useCallback((event) => {
    const { value } = event.target;
    if (!socketConnected || !selectedChatRef.current) return;
    
    if (!typingRef.current) {
      typingRef.current = true;
      if (socketRef.current) {
        socketRef.current.emit("typing", selectedChatRef.current._id);
      }
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && selectedChatRef.current) {
        socketRef.current.emit("stop typing", selectedChatRef.current._id);
      }
      typingRef.current = false;
    }, 3000);
  }, [socketConnected]);

  const handleSelectChat = useCallback((chat) => {
    if (selectedChat?._id === chat._id) return;
    
    dispatch(handelSelectedChat(chat));
    
    if (chat && chat._id) {
      dispatch(clearNotification(chat._id));
    }
  }, [dispatch, selectedChat]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedChat]);

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
    handelCloseGroupChatModal,
    modelSearch,
    handelInputChange,
    handelRemoveSelectedUser,
    handelSendMessage,
    sendingMessage,
    chatMessages,
    messagesLoading,
    userInfo,
    socket,
    handelChangeMessage,
    isTyping,
    handleSelectChat,
    getSenderFull
  };
};

export default useMyChats;