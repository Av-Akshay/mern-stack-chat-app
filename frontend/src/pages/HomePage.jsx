import React, { useState } from "react";
import { Login, Signup } from "../components/index";

const HomePage = () => {
  const [form, setForm] = useState("login");
  return (
    <div
      className={`bg-slate-950 w-full flex items-center justify-center min-h-screen ${
        form !== "login" ? "py-10 " : ""
      }`}
    >
      <div className="w-1/2 flex flex-col gap-5">
        <div className="w-full py-2 text-center bg-black text-white rounded-md">
          <h1 className="font-medium"> Talk-A-Tive</h1>
        </div>
        <div className="w-full shadow-form-shadow rounded-md py-5 bg-black text-white">
          <div className="w-full flex items-start flex-col">
            <div className="w-full flex items-start px-2 transition-all">
              <button
                onClick={() => {
                  setForm("login");
                }}
                className={`w-full ${
                  form === "login" && "bg-slate-700 rounded-2xl py-1"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setForm("sighup");
                }}
                className={`w-full ${
                  form === "sighup" && "bg-slate-700 rounded-2xl py-1"
                }`}
              >
                Sign Up
              </button>
            </div>
            <div className="w-full transition-all">
              {form === "login" ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
