import React from "react";
import Input from "../helper/Input";

const Login = () => {
  return (
    <div className="px-5 py-2 flex flex-col gap-5 ">
      <Input
        label={"Email Address :-"}
        type={"email"}
        placeholder={"Enter your email"}
      />
      <Input
        label={"Password :-"}
        type={"password"}
        placeholder={"Enter password"}
      />
    </div>
  );
};

export default Login;
