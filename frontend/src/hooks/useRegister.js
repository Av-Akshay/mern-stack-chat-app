import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "../axiosInstance";
import { handleSaveUser } from "../store/slice";

const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
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
      setMessage("");
      
      // Process form data
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
        // Add other fields if needed
      };
      
      // Try first with instance, then with direct axios if that fails
      let res;
      try {
        res = await axios.post("user", formData);
      } catch (instanceError) {
        res = await axios.post("user", formData);
      }
      
      if (res?.data) {
        dispatch(handleSaveUser(res.data));
        navigate("/chats");
      } else {
        setMessage("Received empty response from server");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    register,
    watch,
    errors,
    submitForm,
    message,
    isLoading,
  };
};

export default useRegister;
