"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Heart } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper supporting isDark and premium white coordinator glow
const DetailSpotlightCard = ({ children, isDark, className = "" }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[32px] transition-all duration-500 shadow-2xl ${
        isDark 
          ? "glass-card hover:border-white/10" 
          : "glass-card-light hover:border-black/10"
      } ${className}`}
    >
      {/* Reflective top highlight */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-white/10" : "via-black/5"} to-transparent pointer-events-none z-20`} />
      
      {/* Mouse spotlight light effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, ${
            isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)"
          }, transparent 80%)`,
        }}
      />

      {/* Dynamic Border Spotlight mask matching macOS dock coordinate glows */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none transition-opacity duration-300 z-10"
          style={{
            border: isDark ? "1.5px solid rgba(255, 255, 255, 0.4)" : "1.5px solid rgba(0, 0, 0, 0.15)",
            background: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, ${
              isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)"
            }, transparent 80%)`,
            maskImage: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
          }}
        />
      )}
      
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

// Senior-level React-based Markdown-to-HTML parser function with dynamic dark/light colors
function renderMarkdownContent(md, isDark) {
  if (!md) return "";
  const lines = md.split("\n");
  return lines.map((line, idx) => {
    const text = line.trim();

    // Headers
    if (text.startsWith("### ")) {
      return (
        <h4 key={idx} className={`text-base sm:text-lg font-bold font-outfit mt-6 mb-3 ${
          isDark ? "text-white" : "text-zinc-950"
        }`}>
          {text.substring(4)}
        </h4>
      );
    }
    if (text.startsWith("## ")) {
      return (
        <h3 key={idx} className={`text-lg sm:text-xl font-bold font-outfit mt-8 mb-4 ${
          isDark ? "text-white" : "text-zinc-950"
        }`}>
          {text.substring(3)}
        </h3>
      );
    }
    if (text.startsWith("# ")) {
      return (
        <h2 key={idx} className={`text-2xl sm:text-3xl font-extrabold font-outfit mt-10 mb-6 ${
          isDark ? "text-white" : "text-zinc-950"
        }`}>
          {text.substring(2)}
        </h2>
      );
    }

    // Bullet lists
    if (text.startsWith("- ") || text.startsWith("* ")) {
      return (
        <li key={idx} className={`list-disc pl-1 ml-6 text-sm mb-2 ${
          isDark ? "text-zinc-300" : "text-zinc-700"
        }`}>
          {text.substring(2)}
        </li>
      );
    }

    // Blockquote
    if (text.startsWith("> ")) {
      return (
        <blockquote key={idx} className={`border-l-4 border-red-500 pl-4 py-2 my-6 text-sm italic rounded-r-lg ${
          isDark ? "text-zinc-400 bg-white/5" : "text-zinc-600 bg-black/5"
        }`}>
          {text.substring(2)}
        </blockquote>
      );
    }

    // Code blocks markers
    if (text.startsWith("```")) {
      return null;
    }

    // Empty lines
    if (text === "") {
      return <div key={idx} className="h-4" />;
    }

    // Paragraph with inline bold **text** parsing
    const boldRegex = /\*\*(.*?)\*\*/g;
    let parts = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className={`font-bold ${isDark ? "text-white" : "text-zinc-950"}`}>
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <p key={idx} className={`text-sm sm:text-base leading-relaxed mb-4 ${
        isDark ? "text-zinc-300" : "text-zinc-700"
      }`}>
        {parts}
      </p>
    );
  });
}

// Fallback base blogs with assigned static IDs
const baseBlogs = [
  {
    _id: "fb1",
    title: "Building Scale: Custom AI Indexing Engines with Playwright and NLP",
    excerpt: "Deep dive into building data ingestion systems for large language models, crawling job directories, parsing resumes with spaCy, and contextually mapping profiles.",
    content: "# Building Scale: Custom AI Indexing Engines\n\nModern artificial intelligence applications require highly context-rich indexing setups to feed Large Language Models. In this architecture breakdown, we crawler and index over **200,000+ job positions** in real-time.\n\n## 🛠️ The Data Ingestion Tech Stack\n\n- **Playwright** for dynamic JavaScript crawler execution\n- **spaCy NLP** for parsing unstructured resume fields\n- **Ollama 3B** for local, cost-effective embeddings mapping\n\n> \"Building scalable crawlers is 10% coding, 90% bypassing cloud protection grids gracefully.\"\n\n### Ingestion Pipeline Benchmarks\nDynamic sitemap crawling was optimized by **40%**, resulting in extremely rapid database indexing loops.",
    date: "May 15, 2026",
    readTime: "7 min read",
    category: "AI & NLP",
    likes: 42,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    created_at: "2026-05-15T00:00:00.000Z",
  },
  {
    _id: "fb2",
    title: "Supercharging Frontend Performance: WordPress to React Migration",
    excerpt: "An architectural review of WordPress migration processes, setting up JWT auth wrappers, configuring lightweight static templates, and optimizing load speed benchmarks by 40%.",
    content: "# WordPress to React Migration Guide\n\nLegacy WordPress installations often suffer from massive layout shifts, asset bloated styling rules, and heavy response latencies. This write-up reviews structural steps to migrate standard CMS interfaces to high-performance Next.js containers.\n\n## ⚡ Performance Uplifts\n\n- Page load speed was improved by **40%**.\n- Express database forms latency dropped by **30%**.\n- Implemented client-side **JWT Authentication tokens** for robust role-based routing (RBAC).\n\n### Key Migration Lessons\nAlways keep sitemap references intact during migration so standard Google indexes remain operational without any indexing losses.",
    date: "Apr 22, 2026",
    readTime: "5 min read",
    category: "Architecture",
    likes: 29,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    created_at: "2026-04-22T00:00:00.000Z",
  },
  {
    _id: "fb3",
    title: "RAG Pipelines in Extreme Hackathons: Lessons from MOSDAC ISRO",
    excerpt: "Unpacking vector databases (FAISS), chunking space meteorology reports, embedding datasets on limited RAM setups, and loading quantized Gemma 3B models contextually.",
    content: "# RAG Pipelines in Extreme Hackathons\n\nDeploying high-quality vector database models under extreme hackathon conditions (e.g. 24-hour limits, limited hardware capacities) requires lightweight, highly targeted chunking architectures.\n\n## 🛰️ ISRO Space Hackathon Strategy\n\n- Used **FAISS** local database indexes instead of heavy cloud alternatives\n-Quantized meteorology reports using customized spaCy modules\n- Deployed quantized **Gemma 3B** locally to bypass API rate throttling limits\n\n### Results & Achievements\nThis system was named a **Grand Finalist (Top 5 / 500)** in the prestigious SIH hackathon!",
    date: "Mar 08, 2026",
    readTime: "9 min read",
    category: "Space Tech",
    likes: 56,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    created_at: "2026-03-08T00:00:00.000Z",
  },
];

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [isDark, setIsDark] = useState(true);

  // Webpage-wide theme state synchronization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const darkVal = savedTheme === "dark";
      setIsDark(darkVal);
      if (darkVal) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch local storage liked items on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("liked_blogs");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikedBlogIds(parsed);
      }
    } catch (e) {
      console.error("Failed to load liked blogs:", e);
    }
  }, []);

  // Fetch details and interactions
  useEffect(() => {
    if (!id) return;
    
    const loadBlogData = async () => {
      let activeBlog = null;

      try {
        // Fetch live blogs from MongoDB
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) {
          const matched = data.find(b => b._id === id);
          if (matched) {
            activeBlog = matched;
          }
        }
      } catch (err) {
        console.error("Failed to fetch live blogs:", err);
      }

      // Check fallbacks if not found in database
      if (!activeBlog) {
        const fallbackMatch = baseBlogs.find(b => b._id === id);
        if (fallbackMatch) {
          activeBlog = fallbackMatch;
          
          // Apply local storage liked state modifications in-memory
          const stored = localStorage.getItem("liked_blogs");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.includes(id) && !activeBlog.hasLikedIncremented) {
              activeBlog.likes = (activeBlog.likes || 0) + 1;
              activeBlog.hasLikedIncremented = true;
            }
          }
        }
      }

      setBlog(activeBlog);
      setLoading(false);

      // Load specific likes count from interactions database
      try {
        const res = await fetch("/api/interactions");
        const data = await res.json();
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => {
            map[item._id] = item.count;
          });
          setInteractions(map);
        }
      } catch (err) {
        console.error("Failed to fetch interactions:", err);
      }
    };

    loadBlogData();
  }, [id]);

  const handleToggleLike = async () => {
    if (!blog) return;
    const isLiked = likedBlogIds.includes(id);
    const action = isLiked ? "unlike" : "like";

    // 1. Toggle locally for instant responsive UI feedback
    let nextLiked;
    if (isLiked) {
      nextLiked = likedBlogIds.filter(x => x !== id);
    } else {
      nextLiked = [...likedBlogIds, id];
    }
    setLikedBlogIds(nextLiked);
    localStorage.setItem("liked_blogs", JSON.stringify(nextLiked));

    // Calculate current likes count
    const currentCount = (interactions[id] !== undefined)
      ? interactions[id]
      : (blog.likes || 0);
    const increment = isLiked ? -1 : 1;
    const newCount = Math.max(0, currentCount + increment);

    // Update interactions locally
    setInteractions(prev => ({ ...prev, [id]: newCount }));

    try {
      const fallbackVal = blog.likes || 0;
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(id)}&type=like&action=${action}&fallback=${fallbackVal}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setInteractions(prev => ({ ...prev, [id]: data.count }));
        setBlog(prev => prev ? { ...prev, likes: data.count } : null);
      }
    } catch (err) {
      console.error("Failed to update likes in database:", err);
    }
  };

  const isLiked = likedBlogIds.includes(id);
  const totalLikes = (interactions[id] !== undefined)
    ? interactions[id]
    : (blog ? (blog.likes || 0) : 0);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider text-zinc-500 animate-pulse uppercase">Assembling article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
      }`}>
        <DetailSpotlightCard isDark={isDark} className="max-w-md p-10 text-center">
          <h2 className="text-xl font-bold font-outfit mb-3 text-red-500">Article Not Found</h2>
          <p className={`text-xs mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            The insight you are searching for might have been archived or removed by the author.
          </p>
          <Link href="/blogs">
            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-500/10">
              Return to Insights
            </button>
          </Link>
        </DetailSpotlightCard>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 noise-overlay relative overflow-hidden p-6 sm:p-10 lg:p-16 ${
      isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
    }`}>
      {/* Grid Mesh Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "grid-mesh" : "grid-mesh-light"}`} />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Navigation */}
        <div className="mb-10 flex justify-between items-center">
          <Link href="/blogs">
            <motion.button 
              whileHover={{ x: -4 }}
              className={`flex items-center space-x-2 text-xs font-semibold tracking-wide transition-colors py-2 px-3 border rounded-xl backdrop-blur-md ${
                isDark 
                  ? "text-zinc-400 hover:text-white bg-white/5 border-white/5" 
                  : "text-zinc-600 hover:text-zinc-950 bg-black/5 border-black/5"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Insights</span>
            </motion.button>
          </Link>

          {/* Top-Right Mini Like Hook */}
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
            <span className="font-bold text-xs">{totalLikes}</span>
          </button>
        </div>

        {/* Detailed Layout Card Container */}
        <DetailSpotlightCard isDark={isDark} className="p-8 sm:p-12 md:p-16">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-zinc-400 border-b border-white/5 pb-6">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              isDark 
                ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                : "bg-red-500/5 text-red-600 border border-red-500/10"
            }`}>
              {blog.category}
            </span>
            
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{blog.date || new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{blog.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit leading-tight mb-8 ${
            isDark ? "text-white" : "text-zinc-950"
          }`}>
            {blog.title}
          </h1>

          {/* Banner Image */}
          {blog.bannerUrl && (
            <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-[24px] mb-10 shadow-lg border border-white/5">
              <img
                src={blog.bannerUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/50 via-black/10" : "from-black/20 via-transparent"} to-transparent`} />
            </div>
          )}

          {/* Markdown Content Block */}
          <div className="font-sans leading-relaxed select-text border-t border-white/5 pt-10">
            {renderMarkdownContent(blog.content, isDark)}
          </div>

          {/* Interactive Footer Likes Hook */}
          <div className="border-t border-white/5 mt-12 pt-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Liked this write-up?
              </span>
              <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Show your appreciation with a star.
              </span>
            </div>
            
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
              <span className="font-bold text-sm">{totalLikes}</span>
            </button>
          </div>
        </DetailSpotlightCard>
      </div>
    </div>
  );
}
