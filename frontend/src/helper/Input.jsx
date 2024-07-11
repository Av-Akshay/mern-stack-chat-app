import React from "react";

const Input = ({ label, type, placeholder }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor="">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent rounded-md p-2 capitalize font-medium border border-white"
      />
    </div>
  );
};

export default Input;
