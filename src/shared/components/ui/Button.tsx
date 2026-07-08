import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "text";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "filled", className, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50";
    const variants = {
      filled: "bg-primary text-on-primary shadow-sm hover:bg-primary-dark hover:shadow-md",
      text: "text-primary hover:bg-primary/10",
    };

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className ?? ""}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
