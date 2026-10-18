import { ButtonProps } from "@/types";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--color-primary)] hover:opacity-90 text-white focus:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-main)] focus:ring-[var(--border-color)]",
    danger:
      "bg-[var(--color-danger)] hover:opacity-90 text-white focus:ring-[var(--color-danger)]",
    outline:
      "border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] focus:ring-[var(--border-color)]",
    ghost:
      "hover:bg-[var(--bg-subtle)] text-[var(--text-main)] focus:ring-[var(--border-color)]",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
