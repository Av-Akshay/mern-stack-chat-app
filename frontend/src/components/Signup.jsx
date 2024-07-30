import React from "react";

import useRegister from "../hooks/useRegister";
import Input from "../helper/Input";
import Button from "../helper/Button";

const Signup = () => {
  const { errors, handleSubmit, register, watch, submitForm } = useRegister();
  const password = watch("password");

  return (
    <div className="px-5 py-2">
      <form
        className="flex flex-col gap-2 transition-all"
        onSubmit={handleSubmit(submitForm)}
      >
        <Input
          label={"Name :-"}
          placeholder={"Enter your name"}
          type={"text"}
          {...register("name", { required: true })}
        />
        {errors.name && <p> Name is required</p>}
        <Input
          label={"Email Address :-"}
          placeholder={"Enter your email address"}
          type={"email"}
          {...register("email", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9. _%-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="error-message">{errors?.email?.message}</p>
        )}
        <Input
          label={"Password :-"}
          placeholder={"Enter password"}
          type={"password"}
          {...register("password", {
            required: true,
            validate: {
              minLength: (value) =>
                value.length >= 8 || "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <p className="error-message">{errors?.password?.message}</p>
        )}
        <Input
          label={"Confirm password :-"}
          placeholder={"Confirm password"}
          type={"password"}
          {...register("confirm-password", {
            required: true,
            validate: {
              valueMatch: (value) =>
                value === password || "Passwords must match",
            },
          })}
        />
        {errors["confirm-password"] && (
          <p className="error-message">{errors["confirm-password"]?.message}</p>
        )}

        <Button type="submit" text={"Sign up"} className={"bg-blue-600"} />
      </form>
    </div>
  );
};

export default Signup;
