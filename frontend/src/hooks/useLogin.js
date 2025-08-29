import { useForm } from "react-hook-form";
import axios from "axios";
import instance from "../axiosInstance";
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
      setMessage(""); // Clear previous error messages
      
      console.log("Attempting login for:", data.email);
      
      // Try with direct axios to fix any configuration issues
      const response = await axios.post("http://localhost:8000/api/user/login", {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Login response status:", response.status);
      
      if (response.data) {
        console.log("Login successful");
        dispatch(handleSaveUser(response.data));
        navigate("/chats");
      } else {
        setMessage("Received empty response from server");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      
      if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        setMessage(error.response.data.message || "Login failed");
      } else if (error.request) {
        console.log("No response received");
        setMessage("No response from server. Please check your connection.");
      } else {
        console.log("Error message:", error.message);
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    register,
    errors,
    submitForm,
    message,
    isLoading,
  };
};

export default useLogin;
