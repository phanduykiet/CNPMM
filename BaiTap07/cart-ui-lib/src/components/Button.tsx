import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const Button = ({ children, onClick, className = "" }: ButtonProps) => (
  <button onClick={onClick} className={`btn btn-primary m-1 ${className}`}>
    {children}
  </button>
);

export default Button;
