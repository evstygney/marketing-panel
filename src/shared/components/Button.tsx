import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
};

export const Button = ({ children, variant = "primary", className = "", ...props }: Props) => {
  const variantClass =
    variant === "ghost" ? "ghost-button" : variant === "danger" ? "danger-button" : "button";

  return (
    <button {...props} className={`${variantClass} ${className}`.trim()}>
      {children}
    </button>
  );
};
