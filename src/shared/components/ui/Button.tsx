import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

type ButtonVariant = "filled" | "text";

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary shadow-sm hover:bg-primary-dark hover:shadow-md",
  text: "text-primary hover:bg-primary/10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "filled", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ variant = "filled", className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={`${baseClasses} ${variantClasses[variant]} ${className ?? ""}`} {...props}>
      {children}
    </Link>
  );
}
