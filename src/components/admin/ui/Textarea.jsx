"use client";

import React from "react";

export const Textarea = React.forwardRef(function Textarea(
  { label, error, helperText, className = "", ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-medium text-zinc-400 tracking-tight">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full bg-[#141417] border ${
          error ? "border-rose-500/50 focus:border-rose-500" : "border-white/[0.08] focus:border-red-500/60"
        } rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all font-sans resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[10px] text-zinc-500">{helperText}</p>}
    </div>
  );
});
