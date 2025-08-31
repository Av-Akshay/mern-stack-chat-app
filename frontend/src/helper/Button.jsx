import React from "react";

const Button = ({ type, text, className, onClick, disabled }) => {
  return (
    <div className="w-full">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 font-medium text-white rounded-lg capitalize transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
