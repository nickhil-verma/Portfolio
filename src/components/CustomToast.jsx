"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export default function CustomToast({ message, type = "success", isDark = true, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: -25, scale: 0.9, x: "-50%" }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className={`fixed top-8 left-1/2 z-[100] px-5 py-3 rounded-full border shadow-2xl backdrop-blur-xl flex items-center space-x-2.5 max-w-[90vw] text-xs font-semibold font-sans select-none tracking-wide transition-colors ${
            isDark 
              ? "bg-[#0c0c0e]/95 border-white/10 text-white shadow-black/80" 
              : "bg-white/95 border-black/10 text-zinc-900 shadow-zinc-300/40"
          }`}
        >
          {type === "star" || type === "like" ? (
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4 text-red-500" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
