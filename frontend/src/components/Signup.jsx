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
    <div className="px-5 py-2">
      <form
        className="flex flex-col gap-4 transition-all"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="mb-1">
          <Input
            label={"Name"}
            placeholder={"Enter your name"}
            type={"text"}
            disabled={isLoading}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-1">
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
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-1 relative">
          <Input
            label={"Password"}
            placeholder={"Enter password"}
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
            className="absolute right-3 top-10 text-sm text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-1 relative">
          <Input
            label={"Confirm Password"}
            placeholder={"Confirm password"}
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
            className="absolute right-3 top-10 text-sm text-gray-400 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {errors["confirm-password"] && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors["confirm-password"].message}</p>
          )}
        </div>

        {message && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded-md text-sm text-white">
            {message}
          </div>
        )}

        <div className="mt-2">
          <Button 
            type="submit" 
            text={isLoading ? "Signing up..." : "Sign up"} 
            className={"bg-blue-600 hover:bg-blue-700"} 
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
