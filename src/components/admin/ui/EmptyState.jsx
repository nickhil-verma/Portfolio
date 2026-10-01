"use client";

import React from "react";

export function EmptyState({ title, description, action, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-white/[0.08] bg-[#111113]">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-zinc-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h4 className="text-xs font-semibold text-zinc-200">{title}</h4>
      {description && <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
