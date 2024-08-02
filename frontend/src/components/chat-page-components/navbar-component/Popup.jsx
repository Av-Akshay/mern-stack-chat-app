import React from "react";
import profile from "../../../assets/images/chatAppBackground.avif";

const Popup = ({ handelClosePopup }) => {
  return (
    <div className="absolute top-0 bg-[rgba(0,0,0,0.8)] h-screen w-full flex items-center justify-center">
      <div className="relative h-[60vh] w-2/5 bg-white rounded-xl ">
        <button
          onClick={handelClosePopup}
          className="font-bold px-3 py-1 absolute right-5 top-5 border-2 border-black rounded-md "
        >
          X
        </button>
        <h1 className="text-center mt-10 text-3xl font-medium capitalize">
          Akshay Chauhan
        </h1>
        <div className="flex flex-col gap-10 items-center justify-center mt-10">
          <img
            className="w-[6rem] h-[6rem] rounded-full"
            src={profile}
            alt="profile"
          />
          <div>
            <p>
              {" "}
              <span className="font-medium">Email</span> :-
              akshuChauhan1jan@gmail.com{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
