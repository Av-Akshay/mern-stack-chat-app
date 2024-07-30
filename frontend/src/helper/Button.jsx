import React from "react";

const Button = ({ type, text, className }) => {
  return (
    <div className="w-full">
      <button
        type={type}
        className={`w-full py-2 font-medium text-white rounded-md capitalize ${className}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
