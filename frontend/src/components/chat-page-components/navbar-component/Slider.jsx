import React from "react";
import useGetChats from "../../../hooks/useGetChats";
import UsersChats from "./slider-component/UsersChats";

const Slider = ({ slider, closeSlider }) => {
  const {
    register,
    handleSubmit,
    errors,
    submitForm,
    loading,
    message,
    userChat,
    handelAccessChat,
  } = useGetChats();

  return (
    <div
      className={`w-[20rem] bg-slate-200 h-screen absolute top-0 left-0 transition-all ${
        slider ? "translate-x-[0rem]" : "translate-x-[-20rem]"
      }`}
    >
      <div className="px-2">
        <div className="h-[10vh] flex items-center justify-between ">
          <h1 className="font-medium ">Search User</h1>
          <button
            onClick={closeSlider}
            className=" border-2 border-black py-1 px-2 rounded-md font-semibold "
          >
            X
          </button>
        </div>
        <div className=" flex items-center flex-col gap-5 ">
          <form
            onSubmit={handleSubmit(submitForm)}
            className="flex items-center justify-between gap-5"
          >
            <div className="block">
              <input
                className="py-1 px-2 rounded"
                type="text"
                placeholder="Search..."
                {...register("chats", { required: true })}
              />
              {errors.chats && (
                <p className="text-red-500 font-medium">Input is required.</p>
              )}
            </div>
            <button
              type="submit"
              className="font-normal py-1 px-2 border border-black rounded-md "
            >
              Go
            </button>
          </form>

          <div className="h-[78vh] flex flex-col gap-2 overflow-auto">
            {loading && <h1>Loading...</h1>}
            {message && <h1> {message} </h1>}
            {userChat &&
              userChat.length > 0 &&
              userChat?.map((item) => {
                return (
                  <UsersChats
                    handelAccessChat={handelAccessChat}
                    key={item?._id}
                    item={item}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
