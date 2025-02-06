import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { handleSaveUser } from "../store/slice";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const submitForm = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/user/login", data);
      if (res?.statusText === "OK") {
        dispatch(handleSaveUser(res.data));
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        navigate("/chats");
      }
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message);
    }
  };

  return {
    handleSubmit,
    register,
    errors,
    submitForm,
    message,
  };
};

export default useLogin;
