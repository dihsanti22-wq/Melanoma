"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

type StyleMap = Record<string, React.CSSProperties>;

const variantStyles: StyleMap = {
  primary:   { background: "var(--btn-primary-bg)",   color: "var(--btn-primary-text)",  boxShadow: "var(--btn-primary-shadow)", border: "none" },
  secondary: { background: "var(--btn-secondary-bg)", color: "var(--btn-primary-text)",  border: "none" },
  danger:    { background: "var(--btn-danger-bg)",    color: "var(--btn-primary-text)",  border: "none" },
  ghost:     { background: "var(--btn-ghost-bg)",     color: "var(--btn-ghost-text)",    border: "1px solid var(--btn-ghost-border)" },
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary", size = "md", loading = false,
  disabled, children, className = "", style, ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ display: "inline-flex" }}
    >
      <button
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-semibold cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />}
        {children}
      </button>
    </motion.div>
  );
}
