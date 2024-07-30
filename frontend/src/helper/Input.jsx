import React from "react";

const Input = React.forwardRef(function Input(
  { label, type, placeholder, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        id={label}
        ref={ref}
        {...props}
        className="bg-transparent rounded-md p-2 font-medium border border-white"
      />
    </div>
  );
});

export default Input;
