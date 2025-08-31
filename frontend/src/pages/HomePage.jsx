import React, { useState, useEffect } from "react";
import { Login, Signup } from "../components/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [form, setForm] = useState("login");
  const user = useSelector(state => state.chatStore.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.token) {
      navigate("/chats");
    }
  }, [user, navigate]);
  
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 w-full flex items-center justify-center min-h-screen p-4 ${
        form !== "login" ? "py-10 " : ""
      }`}
    >
      <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col gap-5 max-w-xl">
        <div className="w-full py-3 text-center bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-md shadow-lg">
          <h1 className="font-medium text-xl md:text-2xl lg:text-3xl">Talk-A-Tive</h1>
        </div>
        <div className="w-full shadow-lg rounded-md py-5 bg-white dark:bg-slate-800 text-gray-800 dark:text-white overflow-hidden">
          <div className="w-full flex items-start flex-col">
            <div className="w-full flex items-start px-2 mb-4">
              <button
                onClick={() => {
                  setForm("login");
                }}
                className={`w-full px-4 py-2 font-medium transition-all duration-300 ease-in-out ${
                  form === "login" ? "bg-blue-500 dark:bg-blue-600 text-white rounded-2xl" : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-2xl"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setForm("sighup");
                }}
                className={`w-full px-4 py-2 font-medium transition-all duration-300 ease-in-out ${
                  form === "sighup" ? "bg-blue-500 dark:bg-blue-600 text-white rounded-2xl" : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-2xl"
                }`}
              >
                Sign Up
              </button>
            </div>
            <div className="w-full transition-all duration-300 ease-in-out">
              {form === "login" ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
