import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "lg";
  icon?: ReactNode;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "sm",
  icon,
  loading,
  children,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle size={18} className="spin" aria-hidden /> : icon}
      <span>{children}</span>
    </button>
  );
}
