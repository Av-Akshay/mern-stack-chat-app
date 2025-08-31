import React, { useState } from "react";
import Input from "../helper/Input";
import Button from "../helper/Button";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const { errors, handleSubmit, register, submitForm, message, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <>
      <form
        className="p-5 flex flex-col gap-5 transition-all"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="mb-1">
          <Input
            label={"Email Address"}
            type={"email"}
            placeholder={"Enter your email"}
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
            <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors?.email?.message}</p>
          )}
        </div>
        
        <div className="mb-1 relative">
          <Input
            label={"Password"}
            type={showPassword ? "text" : "password"}
            placeholder={"Enter password"}
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
            className="absolute right-3 top-10 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors?.password?.message}</p>
          )}
        </div>
        
        {message && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded-md text-sm text-red-700 dark:text-red-300">
            {message}
          </div>
        )}
        
        <div className="mt-2">
          <Button 
            type={"submit"} 
            text={isLoading ? "Logging in..." : "Login"} 
            className={"bg-blue-600 hover:bg-blue-700"} 
            disabled={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default Login;
