import { useForm } from "react-hook-form";
import axios from "axios";
import instance from "../axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
      
      console.log("Registration attempt with:", { 
        name: formData.name, 
        email: formData.email,
        passwordLength: formData.password?.length
      });
      
      // Try first with instance, then with direct axios if that fails
      let res;
      try {
        res = await instance.post("user", formData);
        console.log("Registration successful with instance");
      } catch (instanceError) {
        console.log("Instance registration failed:", instanceError.message);
        res = await axios.post("http://localhost:8000/api/user", formData);
        console.log("Registration successful with direct axios");
      }
      
      if (res?.data) {
        console.log("Registration response:", res.data);
        dispatch(handleSaveUser(res.data));
        navigate("/chats");
      } else {
        setMessage("Received empty response from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.log("Response data:", error?.response?.data);
      console.log("Response status:", error?.response?.status);
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
