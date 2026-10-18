import { InputProps } from "@/types";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-(--text-main)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-(--bg-card) text-(--text-main) border-(--border-color) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all ${
            error ? "border-(--color-danger) focus:ring-(--color-danger)" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-(--color-danger) font-medium">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
