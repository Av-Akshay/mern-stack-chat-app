import React from "react";

const DropDown = ({ handleMouseEnter, handelShowPopup, handleMouseLeave }) => {
  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className=" absolute cursor-pointer top-[3rem] w-[5.5rem] border bg-slate-100 rounded-md overflow-hidden"
    >
      <div
        onClick={handelShowPopup}
        className="w-full hover:bg-slate-200 px-2 py-1"
      >
        Profile
      </div>
      <div className="w-full hover:bg-slate-200 px-2 py-1">Logout</div>
    </div>
  );
};

export default DropDown;
