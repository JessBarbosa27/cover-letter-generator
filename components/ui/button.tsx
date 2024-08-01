import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 flex items-center justify-center rounded focus:outline-none ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export { Button };
