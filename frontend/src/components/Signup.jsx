import React from "react";
import Input from "../helper/Input";

const Signup = () => {
  return (
    <div className="px-5 py-2 flex flex-col gap-2">
      <Input label={"Name :-"} placeholder={"Enter your name"} type={"text"} />
      <Input
        label={"Email Address :-"}
        placeholder={"Enter your email address"}
        type={"email"}
      />
      <Input
        label={"Password :-"}
        placeholder={"Enter password"}
        type={"password"}
      />
      <Input
        label={"Confirm password :-"}
        placeholder={"Confirm password"}
        type={"password"}
      />
      <Input label={"Upload your picture :-"} type={"file"} />
    </div>
  );
};

export default Signup;
