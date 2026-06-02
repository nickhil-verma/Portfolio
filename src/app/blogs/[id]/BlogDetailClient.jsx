"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import BlogLikeButton from "../../../components/BlogLikeButton";
import CustomToast from "../../../components/CustomToast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { baseBlogs } from "../../../data/baseBlogs";

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
      className={`relative overflow-hidden rounded-[32px] transition-all duration-300 shadow-2xl ${
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

// Custom Markdown Component supporting GFM and raw HTML
function CustomMarkdown({ content, isDark }) {
  return (
    <div className="space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, className, style, ...props }) => (
          <span className="flex justify-center w-full my-6">
            <img 
              {...props} 
              style={style} 
              className={`max-w-full h-auto rounded-[24px] shadow-xl border object-contain ${
                isDark ? "border-white/5" : "border-black/5"
              } ${className || ""}`} 
              loading="lazy" 
            />
          </span>
        ),
        h1: ({ node, ...props }) => <h2 className={`text-2xl sm:text-3xl font-extrabold font-outfit mt-8 mb-4 tracking-tight leading-tight ${isDark ? "text-white" : "text-zinc-950"}`} {...props} />,
        h2: ({ node, ...props }) => <h3 className={`text-xl sm:text-2xl font-bold font-outfit mt-6 mb-3 tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`} {...props} />,
        h3: ({ node, ...props }) => <h4 className={`text-base sm:text-lg font-bold font-outfit mt-5 mb-2.5 ${isDark ? "text-white" : "text-zinc-950"}`} {...props} />,
        p: ({ node, ...props }) => <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
        a: ({ node, ...props }) => <a className={`font-semibold hover:underline transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`} target="_blank" rel="noopener noreferrer" {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
          if (inline || !String(children).includes('\n')) {
            return (
              <code className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${isDark ? "bg-white/10 text-red-400" : "bg-black/5 text-red-600"}`} {...props}>
                {children}
              </code>
            );
          }
          return (
            <div className={`p-5 rounded-2xl font-mono text-[11px] overflow-x-auto mb-4 border ${isDark ? "bg-black/40 border-white/5 text-zinc-300" : "bg-zinc-100 border-black/5 text-zinc-800"}`}>
              <pre className="leading-relaxed"><code {...props}>{children}</code></pre>
            </div>
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className={`border-l-4 border-red-500 pl-4 py-2 my-4 text-xs sm:text-sm italic rounded-r-lg ${isDark ? "text-zinc-400 bg-white/5" : "text-zinc-600 bg-black/5"}`} {...props} />
        ),
        ul: ({ node, ...props }) => <ul className={`list-disc pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
        ol: ({ node, ...props }) => <ol className={`list-decimal pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
        table: ({ node, ...props }) => (
          <div className="w-full overflow-x-auto mb-6 rounded-2xl border border-zinc-200/10 shadow-lg select-text">
            <table className={`w-full text-left border-collapse text-xs sm:text-sm ${isDark ? "text-zinc-300 bg-[#121214]/40" : "text-zinc-700 bg-white"}`} {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th className="p-3.5 sm:p-4 font-bold tracking-wide font-outfit border-b border-zinc-200/5" {...props} />,
        td: ({ node, ...props }) => <td className="p-3.5 sm:p-4 leading-relaxed font-sans border-b border-zinc-200/5" {...props} />,
        tr: ({ node, ...props }) => <tr className={`transition-colors ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-black/[0.01]"}`} {...props} />,
        hr: ({ node, ...props }) => <hr className={`my-6 border-t ${isDark ? "border-white/5" : "border-black/5"}`} {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}

export default function BlogDetailClient({ blog: initialBlog, initialViews, id: propId }) {
  const params = useParams();
  const id = propId || params.id;
  
  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [views, setViews] = useState(initialViews || 0);
  const viewTracked = React.useRef(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || "Nikhil's Insight",
          text: blog?.excerpt || "",
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setToast({ message: "Link copied to clipboard! 📋", type: "success", key: Date.now() });
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/blogs/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: id,
          blogTitle: blog?.title || "Unknown Article",
          content: commentText
        })
      });
      const data = await res.json();
      if (data.success) {
        const commentToLog = commentText.trim();
        setCommentText("");
        setToast({ message: "Thank you! Your reflection was shared anonymously. 💬", type: "success", key: Date.now() });

        // Log reflection telemetry action
        try {
          const isLocalhost =
            typeof window !== "undefined" &&
            (window.location.hostname === "localhost" ||
              window.location.hostname === "127.0.0.1" ||
              window.location.hostname === "::1");

          if (!isLocalhost) {
            const payload = {
              blogId: id,
              action: "reflection",
              content: commentToLog,
              screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
              windowSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
              language: typeof navigator !== "undefined" ? navigator.language : "Unknown",
              referrer: typeof document !== "undefined" ? (document.referrer || "Direct") : "Direct",
            };
            fetch("/api/blogs/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).catch(err => console.error("Failed to log blog reflection analytics:", err));
          }
        } catch (err) {}
      } else {
        setToast({ message: data.error || "Failed to submit reflection", type: "error", key: Date.now() });
      }
    } catch (err) {
      console.error("Comment submission failed:", err);
      setToast({ message: "Error submitting anonymous reflection", type: "error", key: Date.now() });
    } finally {
      setSubmittingComment(false);
    }
  };

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

  // Fetch details and interactions to ensure absolute fresh state & track view
  useEffect(() => {
    if (!id) return;
    
    const loadBlogData = async () => {
      let activeBlog = initialBlog;

      try {
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

      if (!activeBlog) {
        const fallbackMatch = baseBlogs.find(b => b._id === id);
        if (fallbackMatch) {
          activeBlog = fallbackMatch;
        }
      }

      if (activeBlog) {
        setBlog(activeBlog);
      }
      setLoading(false);

      // Track view once per page load
      if (!viewTracked.current && activeBlog) {
        viewTracked.current = true;
        try {
          const vRes = await fetch(`/api/blogs/views?id=${id}`, { method: "POST" });
          const vData = await vRes.json();
          if (vData.views !== undefined) {
            setViews(vData.views);
          } else {
            setViews((activeBlog.views || 0) + 1);
          }
        } catch (e) {
          setViews((activeBlog.views || 0) + 1);
        }

        // Log geocoded view telemetry action
        try {
          const isLocalhost =
            typeof window !== "undefined" &&
            (window.location.hostname === "localhost" ||
              window.location.hostname === "127.0.0.1" ||
              window.location.hostname === "::1");

          if (!isLocalhost) {
            const payload = {
              blogId: id,
              action: "view",
              screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
              windowSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
              language: typeof navigator !== "undefined" ? navigator.language : "Unknown",
              referrer: typeof document !== "undefined" ? (document.referrer || "Direct") : "Direct",
            };
            fetch("/api/blogs/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).catch(err => console.error("Failed to log blog view analytics:", err));
          }
        } catch (err) {}
      }
    };

    loadBlogData();
  }, [id, initialBlog]);

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
    <div className={`min-h-screen transition-colors duration-0 noise-overlay relative overflow-x-hidden p-6 sm:p-10 lg:p-16 ${
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

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isDark 
                  ? "bg-white/5 text-zinc-400 hover:text-white border-white/5" 
                  : "bg-black/5 text-zinc-600 hover:text-zinc-950 border-black/5"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <BlogLikeButton blogId={id} initialLikes={blog.likes || 0} isDark={isDark} mini={true} />
          </div>
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

            <div className="flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{(views || blog.views || 0).toLocaleString()} views</span>
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
            <CustomMarkdown content={blog.content} isDark={isDark} />
          </div>

          {/* Interactive Footer Likes Hook */}
          <div className="border-t border-white/5 mt-12 pt-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Liked this write-up?
              </span>
              <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Show your appreciation with a heart or share it.
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all ${
                  isDark
                    ? "bg-white/5 text-zinc-400 hover:text-white border-white/5"
                    : "bg-black/5 text-zinc-600 hover:text-zinc-950 border-black/5"
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <BlogLikeButton blogId={id} initialLikes={blog.likes || 0} isDark={isDark} />
            </div>
          </div>
        </DetailSpotlightCard>

        {/* Leaving anonymous reflection card */}
        <DetailSpotlightCard isDark={isDark} className="p-8 sm:p-10 mt-8">
          <div className="flex items-center space-x-2.5 mb-5">
            <MessageSquare className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            <h2 className={`text-base sm:text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Anonymous Reflection
            </h2>
          </div>
          <p className={`text-xs mb-6 leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Leave an anonymous thought, question, or reflection on this write-up. Your submission is completely anonymous and will only be visible to the author on the dashboard.
          </p>

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type your reflection here..."
              rows={4}
              maxLength={1000}
              className={`w-full border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all backdrop-blur-md font-sans ${
                isDark 
                  ? "bg-[#121214]/60 border-white/5 focus:border-white/10 text-white" 
                  : "bg-white border-black/10 focus:border-black/20 text-zinc-900 shadow-sm"
              }`}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className={`px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-500/10 flex items-center space-x-2`}
              >
                {submittingComment ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit Reflection</span>
                )}
              </button>
            </div>
          </form>
        </DetailSpotlightCard>

        {/* Global Footer component with Admin Portal Link */}
        <footer className={`py-6 text-center text-[10px] tracking-widest uppercase font-mono relative z-10 ${
          isDark ? "text-zinc-600" : "text-zinc-400"
        }`}>
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
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
