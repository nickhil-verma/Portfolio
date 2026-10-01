"use client";

import React from "react";

export function Select({ label, options = [], className = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-medium text-zinc-400 tracking-tight">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-[#141417] border border-white/[0.08] focus:border-red-500/60 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all font-sans cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#141417] text-zinc-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
