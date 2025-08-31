import React from "react";

const Input = React.forwardRef(function Input(
  { label, type, placeholder, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={label} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        id={label}
        ref={ref}
        {...props}
        className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 font-medium border border-gray-300 dark:border-gray-700 transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500 
        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
      />
    </div>
  );
});

export default Input;
