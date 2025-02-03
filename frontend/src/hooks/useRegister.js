import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { handleSaveUser } from "../store/slice";

const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const submitForm = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/user", data);
      if (res?.statusText === "Created") {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(handleSaveUser(res?.data));
        navigate("/chats");
      }
    } catch (error) {
      console.log(error);
      reset();
    }
  };

  return {
    handleSubmit,
    register,
    watch,
    errors,
    submitForm,
  };
};

export default useRegister;
