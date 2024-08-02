import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
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
      console.log(res);
      if (res?.statusText === "OK") {
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
