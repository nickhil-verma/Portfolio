"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export function Drawer({ isOpen, onClose, title, description, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 transition-opacity animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-[#111113] border-l border-white/[0.08] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#141417]">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
            {description && <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>}
          </div>
          <IconButton title="Close drawer" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-white/[0.08] bg-[#141417] flex justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Dialog({ isOpen, onClose, title, description, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <IconButton title="Close dialog" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {description && <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{description}</p>}

        {children}

        {footer && <div className="mt-6 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
