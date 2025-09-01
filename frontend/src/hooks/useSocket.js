import { useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { updateUserOnlineStatus, updateLatestMessage, addNotifiation } from "../store/slice";
import store from "../store/store";

const useSocket = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.chatStore.user);

  const socketRef = useRef(null);

  const socket = useMemo(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://talk-a-tive-1zgp.onrender.com", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });
      // Store socket globally for logout access
      window.socket = socketRef.current;
    } else {
    }
    return socketRef.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket || !userInfo?._id) {
      if (socketRef.current?.connected && !userInfo?._id) {
          socketRef.current.disconnect(); 
      }
      return; 
    }

    if (!socket.connected) {
        socket.connect();
    }

    socket.emit("setup", userInfo);
    
    // Setup heartbeat - send every 25 seconds
    const heartbeatInterval = setInterval(() => {
      if (socket.connected && userInfo?._id) {
        socket.emit("heartbeat", userInfo._id);
      }
    }, 25000);

    const handleUserStatusChange = (data) => {
      // Dispatch the action to update Redux state
      if (data && data.userId) { // Basic validation
          dispatch(updateUserOnlineStatus(data));
      } else {
          console.warn("Received invalid user_status_change data:", data);
      }
    };

    const handleMessageReceived = (newMessage) => {
      
      // Update the latest message in the chat list
      if (newMessage?.chatId) {
        dispatch(updateLatestMessage({
          chatId: newMessage.chatId._id || newMessage.chatId,
          message: {
            _id: newMessage._id,
            content: newMessage.content,
            sender: newMessage.sender,
            createdAt: newMessage.createdAt
          }
        }));
        
        // Add notification if this chat is not currently selected
        const state = store.getState();
        const selectedChat = state.chatStore?.selectedChat;
        
        if (!selectedChat || selectedChat._id !== (newMessage.chatId._id || newMessage.chatId)) {
          dispatch(addNotifiation(newMessage));
        }
      }
    };

    const handleTyping = () => {
      console.log("User is typing");
      // TODO: Update UI to show typing indicator
    };

    const handleStopTyping = () => {
      console.log("User stopped typing");
      // TODO: Update UI to hide typing indicator
    };
    
    const handleOnlineUsersList = (onlineUsers) => {
      console.log("Received online users list:", onlineUsers);
      // Update all online users at once
      onlineUsers.forEach(userId => {
        dispatch(updateUserOnlineStatus({
          userId,
          isOnline: true
        }));
      });
    };
    
    const handleReconnect = () => {
      console.log("Socket reconnected, re-emitting setup");
      if (userInfo?._id) {
        socket.emit("setup", userInfo);
      }
    };

    // Add listeners
    socket.on("user_status_change", handleUserStatusChange);
    socket.on("message_received", handleMessageReceived);
    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    socket.on("online_users_list", handleOnlineUsersList);
    socket.on("connect", handleReconnect);

    return () => {
      console.log(`Cleaning up socket events for user: ${userInfo?._id || 'unknown'}`);
      clearInterval(heartbeatInterval);
      socket.off("user_status_change", handleUserStatusChange);
      socket.off("message_received", handleMessageReceived);
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      socket.off("online_users_list", handleOnlineUsersList);
      socket.off("connect", handleReconnect);
    };
  }, [userInfo?._id, socket, userInfo, dispatch]); // Added dispatch to dependencies

  return socket;
};

export default useSocket;
