"use client";

import React from "react";

export function Button({
  children,
  variant = "primary", // primary | secondary | ghost | danger
  size = "md", // sm | md | lg
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants = {
    primary: "bg-red-600 hover:bg-red-500 text-white shadow-sm",
    secondary:
      "bg-[#1A1A1E] hover:bg-[#222226] text-zinc-200 border border-white/[0.08] hover:border-white/[0.15]",
    ghost:
      "bg-transparent hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-100",
    danger: "bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
    md: "text-xs px-3.5 py-2 gap-2 h-9",
    lg: "text-sm px-4 py-2.5 gap-2 h-10",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
