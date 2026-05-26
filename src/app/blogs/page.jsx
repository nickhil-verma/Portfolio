"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomToast from "../../components/CustomToast";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Heart, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper supporting isDark and premium white coordinator glow
const BlogSpotlightCard = ({ children, isDark, className = "" }) => {
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
      className={`relative overflow-hidden rounded-[24px] transition-all duration-200 shadow-xl hover:-translate-y-1 ${
        isDark 
          ? "glass-card hover:border-white/10" 
          : "glass-card-light hover:border-black/10"
      } ${className}`}
    >
      {/* Reflective top highlight */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-white/10" : "via-black/5"} to-transparent pointer-events-none z-20`} />
      
      {/* Mouse spotlight light effect (Premium White perimeter light) */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${
            isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.025)"
          }, transparent 80%)`,
        }}
      />

      {/* Dynamic Border Spotlight mask matching macOS dock coordinate glows */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-300 z-10"
          style={{
            border: isDark ? "1.5px solid rgba(255, 255, 255, 0.4)" : "1.5px solid rgba(0, 0, 0, 0.15)",
            background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, ${
              isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)"
            }, transparent 80%)`,
            maskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
          }}
        />
      )}
      
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

// Fallback base blogs with assigned static IDs (fb1, fb2, fb3)
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

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveBlogs, setLiveBlogs] = useState([]);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

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
        // Sync static fallback blogs likes count in memory on mount
        baseBlogs.forEach(b => {
          if (parsed.includes(b._id) && !b.hasLikedIncremented) {
            b.likes = (b.likes || 0) + 1;
            b.hasLikedIncremented = true;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load liked blogs:", e);
    }
  }, []);

  // Fetch dynamic blogs and interactions from MongoDB on mount
  useEffect(() => {
    const fetchBlogsAndInteractions = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch live blogs:", err);
      }

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
        console.error("Failed to load interactions:", err);
      }
    };
    fetchBlogsAndInteractions();
  }, []);

  // Likes handling connected directly to unified interactions API
  const handleToggleLikeBlog = async (blog, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const id = blog._id;
    const isLiked = likedBlogIds.includes(id);
    const action = isLiked ? "unlike" : "like";

    // 1. Toggle locally for instant responsive UI feedback
    let nextLiked;
    if (isLiked) {
      nextLiked = likedBlogIds.filter(x => x !== id);
    } else {
      nextLiked = [...likedBlogIds, id];
      setToast({ message: "Thank you for liking! ❤️", type: "like", key: Date.now() });
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
        if (liveBlogs.some(b => b._id === id)) {
          setLiveBlogs(prev => prev.map(b => b._id === id ? { ...b, likes: data.count } : b));
        }
      }
    } catch (err) {
      console.error("Failed to update likes in database:", err);
    }
  };

  // Merge lists and sort by created_at in descending order (most recent first)
  const combinedBlogs = [...liveBlogs, ...baseBlogs].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredBlogs = combinedBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 noise-overlay relative overflow-hidden p-6 sm:p-10 lg:p-16 ${
      isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
    }`}>
      {/* Grid Mesh Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "grid-mesh" : "grid-mesh-light"}`} />
      </div>

      {/* Back to dashboard */}
      <div className="max-w-7xl mx-auto mb-10 z-10 relative">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -4 }}
            className={`flex items-center space-x-2 text-xs font-semibold tracking-wide transition-colors py-2 px-3 border rounded-xl backdrop-blur-md ${
              isDark 
                ? "text-zinc-400 hover:text-white bg-white/5 border-white/5" 
                : "text-zinc-600 hover:text-zinc-950 bg-black/5 border-black/5"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div>
            <h1 className={`text-4xl sm:text-5xl font-extrabold font-outfit tracking-tight mb-3 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}>
              Developer Insights
            </h1>
            <p className={`text-sm max-w-md ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Writing about artificial intelligence, RAG chatbot pipelines, frontend performance scaling, and modern developer tooling.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors backdrop-blur-md font-sans ${
                isDark 
                  ? "bg-[#121214]/60 border-white/5 focus:border-white/10 text-white" 
                  : "bg-[#ffffff]/80 border-black/5 focus:border-black/10 text-zinc-900"
              }`}
            />
          </div>
        </div>

        {/* 3-Column Responsive Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className={`py-32 text-center text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            No blog articles match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => {
              const id = blog._id;
              const isLiked = likedBlogIds.includes(id);
              const totalLikes = interactions[id] !== undefined ? interactions[id] : (blog.likes || 0);

              return (
                <Link href={`/blogs/${id}`} key={idx} className="block group">
                  <BlogSpotlightCard 
                    isDark={isDark}
                    className="p-6 h-full flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image */}
                      {blog.imageUrl && (
                        <div className="w-full h-48 overflow-hidden rounded-2xl mb-5 relative shadow-inner border border-white/5">
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/70 via-black/20" : "from-black/45 via-transparent"} to-transparent`} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isDark 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : "bg-red-500/5 text-red-600 border border-red-500/10"
                        }`}>
                          {blog.category}
                        </span>
                        
                        <div className="flex items-center space-x-3 text-[10px] text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{blog.readTime}</span>
                          </div>
                          
                          <button
                            onClick={(e) => handleToggleLikeBlog(blog, e)}
                            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md border transition-all z-20 ${
                              isLiked
                                ? isDark
                                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                                  : "bg-red-500/5 text-red-600 border-red-500/20"
                                : isDark
                                  ? "bg-white/5 text-zinc-500 hover:text-white border-white/5"
                                  : "bg-black/5 text-zinc-400 hover:text-zinc-900 border-black/5"
                            }`}
                          >
                            <Heart className={`w-3 h-3 transition-colors ${isLiked ? "fill-current text-red-500" : ""}`} />
                            <span className="font-semibold">{totalLikes}</span>
                          </button>
                        </div>
                      </div>

                      <h3 className={`text-lg font-bold font-outfit mb-2.5 leading-tight transition-colors duration-300 ${
                        isDark 
                          ? "text-white group-hover:text-red-400" 
                          : "text-zinc-900 group-hover:text-red-600"
                      }`}>
                        {blog.title}
                      </h3>
                      
                      <p className={`text-xs leading-relaxed line-clamp-3 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}>
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {blog.date || new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <div className={`flex items-center space-x-1 text-xs font-bold transition-colors ${
                        isDark ? "text-red-400 group-hover:text-white" : "text-red-600 group-hover:text-red-800"
                      }`}>
                        <span>Read Article</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </BlogSpotlightCard>
                </Link>
              );
            })}
          </div>
        )}
        <footer className={`py-6 text-center text-[10px] tracking-widest uppercase font-mono relative z-10 ${
          isDark ? "text-zinc-600" : "text-zinc-400"
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Nikhil Verma</span>
            <Link href="/admin" className="hover:text-red-500 transition-colors font-bold">Admin Portal</Link>
          </div>
        </footer>

      </div>

      {toast.message && (
        <CustomToast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          isDark={isDark}
          onClose={() => setToast({ message: "", type: "success", key: 0 })}
        />
      )}
    </div>
  );
}
