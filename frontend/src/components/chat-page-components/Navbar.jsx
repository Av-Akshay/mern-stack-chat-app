import React, { useState } from "react";
import chatBackground from "../../assets/images/chatAppBackground.avif";
import Slider from "./navbar-component/Slider";
import DropDown from "./navbar-component/DropDown";
import Popup from "./navbar-component/Popup";
import useGetChats from "../../hooks/useGetChats";

const Navbar = () => {
  const [slider, setSlider] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [popup, setPopup] = useState(false);
  const { sliderIsOpen, handelCloseSlider, handelOpenSlider } = useGetChats();

  const handleMouseLeave = () => {
    setDropDown(false);
  };
  const handleMouseEnter = () => {
    setDropDown(true);
  };
  const handelShowPopup = () => {
    setPopup(true);
  };

  const handelClosePopup = () => {
    setPopup(false);
  };
  return (
    <>
      <div className="h-[10vh] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <Slider slider={sliderIsOpen} closeSlider={handelCloseSlider} />
        <div className="w-11/12 m-auto flex items-center justify-between">
          <div>
            <button
              onClick={handelOpenSlider}
              className="border rounded-md bg-gray-200 px-2 "
            >
              Search User
            </button>
          </div>
          <div>
            <h1 className="text-white">Talk-A-Tive</h1>
          </div>
          <div className="relative">
            <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex items-center justify-center gap-2 rounded-md hover:bg-gray-300 text-white hover:text-slate-950 px-5 py-2 transition-all"
            >
              <img
                className="w-7 h-7 rounded-full"
                src={chatBackground}
                alt="user"
              />
              <p className="font-semibold text-xl"> V </p>
            </button>
            {dropDown && (
              <DropDown
                handleMouseLeave={handleMouseLeave}
                handelShowPopup={handelShowPopup}
                handleMouseEnter={handleMouseEnter}
              />
            )}
          </div>
        </div>
      </div>
      {popup && <Popup handelClosePopup={handelClosePopup} />}
    </>
  );
};

export default Navbar;
