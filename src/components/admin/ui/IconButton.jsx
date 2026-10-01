"use client";

import React from "react";

export function IconButton({
  children,
  variant = "ghost", // ghost | secondary | danger
  size = "md",
  title,
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-40 select-none";
  const variants = {
    ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]",
    secondary: "bg-[#1A1A1E] text-zinc-300 hover:bg-[#222226] border border-white/[0.08]",
    danger: "text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20",
  };
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-9 h-9 text-sm",
  };

  return (
    <button
      title={title}
      aria-label={title}
      className={`${base} ${variants[variant] || variants.ghost} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
