import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`px-4 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export { Input };
