import React from "react";

const Slider = ({ slider, closeSlider }) => {
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
        <div>
          <div className="flex items-center justify-between gap-5">
            <input
              className="py-1 px-2 rounded"
              type="text"
              placeholder="Search..."
            />
            <button className="font-normal py-1 px-2 border border-black rounded-md ">
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
