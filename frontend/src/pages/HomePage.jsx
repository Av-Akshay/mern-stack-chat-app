import React, { useState, useEffect } from "react";
import { Login, Signup } from "../components/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/react.svg";

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side - Logo Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="relative group">
            {/* Animated Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
            
            {/* React Logo with Theme Support */}
            <img 
              src={reactLogo} 
              alt="React Logo" 
              className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 
                       dark:brightness-0 dark:invert 
                       drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]
                       transition-all duration-500 hover:scale-110"
            />
          </div>
          
          {/* App Title and Tagline */}
          <div className="mt-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
              Talk-A-Tive
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg max-w-md">
              Connect, Chat, and Collaborate in Real-Time
            </p>
          </div>
          
          {/* Features List for larger screens */}
          <div className="hidden lg:flex flex-col gap-3 mt-8 text-left">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time messaging</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Group chat support</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure authentication</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
            {/* Tab Buttons */}
            <div className="flex p-2 bg-gray-50 dark:bg-slate-900/50">
              <button
                onClick={() => setForm("login")}
                className={`flex-1 px-4 py-3 font-semibold text-sm sm:text-base transition-all duration-300 rounded-xl ${
                  form === "login" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white shadow-lg transform scale-105" 
                    : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setForm("signup")}
                className={`flex-1 px-4 py-3 font-semibold text-sm sm:text-base transition-all duration-300 rounded-xl ${
                  form === "signup" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white shadow-lg transform scale-105" 
                    : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>
            
            {/* Form Content */}
            <div className="p-6 sm:p-8">
              <div className="transition-all duration-500 ease-in-out">
                {form === "login" ? <Login /> : <Signup />}
              </div>
              
              {/* Guest User Option for Login */}
              {form === "login" && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New to Talk-A-Tive? 
                    <button 
                      onClick={() => setForm("signup")}
                      className="ml-2 text-blue-500 dark:text-blue-400 hover:underline font-medium"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              )}
              
              {/* Already have account for Signup */}
              {form === "signup" && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? 
                    <button 
                      onClick={() => setForm("login")}
                      className="ml-2 text-blue-500 dark:text-blue-400 hover:underline font-medium"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
