import React from "react";
import Input from "../helper/Input";
import Button from "../helper/Button";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const { errors, handleSubmit, register, submitForm } = useLogin();
  return (
    <>
      <form
        className="p-5 flex flex-col gap-5 transition-all"
        onSubmit={handleSubmit(submitForm)}
      >
        <Input
          label={"Email Address :-"}
          type={"email"}
          placeholder={"Enter your email"}
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
          type={"password"}
          placeholder={"Enter password"}
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
        <Button type={"submit"} text={"Login"} className={"bg-blue-600"} />
        <Button text={"Get guest user credential"} className={"bg-red-600"} />
      </form>
    </>
  );
};

export default Login;
