"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Calendar, Heart, Search, ChevronRight, X } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper
const BlogSpotlightCard = ({ children, className = "" }) => {
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
      className={`relative overflow-hidden rounded-[24px] glass-card hover:border-white/10 hover:-translate-y-1 transition-all duration-500 shadow-xl ${className}`}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(239, 68, 68, 0.04), transparent 80%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// Senior-level React-based Markdown-to-HTML parser function
function renderMarkdownContent(md) {
  if (!md) return "";
  const lines = md.split("\n");
  return lines.map((line, idx) => {
    const text = line.trim();

    // Headers
    if (text.startsWith("### ")) {
      return <h4 key={idx} className="text-sm sm:text-base font-bold font-outfit text-white mt-5 mb-2.5">{text.substring(4)}</h4>;
    }
    if (text.startsWith("## ")) {
      return <h3 key={idx} className="text-base sm:text-lg font-bold font-outfit text-white mt-6 mb-3">{text.substring(3)}</h3>;
    }
    if (text.startsWith("# ")) {
      return <h2 key={idx} className="text-lg sm:text-xl font-extrabold font-outfit text-white mt-8 mb-4">{text.substring(2)}</h2>;
    }

    // Bullet lists
    if (text.startsWith("- ") || text.startsWith("* ")) {
      return <li key={idx} className="list-disc pl-1 ml-5 text-[11px] sm:text-xs text-zinc-300 mb-1.5">{text.substring(2)}</li>;
    }

    // Blockquote
    if (text.startsWith("> ")) {
      return (
        <blockquote key={idx} className="border-l-2 border-red-500 pl-4 py-1.5 my-4 text-[11px] sm:text-xs text-zinc-400 italic bg-white/5 rounded-r-lg">
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
      return <div key={idx} className="h-3" />;
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
      parts.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <p key={idx} className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mb-3">{parts}</p>;
  });
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveBlogs, setLiveBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Initial local fallback blogs
  const baseBlogs = [
    {
      title: "Building Scale: Custom AI Indexing Engines with Playwright and NLP",
      excerpt: "Deep dive into building data ingestion systems for large language models, crawling job directories, parsing resumes with spaCy, and contextually mapping profiles.",
      content: "# Building Scale: Custom AI Indexing Engines\n\nModern artificial intelligence applications require highly context-rich indexing setups to feed Large Language Models. In this architecture breakdown, we crawler and index over **200,000+ job positions** in real-time.\n\n## 🛠️ The Data Ingestion Tech Stack\n\n- **Playwright** for dynamic JavaScript crawler execution\n- **spaCy NLP** for parsing unstructured resume fields\n- **Ollama 3B** for local, cost-effective embeddings mapping\n\n> \"Building scalable crawlers is 10% coding, 90% bypassing cloud protection grids gracefully.\"\n\n### Ingestion Pipeline Benchmarks\nDynamic sitemap crawling was optimized by **40%**, resulting in extremely rapid database indexing loops.",
      date: "May 15, 2026",
      readTime: "7 min read",
      category: "AI & NLP",
      likes: 42,
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      created_at: new Date("2026-05-15"),
    },
    {
      title: "Supercharging Frontend Performance: WordPress to React Migration",
      excerpt: "An architectural review of WordPress migration processes, setting up JWT auth wrappers, configuring lightweight static templates, and optimizing load speed benchmarks by 40%.",
      content: "# WordPress to React Migration Guide\n\nLegacy WordPress installations often suffer from massive layout shifts, asset bloated styling rules, and heavy response latencies. This write-up reviews structural steps to migrate standard CMS interfaces to high-performance Next.js containers.\n\n## ⚡ Performance Uplifts\n\n- Page load speed was improved by **40%**.\n- Express database forms latency dropped by **30%**.\n- Implemented client-side **JWT Authentication tokens** for robust role-based routing (RBAC).\n\n### Key Migration Lessons\nAlways keep sitemap references intact during migration so standard Google indexes remain operational without any indexing losses.",
      date: "Apr 22, 2026",
      readTime: "5 min read",
      category: "Architecture",
      likes: 29,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      created_at: new Date("2026-04-22"),
    },
    {
      title: "RAG Pipelines in Extreme Hackathons: Lessons from MOSDAC ISRO",
      excerpt: "Unpacking vector databases (FAISS), chunking space meteorology reports, embedding datasets on limited RAM setups, and loading quantized Gemma 3B models contextually.",
      content: "# RAG Pipelines in Extreme Hackathons\n\nDeploying high-quality vector database models under extreme hackathon conditions (e.g. 24-hour limits, limited hardware capacities) requires lightweight, highly targeted chunking architectures.\n\n## 🛰️ ISRO Space Hackathon Strategy\n\n- Used **FAISS** local database indexes instead of heavy cloud alternatives\n-Quantized meteorology reports using customized spaCy modules\n- Deployed quantized **Gemma 3B** locally to bypass API rate throttling limits\n\n### Results & Achievements\nThis system was named a **Grand Finalist (Top 5 / 500)** in the prestigious SIH hackathon!",
      date: "Mar 08, 2026",
      readTime: "9 min read",
      category: "Space Tech",
      likes: 56,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      created_at: new Date("2026-03-08"),
    },
  ];

  // Fetch dynamic blogs from MongoDB on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch live blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

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
    <div className="min-h-screen bg-[#050505] text-[#ededed] noise-overlay relative overflow-hidden p-6 sm:p-10 lg:p-16">
      <div className="absolute inset-0 z-0 grid-mesh pointer-events-none" />

      {/* Back to dashboard */}
      <div className="max-w-4xl mx-auto mb-10 z-10 relative">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -4 }}
            className="flex items-center space-x-2 text-xs font-semibold tracking-wide text-zinc-400 hover:text-white transition-colors py-2 px-3 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit tracking-tight mb-3">
              Developer Insights
            </h1>
            <p className="text-sm text-zinc-400 max-w-md">
              Writing about artificial intelligence, RAG chatbot pipelines, frontend performance scaling, and modern developer tooling.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors backdrop-blur-md text-white font-sans"
            />
          </div>
        </div>

        {/* Blogs List */}
        <div className="space-y-6">
          {filteredBlogs.map((blog, idx) => (
            <BlogSpotlightCard key={idx} className="p-8 group cursor-pointer">
              <div onClick={() => setSelectedBlog(blog)}>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 space-y-2 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                      {blog.category}
                    </span>
                    
                    <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.date || new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-zinc-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-400">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold">{blog.likes}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-outfit text-white mb-2 group-hover:text-red-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-400 mb-5">
                  {blog.excerpt}
                </p>

                <div className="flex items-center space-x-1 text-xs font-semibold text-red-400 group-hover:text-red-300">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </BlogSpotlightCard>
          ))}
        </div>
      </div>

      {/* Dynamic Article Markdown Reader Overlay Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-start"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-3xl glass-card border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative my-8"
            >
              {/* Blog Post Banner */}
              {selectedBlog.bannerUrl && (
                <div className="w-full h-44 sm:h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
                  <img
                    src={selectedBlog.bannerUrl}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Close button inside banner area */}
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-6 right-6 p-2 bg-black/60 border border-white/10 rounded-full text-zinc-400 hover:text-white transition-colors z-20 backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content area */}
              <div className="p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                    {selectedBlog.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedBlog.date || new Date(selectedBlog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedBlog.readTime}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white leading-tight mb-6">
                  {selectedBlog.title}
                </h1>

                <div className="border-t border-white/5 pt-6 font-sans">
                  {renderMarkdownContent(selectedBlog.content)}
                </div>

                {/* Bottom Close Button */}
                <div className="border-t border-white/5 mt-8 pt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
