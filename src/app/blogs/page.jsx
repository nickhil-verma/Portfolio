"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomToast from "../../components/CustomToast";
import Helmet from "../../components/Helmet";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart, Search, ChevronRight, Tag, Calendar, Eye } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper
const BlogSpotlightCard = ({ children, isDark, className = "" }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[24px] transition-all duration-300 shadow-xl hover:-translate-y-1 ${
        isDark ? "glass-card hover:border-white/10" : "glass-card-light hover:border-black/10"
      } ${className}`}
    >
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-white/10" : "via-black/5"} to-transparent pointer-events-none z-20`} />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.025)"}, transparent 80%)`,
        }}
      />
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none z-10"
          style={{
            border: isDark ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid rgba(0,0,0,0.15)",
            background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)"}, transparent 80%)`,
            maskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
          }}
        />
      )}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

const baseBlogs = [
  {
    _id: "fb1",
    title: "Building Scale: Custom AI Indexing Engines with Playwright and NLP",
    excerpt: "Deep dive into building data ingestion systems for large language models, crawling job directories, parsing resumes with spaCy, and contextually mapping profiles.",
    content: "",
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
    content: "",
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
    content: "",
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [liveBlogs, setLiveBlogs] = useState([]);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const darkVal = savedTheme === "dark";
      setIsDark(darkVal);
      if (darkVal) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("liked_blogs");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikedBlogIds(parsed);
        baseBlogs.forEach(b => {
          if (parsed.includes(b._id) && !b.hasLikedIncremented) {
            b.likes = (b.likes || 0) + 1;
            b.hasLikedIncremented = true;
          }
        });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const fetchBlogsAndInteractions = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) setLiveBlogs(data);
      } catch (err) {}
      try {
        const res = await fetch("/api/interactions");
        const data = await res.json();
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item._id] = item.count; });
          setInteractions(map);
        }
      } catch (err) {}
    };
    fetchBlogsAndInteractions();
  }, []);

  const handleToggleLikeBlog = async (blog, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const id = blog._id;
    const isLiked = likedBlogIds.includes(id);
    const action = isLiked ? "unlike" : "like";
    let nextLiked;
    if (isLiked) {
      nextLiked = likedBlogIds.filter(x => x !== id);
    } else {
      nextLiked = [...likedBlogIds, id];
      setToast({ message: "Thank you for liking! ❤️", type: "like", key: Date.now() });
    }
    setLikedBlogIds(nextLiked);
    localStorage.setItem("liked_blogs", JSON.stringify(nextLiked));
    const currentCount = interactions[id] !== undefined ? interactions[id] : (blog.likes || 0);
    const newCount = Math.max(0, currentCount + (isLiked ? -1 : 1));
    setInteractions(prev => ({ ...prev, [id]: newCount }));
    try {
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(id)}&type=like&action=${action}&fallback=${blog.likes || 0}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setInteractions(prev => ({ ...prev, [id]: data.count }));
        if (liveBlogs.some(b => b._id === id)) {
          setLiveBlogs(prev => prev.map(b => b._id === id ? { ...b, likes: data.count } : b));
        }
      }
    } catch (err) {}
  };

  const combinedBlogs = [...liveBlogs, ...baseBlogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // All unique categories
  const allCategories = ["All", ...Array.from(new Set(combinedBlogs.map(b => b.category)))];
  const visibleCategories = showAllCategories ? allCategories : allCategories.slice(0, 7);

  const filteredBlogs = combinedBlogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPosts = combinedBlogs.slice(0, 3);

  return (
    <div className={`min-h-screen transition-colors duration-0 noise-overlay relative overflow-x-hidden p-6 sm:p-10 lg:p-16 ${
      isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
    }`}>
      <Helmet title="Blogs | Nikhil's Insights" description="Developer insights, AI chatbot pipelines, frontend performance scaling, and modern developer tooling." />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "grid-mesh" : "grid-mesh-light"}`} />
      </div>

      {/* Back */}
      <div className="max-w-7xl mx-auto mb-10 z-10 relative">
        <Link href="/">
          <motion.button
            whileHover={{ x: -4 }}
            className={`flex items-center space-x-2 text-xs font-semibold tracking-wide transition-colors py-2 px-3 border rounded-xl backdrop-blur-md ${
              isDark ? "text-zinc-400 hover:text-white bg-white/5 border-white/5" : "text-zinc-600 hover:text-zinc-950 bg-black/5 border-black/5"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="mb-10">
          <h1 className={`text-4xl sm:text-5xl font-extrabold font-outfit tracking-tight mb-3 ${isDark ? "text-white" : "text-zinc-900"}`}>
            Developer Insights
          </h1>
          <p className={`text-sm max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Writing about artificial intelligence, RAG chatbot pipelines, frontend performance scaling, and modern developer tooling.
          </p>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 mb-10 p-3 rounded-2xl border backdrop-blur-md ${
          isDark ? "bg-white/[0.03] border-white/5" : "bg-white/80 border-black/5"
        }`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none font-sans ${
              isDark ? "text-white placeholder:text-zinc-600" : "text-zinc-900 placeholder:text-zinc-400"
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${isDark ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}`}>
              Clear
            </button>
          )}
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main blog feed */}
          <div className="flex-1 min-w-0">
            {filteredBlogs.length === 0 ? (
              <div className={`py-32 text-center text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                No blog articles match your search or filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog, idx) => {
                  const id = blog._id;
                  const isLiked = likedBlogIds.includes(id);
                  const totalLikes = interactions[id] !== undefined ? interactions[id] : (blog.likes || 0);
                  return (
                    <Link href={`/blogs/${id}`} key={idx} className="block group">
                      <BlogSpotlightCard isDark={isDark} className="p-5 h-full flex flex-col justify-between">
                        <div>
                          {blog.imageUrl && (
                            <div className="w-full h-44 overflow-hidden rounded-2xl mb-4 relative shadow-inner border border-white/5">
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/70 via-black/20" : "from-black/45 via-transparent"} to-transparent`} />
                              <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                isDark ? "bg-red-500/80 text-white" : "bg-red-600 text-white"
                              }`}>
                                {blog.category}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{blog.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{blog.date || new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              </div>
                              {(blog.views > 0) && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{blog.views}</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={e => handleToggleLikeBlog(blog, e)}
                              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition-all z-20 ${
                                isLiked
                                  ? isDark ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-red-500/5 text-red-600 border-red-500/20"
                                  : isDark ? "bg-white/5 text-zinc-500 hover:text-white border-white/5" : "bg-black/5 text-zinc-400 hover:text-zinc-900 border-black/5"
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isLiked ? "fill-current text-red-500" : ""}`} />
                              <span className="text-[10px] font-semibold">{totalLikes}</span>
                            </button>
                          </div>

                          <h3 className={`text-base font-bold font-outfit mb-2 leading-tight transition-colors ${
                            isDark ? "text-white group-hover:text-red-400" : "text-zinc-900 group-hover:text-red-600"
                          }`}>
                            {blog.title}
                          </h3>

                          <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            {blog.excerpt}
                          </p>
                        </div>

                        <div className={`mt-5 pt-4 border-t ${isDark ? "border-white/5" : "border-black/5"} flex items-center justify-end`}>
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
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            {/* Recent Posts */}
            <div className={`p-5 rounded-[24px] border backdrop-blur-md ${
              isDark ? "bg-white/[0.03] border-white/5" : "bg-white/80 border-black/5"
            }`}>
              <h2 className={`text-sm font-bold font-outfit mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Recent Posts
              </h2>
              <div className="space-y-3">
                {recentPosts.map((blog, idx) => (
                  <Link key={idx} href={`/blogs/${blog._id}`} className="flex items-start gap-3 group">
                    {blog.imageUrl && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-[9px] font-mono mb-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {blog.date || new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                        isDark ? "text-white group-hover:text-red-400" : "text-zinc-900 group-hover:text-red-600"
                      }`}>
                        {blog.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className={`p-5 rounded-[24px] border backdrop-blur-md ${
              isDark ? "bg-white/[0.03] border-white/5" : "bg-white/80 border-black/5"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Tag className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <h2 className={`text-sm font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Categories
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      activeCategory === cat
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : isDark
                          ? "bg-white/5 text-zinc-400 hover:text-white border-white/5 hover:border-white/10"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-200"
                    }`}
                  >
                    #{cat.toLowerCase().replace(/\s+/g, "-")}
                  </button>
                ))}
              </div>
              {allCategories.length > 7 && (
                <button
                  onClick={() => setShowAllCategories(v => !v)}
                  className={`mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isDark ? "border-white/5 text-zinc-400 hover:text-white hover:border-white/10" : "border-black/10 text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {showAllCategories ? "Show Less" : "Show More"}
                  <ChevronRight className={`w-3 h-3 transition-transform ${showAllCategories ? "rotate-90" : "rotate-0"}`} />
                </button>
              )}
            </div>
          </div>
        </div>

        <footer className={`py-8 mt-12 text-center text-[10px] tracking-widest uppercase font-mono relative z-10 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Nikhil Verma</span>
            <Link href="/admin" className="hover:text-red-500 transition-colors font-bold">Admin Portal</Link>
          </div>
        </footer>
      </div>

      {toast.message && (
        <CustomToast key={toast.key} message={toast.message} type={toast.type} isDark={isDark} onClose={() => setToast({ message: "", type: "success", key: 0 })} />
      )}
    </div>
  );
}
