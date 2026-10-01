"use client";

import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className={`w-full text-left border-collapse text-xs ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-[#161619] border-b border-white/[0.08] text-[11px] font-medium text-zinc-400">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-white/[0.06] bg-[#111113]">{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={`hover:bg-white/[0.02] transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`p-3 text-zinc-300 ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th className={`p-3 font-medium text-zinc-400 ${className}`} {...props}>
      {children}
    </th>
  );
}
