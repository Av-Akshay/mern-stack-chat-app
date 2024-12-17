import { useSelector, useDispatch } from "react-redux";

import axios from "../axiosInstance";
import { handelAddChats } from "../store/slice";
import { useEffect, useRef, useState } from "react";

const useGetAllChats = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const { chats } = useSelector((store) => store.chatStore);
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

  return {
    handelFetchChats,
    chats,
    loading,
  };
};

export default useGetAllChats;
