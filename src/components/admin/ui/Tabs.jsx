"use client";

import React from "react";

export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div className={`inline-flex items-center p-1 bg-[#141417] border border-white/[0.08] rounded-lg gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all select-none ${
              isActive
                ? "bg-[#222226] text-zinc-100 shadow-sm border border-white/[0.08]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
