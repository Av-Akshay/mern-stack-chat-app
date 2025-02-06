import { useMemo } from "react";
import io from "socket.io-client";

const useSocket = () => {
  let END_POINT = "http://localhost:5000";

  let socket =   useMemo(()=>{
    return io(END_POINT, { transports: ["websocket"] })
  },[]);
  
  return {
    socket,
  };
};

export default useSocket;
