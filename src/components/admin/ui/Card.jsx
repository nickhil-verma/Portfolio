"use client";

import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-[#111113] border border-white/[0.08] rounded-xl p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, delta, sparkline, icon: Icon, className = "" }) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-zinc-400 tracking-tight">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-100">{value}</span>
        {delta && (
          <span
            className={`text-[10px] font-medium font-mono px-1.5 py-0.5 rounded ${
              delta.startsWith("+")
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {sparkline && <div className="mt-3 h-8 w-full">{sparkline}</div>}
    </Card>
  );
}
