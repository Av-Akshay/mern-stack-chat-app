import { useForm } from "react-hook-form";
import axios from "../axiosInstance";
import { useState } from "react";
import { handelSelectedChat, handelAddNewChat } from "../store/slice";
import { useDispatch } from "react-redux";

const useGetChats = () => {
  const dispatch = useDispatch();
  const [userChat, setUserChat] = useState([]);
  const [loading, setLoading] = useState();
  const [accessLoading, setAccessLoading] = useState();
  const [message, setMessage] = useState();
  const [sliderIsOpen, setSliderIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handelCloseSlider = () => {
    setSliderIsOpen(false);
  };
  const handelOpenSlider = () => {
    setSliderIsOpen(true);
  };

  const submitForm = async (data) => {
    try {
      setLoading(true);
      const response = await axios.get(`user?search=${data?.users}`);

      if (response?.statusText === "OK") {
        setUserChat(response?.data);
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  const handelAccessChat = async (userId) => {
    try {
      setAccessLoading(true);
      const response = await axios.post("chat", {
        userId,
      });
      if (response?.statusText === "OK") {
        dispatch(handelSelectedChat(response?.data));
        dispatch(handelAddNewChat(response?.data));
        setSliderIsOpen(false);
      }
      setAccessLoading(false);
    } catch (error) {
      setAccessChatMessage(error?.message);
      setAccessLoading;
      false;
    }
  };

  return {
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
  };
};

export default useGetChats;
