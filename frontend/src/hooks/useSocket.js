import io from "socket.io-client";

const useSocket = () => {
  let END_POINT = "http://localhost:5000";
  let socket = io(END_POINT);

  return {
    socket,
  };
};

export default useSocket;
