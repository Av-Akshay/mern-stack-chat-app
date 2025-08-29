import { useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { updateUserOnlineStatus } from "../store/slice";

const useSocket = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.chatStore.user);

  const socketRef = useRef(null);

  const socket = useMemo(() => {
    if (!socketRef.current) {
      console.log("Initializing new socket connection...");
      socketRef.current = io("http://localhost:8000", {
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
      console.log("Reusing existing socket connection.");
    }
    return socketRef.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket || !userInfo?._id) {
      console.log("Socket or userInfo not available, skipping setup.");
      if (socketRef.current?.connected && !userInfo?._id) {
          console.log("User logged out, disconnecting socket.");
          socketRef.current.disconnect(); 
      }
      return; 
    }

    if (!socket.connected) {
        console.log(`Connecting socket for user: ${userInfo._id}`);
        socket.connect();
    }

    console.log(`Setting up socket events for user: ${userInfo._id}`);
    socket.emit("setup", userInfo);
    
    // Setup heartbeat - send every 25 seconds
    const heartbeatInterval = setInterval(() => {
      if (socket.connected && userInfo?._id) {
        socket.emit("heartbeat", userInfo._id);
      }
    }, 25000);

    const handleUserStatusChange = (data) => {
      console.log("Received user_status_change:", data);
      // Dispatch the action to update Redux state
      if (data && data.userId) { // Basic validation
          dispatch(updateUserOnlineStatus(data));
      } else {
          console.warn("Received invalid user_status_change data:", data);
      }
    };

    const handleMessageReceived = (newMessage) => {
      console.log("New message received:", newMessage);
      // TODO: Dispatch action to add message to Redux store
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