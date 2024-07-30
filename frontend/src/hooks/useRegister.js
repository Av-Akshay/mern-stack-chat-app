import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
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
    console.log(data);

    try {
      setIsLoading(true);
      const res = await axios.post("/api/user", data);
      if (res?.statusText === "Created") {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
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
