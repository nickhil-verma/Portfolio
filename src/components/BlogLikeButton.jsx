"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

export default function BlogLikeButton({ blogId, initialLikes, isDark, mini = false }) {
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [likesCount, setLikesCount] = useState(initialLikes);

  // Sync with client-side localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("liked_blogs");
      if (stored) {
        setLikedBlogIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load liked blogs state:", e);
    }
  }, []);

  const handleToggleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isLiked = likedBlogIds.includes(blogId);
    const action = isLiked ? "unlike" : "like";

    // 1. Instantly toggle state locally to feel highly responsive
    let nextLiked;
    if (isLiked) {
      nextLiked = likedBlogIds.filter(x => x !== blogId);
    } else {
      nextLiked = [...likedBlogIds, blogId];
      toast.success("Thank you for liking! ❤️");
    }
    setLikedBlogIds(nextLiked);
    localStorage.setItem("liked_blogs", JSON.stringify(nextLiked));

    const increment = isLiked ? -1 : 1;
    const newCount = Math.max(0, likesCount + increment);
    setLikesCount(newCount);

    // 2. Safely sync changes to the database interactions API
    try {
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(blogId)}&type=like&action=${action}&fallback=${initialLikes}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setLikesCount(data.count);
      }
    } catch (err) {
      console.error("Failed to update likes in interactions database:", err);
    }
  };

  const isLiked = likedBlogIds.includes(blogId);

  if (mini) {
    return (
      <button
        onClick={handleToggleLike}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
          isLiked
            ? isDark
              ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/5"
              : "bg-red-500/5 text-red-600 border-red-500/20 shadow-sm"
            : isDark
              ? "bg-white/5 text-zinc-500 hover:text-white border-white/5"
              : "bg-black/5 text-zinc-400 hover:text-zinc-900 border-black/5"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? "fill-current text-red-500" : ""}`} />
        <span className="font-bold text-xs">{likesCount}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl border transition-all ${
        isLiked
          ? isDark
            ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/10"
            : "bg-red-500/5 text-red-600 border-red-500/20 shadow-sm"
          : isDark
            ? "bg-white/5 text-zinc-500 hover:text-white border-white/5"
            : "bg-black/5 text-zinc-400 hover:text-zinc-900 border-black/5"
      }`}
    >
      <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-current text-red-500" : ""}`} />
      <span className="font-bold text-sm">{likesCount}</span>
    </button>
  );
}
