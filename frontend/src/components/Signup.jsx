import React, { useState } from "react";

import useRegister from "../hooks/useRegister";
import Input from "../helper/Input";
import Button from "../helper/Button";

const Signup = () => {
  const { errors, handleSubmit, register, watch, submitForm, message, isLoading } = useRegister();
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-4 transition-all"
      onSubmit={handleSubmit(submitForm)}
    >
      {/* Welcome Text */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Create Account</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Join us and start chatting today</p>
      </div>

      {/* Name Field */}
      <div>
        <Input
          label={"Name"}
          placeholder={"Enter your name"}
          type={"text"}
          disabled={isLoading}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <Input
          label={"Email Address"}
          placeholder={"Enter your email address"}
          type={"email"}
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9. _%-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <Input
          label={"Password"}
          placeholder={"Create a strong password"}
          type={showPassword ? "text" : "password"}
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            validate: {
              minLength: (value) =>
                value.length >= 8 || "Password must be at least 8 characters",
            },
          })}
        />
        <button 
          type="button"
          className="absolute right-3 top-10 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isLoading}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
        {errors.password && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <Input
          label={"Confirm Password"}
          placeholder={"Re-enter your password"}
          type={showConfirmPassword ? "text" : "password"}
          disabled={isLoading}
          {...register("confirm-password", {
            required: "Please confirm your password",
            validate: {
              valueMatch: (value) =>
                value === password || "Passwords must match",
            },
          })}
        />
        <button 
          type="button"
          className="absolute right-3 top-10 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={isLoading}
        >
          {showConfirmPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
        {errors["confirm-password"] && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors["confirm-password"].message}</p>
        )}
      </div>

      {/* Password Strength Indicator */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Password Requirements:</p>
        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-2 text-xs ${password?.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {password?.length >= 8 ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span>At least 8 characters</span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {message && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {message}
        </div>
      )}


      {/* Submit Button */}
      <div className="mt-2">
        <Button 
          type="submit" 
          text={isLoading ? "Creating account..." : "Sign up"} 
          className={"bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"} 
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default Signup;
