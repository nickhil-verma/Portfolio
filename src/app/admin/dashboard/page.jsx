"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, LayoutDashboard, FolderKanban, BookHeart, LogOut, 
  Plus, Trash2, Users, Cpu, FileText, CheckCircle2, Globe, Monitor, Smartphone, Tablet,
  Github, X, MessageSquare, Sun, Moon, GripVertical
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomToast from "../../../components/CustomToast";

// Recharts components for shadcn-style graphs
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
        p: ({ node, ...props }) => <p className={`text-[10px] sm:text-xs leading-relaxed mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
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
            <div className={`p-4 rounded-xl font-mono text-[11px] overflow-x-auto mb-4 border ${isDark ? "bg-black/40 border-white/5 text-zinc-300" : "bg-zinc-100 border-black/5 text-zinc-800"}`}>
              <pre className="leading-relaxed"><code {...props}>{children}</code></pre>
            </div>
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className={`border-l-2 border-red-500 pl-3 py-1 my-3 text-[10px] sm:text-xs text-zinc-400 italic bg-white/5 rounded-r-md`} {...props} />
        ),
        ul: ({ node, ...props }) => <ul className={`list-disc pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
        ol: ({ node, ...props }) => <ol className={`list-decimal pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} {...props} />,
        table: ({ node, ...props }) => (
          <div className="w-full overflow-x-auto mb-4 rounded-xl border border-zinc-200/10 shadow-md select-text">
            <table className={`w-full text-left border-collapse text-[10px] sm:text-xs ${isDark ? "text-zinc-300 bg-[#121214]/40" : "text-zinc-700 bg-white"}`} {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th className="p-2 sm:p-2.5 font-bold tracking-wide font-outfit border-b border-zinc-200/5" {...props} />,
        td: ({ node, ...props }) => <td className="p-2 sm:p-2.5 leading-relaxed font-sans border-b border-zinc-200/5" {...props} />,
        tr: ({ node, ...props }) => <tr className={`transition-colors ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-black/[0.01]"}`} {...props} />,
        hr: ({ node, ...props }) => <hr className={`my-6 border-t ${isDark ? "border-white/5" : "border-black/5"}`} {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}

// Dynamic 3D Spinning Globe component using standard 3D orthographic projection
function GeolocationGlobe({ logs, isDark }) {
  const canvasRef = React.useRef(null);
  const rotationRef = React.useRef({ x: 0, y: 0 });
  const mouseRef = React.useRef({ isDown: false, lastX: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frameId;

    // Filter valid geocodes
    const visitors = logs.filter(log => {
      const lat = parseFloat(log.lat);
      const lon = parseFloat(log.lon);
      return !isNaN(lat) && !isNaN(lon);
    });

    let autoRot = 0.3; // auto rotation velocity (in degrees per frame)

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = canvas.width / 2.3;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw sphere shadow glow
      const sphereGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.05);
      sphereGlow.addColorStop(0, "transparent");
      sphereGlow.addColorStop(1, isDark ? "rgba(239, 68, 68, 0.06)" : "rgba(220, 38, 38, 0.03)");
      ctx.fillStyle = sphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Draw sphere outline
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw meridians & parallels (grid lines)
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(0, 0, 0, 0.025)";
      ctx.lineWidth = 0.5;

      const currentRotX = rotationRef.current.x;

      // Draw parallels
      for (let lat = -60; lat <= 60; lat += 30) {
        const r = radius * Math.cos((lat * Math.PI) / 180);
        const y = cy - radius * Math.sin((lat * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw meridians
      for (let lon = 0; lon < 360; lon += 30) {
        const radLon = ((lon + currentRotX) * Math.PI) / 180;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * Math.abs(Math.sin(radLon)), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw stylized world dot-matrix map for continent outlines
      const landPoints = [
        // North America
        { lat: 45, lon: -100 }, { lat: 55, lon: -120 }, { lat: 35, lon: -90 }, { lat: 60, lon: -80 }, { lat: 25, lon: -100 },
        // South America
        { lat: -10, lon: -60 }, { lat: -20, lon: -50 }, { lat: -30, lon: -60 }, { lat: 0, lon: -70 }, { lat: -40, lon: -70 },
        // Africa
        { lat: 10, lon: 20 }, { lat: 20, lon: 10 }, { lat: 0, lon: 25 }, { lat: -20, lon: 20 }, { lat: -30, lon: 25 }, { lat: 25, lon: 25 },
        // Eurasia
        { lat: 50, lon: 40 }, { lat: 60, lon: 60 }, { lat: 40, lon: 80 }, { lat: 55, lon: 100 }, { lat: 45, lon: 120 }, { lat: 35, lon: 105 },
        { lat: 30, font: "bold", lon: 70 }, { lat: 20, lon: 80 }, { lat: 50, lon: 10 }, { lat: 45, lon: 25 },
        // Australia
        { lat: -25, lon: 135 }, { lat: -30, lon: 140 }, { lat: -20, lon: 120 }, { lat: -30, lon: 115 }
      ];

      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
      landPoints.forEach(pt => {
        const radLat = (pt.lat * Math.PI) / 180;
        const radLon = ((pt.lon + currentRotX) * Math.PI) / 180;

        const xSphere = Math.cos(radLat) * Math.sin(radLon);
        const ySphere = Math.sin(radLat);
        const zSphere = Math.cos(radLat) * Math.cos(radLon);

        if (zSphere > 0) { // front hemisphere
          const x = cx + xSphere * radius;
          const y = cy - ySphere * radius;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw visitor coords as flashing/pulsing beacons
      visitors.forEach(visitor => {
        const lat = parseFloat(visitor.lat);
        const lon = parseFloat(visitor.lon);
        const radLat = (lat * Math.PI) / 180;
        const radLon = ((visitor.lon || lon + currentRotX) * Math.PI) / 180; // use raw or adjusted
        const actualRadLon = ((lon + currentRotX) * Math.PI) / 180;

        const xSphere = Math.cos(radLat) * Math.sin(actualRadLon);
        const ySphere = Math.sin(radLat);
        const zSphere = Math.cos(radLat) * Math.cos(actualRadLon);

        if (zSphere > 0) {
          const x = cx + xSphere * radius;
          const y = cy - ySphere * radius;

          // Glowing pulse ring
          const time = Date.now() / 1000;
          const pulseRadius = 3 + (time * 12) % 10;
          const alpha = 1 - (pulseRadius / 10);
          
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid point
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Border for center point
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Update rotationRef
      if (!mouseRef.current.isDown) {
        rotationRef.current.x = (rotationRef.current.x + autoRot) % 360;
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [logs, isDark]);

  const handleMouseDown = (e) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!mouseRef.current.isDown) return;
    const deltaX = e.clientX - mouseRef.current.lastX;
    rotationRef.current.x = (rotationRef.current.x + deltaX * 0.4) % 360;
    mouseRef.current.lastX = e.clientX;
  };

  const handleMouseUpOrLeave = () => {
    mouseRef.current.isDown = false;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing select-none py-1">
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="max-w-full h-auto"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

  const triggerToast = (message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this anonymous reflection?")) return;
    try {
      const res = await fetch(`/api/blogs/comments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Reflection deleted successfully! 🗑️", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete reflection", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting reflection", "error");
    }
  };
  
  // Dynamic states loaded from APIs
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [dashboardBlogs, setDashboardBlogs] = useState([]);
  const [dashboardComments, setDashboardComments] = useState([]);
  
  // Traffic analytics state
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueViews: 0,
    logs: [],
  });

  const [loading, setLoading] = useState(true);

  // Form states - Projects
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjTech, setNewProjTech] = useState("");
  const [newProjGithub, setNewProjGithub] = useState("");
  const [newProjDeployed, setNewProjDeployed] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjCat, setNewProjCat] = useState("web");
  const [newProjImageUrl, setNewProjImageUrl] = useState("");
  const [projMsg, setProjMsg] = useState("");

  // Form states - Blogs
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogImage, setNewBlogImage] = useState("");
  const [newBlogBanner, setNewBlogBanner] = useState("");
  const [newBlogCat, setNewBlogCat] = useState("Tech");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [blogMsg, setBlogMsg] = useState("");

  // Edit / Preview control states
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogWriteMode, setBlogWriteMode] = useState("write");
  const [fullscreenProjectEditor, setFullscreenProjectEditor] = useState(false);
  const [fullscreenBlogEditor, setFullscreenBlogEditor] = useState(false);
  const [blogEditorSplit, setBlogEditorSplit] = useState(50); // % width for left pane
  const isResizingBlog = React.useRef(false);
  const splitContainerRef = React.useRef(null);

  const startBlogResize = (e) => {
    isResizingBlog.current = true;
    const onMove = (ev) => {
      if (!isResizingBlog.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = Math.min(80, Math.max(20, ((ev.clientX - rect.left) / rect.width) * 100));
      setBlogEditorSplit(pct);
    };
    const onUp = () => { isResizingBlog.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) { const d = saved === "dark"; setIsDark(d); if (d) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark"); }
  }, []);

  const topProjects = Array.isArray(dashboardProjects) ? [...dashboardProjects].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 5) : [];
  const topBlogs = Array.isArray(dashboardBlogs) ? [...dashboardBlogs].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5) : [];
  
  // Dynamic leaderboard for top viewed blogs with thumbnails
  const topViewedBlogs = Array.isArray(dashboardBlogs) ? [...dashboardBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5) : [];

  // Aggregated traffic log data for charts (last 7 days)
  const chartData = React.useMemo(() => {
    if (!analytics || !analytics.logs || !Array.isArray(analytics.logs)) return [];
    
    // Filter out local traffic
    const filtered = analytics.logs.filter(log => {
      const ip = log.ip || "";
      const loc = log.location || "";
      return (
        ip !== "127.0.0.1" &&
        ip !== "::1" &&
        !ip.startsWith("192.168.") &&
        !ip.startsWith("10.") &&
        !ip.startsWith("172.") &&
        !loc.toLowerCase().includes("localhost")
      );
    });

    // Map last 7 days (including today)
    const dataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const key = d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
      dataMap[key] = { label, views: 0, unique: new Set() };
    }

    filtered.forEach(log => {
      if (!log.timestamp) return;
      const logDate = new Date(log.timestamp);
      const key = logDate.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
      if (dataMap[key]) {
        dataMap[key].views += 1;
        dataMap[key].unique.add(log.ip || "unknown");
      }
    });

    return Object.keys(dataMap).sort().map(key => ({
      date: dataMap[key].label,
      Views: dataMap[key].views,
      Visitors: dataMap[key].unique.size
    }));
  }, [analytics]);

  // Fetch all live data on tab change or mount
  const fetchData = async () => {
    try {
      // Fetch dynamic projects
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (Array.isArray(projData)) {
        setDashboardProjects(projData);
      }

      // Fetch dynamic blogs
      const blogRes = await fetch("/api/blogs");
      const blogData = await blogRes.json();
      if (Array.isArray(blogData)) {
        setDashboardBlogs(blogData);
      }

      // Fetch dynamic anonymous comments
      try {
        const commentsRes = await fetch("/api/blogs/comments");
        const commentsData = await commentsRes.json();
        if (Array.isArray(commentsData)) {
          setDashboardComments(commentsData);
        }
      } catch (e) {
        console.error("Failed to load comments:", e);
      }

      // Fetch dynamic traffic analytics
      const analyticsRes = await fetch("/api/analytics");
      const analyticsData = await analyticsRes.json();
      if (analyticsData && !analyticsData.error) {
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error("Failed to load active data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (authorized) {
      fetchData();
    }
  }, [activeTab, authorized]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjTech.trim() || !newProjGithub.trim()) {
      triggerToast("Please fill in all compulsory fields", "warn");
      return;
    }
    
    try {
      const url = "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";
      const payload = {
        title: newProjTitle,
        tech: newProjTech,
        githubUrl: newProjGithub,
        deployedUrl: newProjDeployed,
        description: newProjDesc,
        category: newProjCat,
        imageUrl: newProjImageUrl,
      };
      if (editingProjectId) {
        payload.id = editingProjectId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(editingProjectId ? "Project updated successfully! ⭐" : "Project uploaded successfully! ⭐", "success");
        setNewProjTitle("");
        setNewProjTech("");
        setNewProjGithub("");
        setNewProjDeployed("");
        setNewProjDesc("");
        setNewProjImageUrl("");
        setEditingProjectId(null);
        setFullscreenProjectEditor(false);
        fetchData();
      } else {
        triggerToast(data.error || "Failed to submit project data", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting project payload", "error");
    }
  };

  const startEditProject = (p) => {
    setEditingProjectId(p._id);
    setNewProjTitle(p.title);
    setNewProjTech(p.tech.join(", "));
    setNewProjGithub(p.link);
    setNewProjDeployed(p.deployedUrl || "");
    setNewProjDesc(p.description);
    setNewProjCat(p.category);
    setNewProjImageUrl(p.imageUrl || "");
    setProjMsg("");
    setFullscreenProjectEditor(true);
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setNewProjTitle("");
    setNewProjTech("");
    setNewProjGithub("");
    setNewProjDeployed("");
    setNewProjDesc("");
    setNewProjImageUrl("");
    setProjMsg("");
    setFullscreenProjectEditor(false);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this project from the database?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Project deleted successfully! 🗑️", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete project", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting project", "error");
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      triggerToast("Please fill in all compulsory fields", "warn");
      return;
    }

    try {
      const url = "/api/blogs";
      const method = editingBlogId ? "PUT" : "POST";
      const payload = {
        title: newBlogTitle,
        excerpt: newBlogExcerpt,
        imageUrl: newBlogImage,
        bannerUrl: newBlogBanner,
        category: newBlogCat,
        content: newBlogContent,
      };
      if (editingBlogId) {
        payload.id = editingBlogId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(editingBlogId ? "Blog updated successfully! 📝" : "Blog post published successfully! 📝", "success");
        setNewBlogTitle("");
        setNewBlogExcerpt("");
        setNewBlogImage("");
        setNewBlogBanner("");
        setNewBlogContent("");
        setEditingBlogId(null);
        setFullscreenBlogEditor(false);
        fetchData();
      } else {
        triggerToast(data.error || "Failed to submit blog data", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting blog payload", "error");
    }
  };

  const startEditBlog = (b) => {
    setEditingBlogId(b._id);
    setNewBlogTitle(b.title);
    setNewBlogExcerpt(b.excerpt || "");
    setNewBlogImage(b.imageUrl || "");
    setNewBlogBanner(b.bannerUrl || "");
    setNewBlogCat(b.category);
    setNewBlogContent(b.content);
    setBlogMsg("");
    setFullscreenBlogEditor(true);
  };

  const cancelEditBlog = () => {
    setEditingBlogId(null);
    setNewBlogTitle("");
    setNewBlogExcerpt("");
    setNewBlogImage("");
    setNewBlogBanner("");
    setNewBlogContent("");
    setBlogMsg("");
    setFullscreenBlogEditor(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Blog deleted successfully! 🗑️", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete blog", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting blog", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#ededed] noise-overlay relative overflow-hidden flex flex-col justify-center items-center p-6">
        <div className="absolute inset-0 z-0 grid-mesh pointer-events-none" />
        <div className="text-center z-10">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center mb-4 animate-pulse">
            <Cpu className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-0 noise-overlay relative overflow-hidden flex font-sans ${
      isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f5f5f7] text-[#1c1c1e]"
    }`}>
      <div className={`absolute inset-0 z-0 ${isDark ? "grid-mesh" : "grid-mesh-light"} pointer-events-none`} />

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r ${isDark ? "border-white/5 bg-[#09090b]/80" : "border-black/10 bg-white/85"} backdrop-blur-xl z-10 p-6 flex flex-col justify-between hidden md:flex`}>
        <div>
          {/* Logo Heading */}
          <div className="flex items-center space-x-3 mb-10">
            <div className={`w-8 h-8 rounded-xl ${isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200"} border flex items-center justify-center`}>
              <Cpu className="w-4 h-4 text-red-500" />
            </div>
            <span className={`font-extrabold font-outfit text-base tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Nikhil Console</span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
              { id: "projects", label: "Manage Projects", icon: FolderKanban },
              { id: "blogs", label: "Markdown Blogs", icon: BookHeart },
              { id: "comments", label: "Visitor Reflections", icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                     isActive 
                       ? "bg-red-500/20 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5" 
                       : `${isDark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"} border border-transparent`
                   }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick LogOut + Theme Toggle */}
        <div className="space-y-2">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border border-transparent transition-all ${
              isDark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 z-10 p-6 sm:p-10 overflow-y-auto max-h-screen ${
        isDark ? "" : "bg-[#f5f5f7]"
      }`}>
        {/* Mobile menu bar */}
        <div className={`flex md:hidden items-center justify-between p-4 mb-6 border ${isDark ? "glass-card border-white/5" : "bg-white/90 border-black/5 shadow-sm"} rounded-2xl`}>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4.5 h-4.5 text-red-500" />
            <span className={`font-bold text-xs tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Nikhil Console</span>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={toggleTheme} className={`px-2 py-1.5 rounded-lg text-[10px] ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}>
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            {["overview", "projects", "blogs", "comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${
                  activeTab === tab 
                    ? "bg-red-500/20 text-red-400" 
                    : `${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`
                }`}
              >
                {tab === "overview" ? "Views" : tab === "comments" ? "Reflections" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <h1 className={`text-3xl font-extrabold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"} flex items-center gap-2`}>
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "projects" && "Projects Manager"}
              {activeTab === "blogs" && "Blogging Dashboard"}
              {activeTab === "comments" && "Anonymous Comments"}
            </h1>
            <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Manage database assets and monitor traffic geocoding telemetry.
            </p>
          </div>

          <Link href="/">
            <button className={`flex items-center space-x-2 text-xs font-semibold tracking-wide border transition-all py-2 px-3 rounded-xl ${
              isDark ? "text-zinc-400 hover:text-white bg-white/5 border-white/5" : "text-zinc-600 hover:text-zinc-900 bg-white border-black/10 shadow-sm"
            }`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </button>
          </Link>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Total Page Views", value: analytics.totalViews, icon: Globe, color: "bg-red-500/10 text-red-400 border-red-500/20" },
                { label: "Unique Visitors", value: analytics.uniqueViews, icon: Users, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { label: "Projects count", value: dashboardProjects.length, icon: FolderKanban, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                { label: "Blogging Posts", value: dashboardBlogs.length, icon: FileText, color: "bg-red-500/10 text-red-400 border-red-500/20" },
              ].map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className={`p-5 rounded-2xl ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative overflow-hidden`}>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{metric.label}</span>
                      <div className={`p-2 rounded-xl border flex items-center justify-center ${metric.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className={`text-2xl font-extrabold font-outfit ${isDark ? "text-white" : "text-zinc-900"} tracking-tight`}>{metric.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Visualizations Grid: site activity & geocoding visitor map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Traffic Trends Dashboard Card */}
              <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative overflow-hidden flex flex-col justify-between min-h-[400px]`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5 flex-shrink-0">
                  <h3 className={`text-sm font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} flex items-center gap-2`}>
                    <Cpu className="w-4 h-4 text-red-500" />
                    <span>Traffic & Site Analytics</span>
                  </h3>
                  <span className={`text-[9px] font-bold uppercase ${isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-600"} border px-2.5 py-1 rounded`}>
                    Live Recharts
                  </span>
                </div>
                
                {/* Area Chart: site activity trend */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className={`text-xs font-semibold ${isDark ? "text-zinc-400" : "text-zinc-500"} mb-3`}>
                      📈 Trajectory Jump (Views vs Visitors)
                    </h4>
                    <div className="h-[140px] w-full">
                      {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">No traffic records in the telemetry logs.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"} />
                            <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? "#09090b" : "#ffffff", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", fontSize: 10, borderRadius: 12, color: isDark ? "#fff" : "#000" }} itemStyle={{ color: isDark ? "#fff" : "#000" }} labelStyle={{ color: isDark ? "#fff" : "#000", fontWeight: "bold" }} />
                            <Area type="monotone" dataKey="Views" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="Visitors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Bar Chart: daily traffic */}
                  <div>
                    <h4 className={`text-xs font-semibold ${isDark ? "text-zinc-400" : "text-zinc-500"} mb-3`}>
                      📊 Page Visits per Day of Week
                    </h4>
                    <div className="h-[120px] w-full">
                      {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">No traffic records in the telemetry logs.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"} />
                            <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? "#09090b" : "#ffffff", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", fontSize: 10, borderRadius: 12, color: isDark ? "#fff" : "#000" }} itemStyle={{ color: isDark ? "#fff" : "#000" }} labelStyle={{ color: isDark ? "#fff" : "#000", fontWeight: "bold" }} />
                            <Bar dataKey="Views" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Geocoding Visitor Map Card */}
              <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative overflow-hidden min-h-[400px] flex flex-col justify-between`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5 flex-shrink-0">
                  <h3 className={`text-sm font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} flex items-center gap-2`}>
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Live Visitor Geolocation Radar</span>
                  </h3>
                  <span className={`text-[9px] font-bold uppercase ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"} border px-2.5 py-1 rounded`}>
                    Geocoded Map
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center relative py-2">
                  {/* Styled Cyber Spinning Globe */}
                  <GeolocationGlobe logs={analytics.logs} isDark={isDark} />
                  
                  {/* Latest visitor telemetry banner */}
                  <div className={`mt-3 w-full py-2 px-3 rounded-xl border ${isDark ? "bg-[#0c0c0e]/80 border-white/5 text-zinc-400" : "bg-black/[0.02] border-black/5 text-zinc-600"} text-[10px] font-mono flex items-center justify-between`}>
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" /> Live 3D Globe Radar
                    </span>
                    <span className="truncate max-w-[200px] text-right">
                      {(() => {
                        const rec = analytics.logs.find(log => {
                          const ip = log.ip || "";
                          const loc = log.location || "";
                          return (
                            ip !== "127.0.0.1" &&
                            ip !== "::1" &&
                            !ip.startsWith("192.168.") &&
                            !ip.startsWith("10.") &&
                            !ip.startsWith("172.") &&
                            !loc.toLowerCase().includes("localhost")
                          );
                        });
                        return rec ? `Active connection geocoded at ${rec.location}` : "Awaiting external logs...";
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Leaderboard */}
              <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`text-sm font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} flex items-center gap-2`}>
                    <FolderKanban className="w-4 h-4 text-amber-400" />
                    <span>Most Starred Projects</span>
                  </h3>
                  <span className={`text-[9px] font-bold uppercase ${isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"} border px-2.5 py-1 rounded`}>
                    Leaderboard
                  </span>
                </div>
                {topProjects.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">No dynamic database projects recorded.</div>
                ) : (
                  <div className="space-y-3">
                    {topProjects.map((p, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 ${isDark ? "bg-white/[0.01] border-white/5 hover:border-white/10" : "bg-black/[0.01] border-black/5 hover:border-black/10 shadow-sm"} border rounded-xl transition-all`}>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-zinc-500 font-mono w-4">#{idx + 1}</span>
                          <div>
                            <p className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"} leading-none mb-1.5`}>{p.title}</p>
                            <p className={`text-[9px] ${isDark ? "text-zinc-400" : "text-zinc-500"} font-mono`}>{p.category || "web"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                          <span>★</span>
                          <span>{p.stars || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Viewed Blogs Leaderboard with thumbnails */}
              <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`text-sm font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} flex items-center gap-2`}>
                    <BookHeart className="w-4 h-4 text-emerald-400" />
                    <span>Most Viewed Insights</span>
                  </h3>
                  <span className={`text-[9px] font-bold uppercase ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"} border px-2.5 py-1 rounded`}>
                    Telemetry
                  </span>
                </div>
                {topViewedBlogs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">No dynamic database blogs recorded.</div>
                ) : (
                  <div className="space-y-3">
                    {topViewedBlogs.map((b, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 ${isDark ? "bg-white/[0.01] border-white/5 hover:border-emerald-500/30" : "bg-black/[0.01] border-black/5 hover:border-emerald-500/30 shadow-sm"} border rounded-xl transition-all`}>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-zinc-500 font-mono w-4">#{idx + 1}</span>
                          <div className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border ${isDark ? "border-white/10" : "border-black/10"} bg-zinc-800`}>
                            {b.imageUrl ? (
                              <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold font-mono">
                                BG
                              </div>
                            )}
                          </div>
                          <div className="max-w-[150px] sm:max-w-[200px] truncate">
                            <p className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"} leading-none mb-1.5 truncate`} title={b.title}>{b.title}</p>
                            <p className={`text-[9px] ${isDark ? "text-zinc-400" : "text-zinc-500"} font-mono`}>{b.category || "Tech"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                          <span>👁</span>
                          <span>{b.views || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Geolocation visitor logs table */}
            <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center mb-5">
                <h3 className={`text-lg font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"}`}>Live Visitor Geolocation Telemetry</h3>
                <span className={`text-[10px] font-bold uppercase ${isDark ? "bg-white/5 border-white/5 text-zinc-400" : "bg-black/5 border-black/5 text-zinc-500"} border px-2.5 py-1 rounded-md`}>
                  Real-time Database Logs
                </span>
              </div>

              {analytics.logs.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No visitor logs logged yet. Set MONGODB_URI in environment to log traffic logs in real-time.
                </div>
              ) : (
                <div className="overflow-x-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-white/5 text-zinc-400" : "border-black/10 text-zinc-500"} uppercase font-bold tracking-wider text-[9px]`}>
                        <th className="pb-3.5 pl-2">Device Profile & Screen</th>
                        <th className="pb-3.5">IP Address & ISP</th>
                        <th className="pb-3.5">Geocoded Location</th>
                        <th className="pb-3.5">Timestamp</th>
                        <th className="pb-3.5 pr-2 text-right">System Agent</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-black/5"}`}>
                      {analytics.logs
                        .filter(log => {
                          const ip = log.ip || "";
                          const loc = log.location || "";
                          return (
                            ip !== "127.0.0.1" &&
                            ip !== "::1" &&
                            !ip.startsWith("192.168.") &&
                            !ip.startsWith("10.") &&
                            !ip.startsWith("172.") &&
                            !loc.toLowerCase().includes("localhost")
                          );
                        })
                        .map((log, index) => (
                        <tr key={index} className={`hover:${isDark ? "bg-white/[0.01]" : "bg-black/[0.01]"} transition-colors`}>
                          <td className={`py-3 pl-2 flex items-center space-x-2 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                            {log.device === "Mobile" ? (
                              <Smartphone className="w-4 h-4 text-red-400 flex-shrink-0" />
                            ) : log.device === "Tablet" ? (
                              <Tablet className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            ) : (
                              <Monitor className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                            <div>
                              <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-zinc-900"}`}>{log.device || "Desktop"}</span>
                              <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">{log.screenResolution || "Unknown"}</span>
                            </div>
                          </td>
                          <td className={`py-3 ${isDark ? "text-zinc-300" : "text-zinc-700"} font-mono text-xs`}>
                            <div>
                              <span>{log.ip}</span>
                              <span className="block text-[10px] text-zinc-500 font-sans mt-0.5 max-w-[150px] truncate" title={log.isp || "Localhost Network"}>
                                {log.isp || "Localhost Network"}
                              </span>
                            </div>
                          </td>
                          <td className={`py-3 ${isDark ? "text-zinc-200" : "text-zinc-800"} font-medium text-xs`}>
                            <span className="inline-flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-zinc-500" />
                              <div>
                                <span>{log.location || "Unknown"}</span>
                                {log.lat && log.lon && (
                                  <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">
                                    {log.lat.toFixed(4)}, {log.lon.toFixed(4)}
                                  </span>
                                )}
                              </div>
                            </span>
                          </td>
                          <td className={`py-3 ${isDark ? "text-zinc-400" : "text-zinc-600"} font-mono text-[10px]`}>
                            {new Date(log.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className={`py-3 ${isDark ? "text-zinc-400" : "text-zinc-600"} pr-2 text-right text-[10px] font-medium`}>
                            <div>
                              <span>{log.browser} / {log.os}</span>
                              <span className="block text-[10px] text-zinc-500 font-sans mt-0.5">{log.language || "Unknown"}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className={`flex justify-between items-center p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
              <div>
                <h3 className={`text-lg font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"}`}>Dynamic Project Control Panel</h3>
                <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Launch premium workspace consoles to edit or upload projects in distraction-free mode.</p>
              </div>
              <button
                onClick={() => {
                  cancelEditProject();
                  setFullscreenProjectEditor(true);
                }}
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 shadow-lg shadow-red-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Project</span>
              </button>
            </div>

            {/* Projects list management */}
            <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
              <h3 className={`text-lg font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} mb-4`}>Existing dynamic uploaded projects</h3>
              
              {projMsg && (
                <div className="mb-4 p-3 rounded-xl text-xs font-semibold text-center border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                  {projMsg}
                </div>
              )}

              {dashboardProjects.length === 0 ? (
                <div className="py-20 text-center text-xs text-zinc-500">
                  No dynamic database uploads recorded yet. Local fallback assets are displayed on main pages.
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardProjects.map((p, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-4 ${isDark ? "bg-[#121214]/50 border-white/5 hover:border-white/10" : "bg-white border-black/5 hover:border-black/10 shadow-sm"} border rounded-2xl transition-all`}>
                      <div>
                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{p.title}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.tech.map((t, tIdx) => (
                            <span key={tIdx} className={`text-[8px] ${isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-600"} px-1.5 py-0.5 rounded-md uppercase font-semibold`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3.5">
                        <span className="text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {p.category}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => startEditProject(p)}
                            className={`p-1.5 ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5 hover:border-black/5"} rounded-lg border border-transparent transition-all`}
                            title="Edit Project"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="p-1.5 text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/10 transition-all"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className={`flex justify-between items-center p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
              <div>
                <h3 className={`text-lg font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"}`}>Dynamic Markdown Blog Panel</h3>
                <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Launch our distraction-free, fullscreen split-pane workspace with real-time markdown compilers.</p>
              </div>
              <button
                onClick={() => {
                  cancelEditBlog();
                  setFullscreenBlogEditor(true);
                }}
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 shadow-lg shadow-red-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Blog Post</span>
              </button>
            </div>

            {/* Blogs list management */}
            <div className={`p-6 rounded-[24px] ${isDark ? "glass-card" : "glass-card-light shadow-sm"} relative`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
              <h3 className={`text-lg font-bold font-outfit ${isDark ? "text-white" : "text-zinc-900"} mb-4`}>Published dynamic database blogs</h3>
              
              {blogMsg && (
                <div className="mb-4 p-3 rounded-xl text-xs font-semibold text-center border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                  {blogMsg}
                </div>
              )}

              {dashboardBlogs.length === 0 ? (
                <div className="py-20 text-center text-xs text-zinc-500">
                  No dynamic database blog uploads recorded yet. Local fallback mock articles are displayed.
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardBlogs.map((b, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-4 ${isDark ? "bg-[#121214]/50 border-white/5 hover:border-white/10" : "bg-white border-black/5 hover:border-black/10 shadow-sm"} border rounded-2xl transition-all`}>
                      <div>
                        <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{b.title}</h4>
                        <p className={`text-[9px] ${isDark ? "text-zinc-400" : "text-zinc-500"} mt-1 font-mono`}>
                          Published: {new Date(b.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3.5">
                        <span className="text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {b.category}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => startEditBlog(b)}
                            className={`p-1.5 ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5 hover:border-black/5"} rounded-lg border border-transparent transition-all`}
                            title="Edit Blog"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b._id)}
                            className="p-1.5 text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/10 transition-all"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <div className={`rounded-[24px] border ${isDark ? "glass-card border-white/5" : "glass-card-light border-black/5 shadow-sm"} p-6 sm:p-8 relative overflow-hidden`}>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2.5">
                  <MessageSquare className="w-5 h-5 text-red-400" />
                  <h2 className={`text-base sm:text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Visitor Reflections ({dashboardComments.length})
                  </h2>
                </div>
              </div>

              {dashboardComments.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center py-20">
                  No anonymous reflections have been shared yet.
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 hide-scrollbar">
                  {dashboardComments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`p-5 rounded-2xl ${isDark ? "bg-white/[0.01] hover:bg-white/[0.02] border-white/5" : "bg-black/[0.01] hover:bg-black/[0.02] border-black/5"} border flex justify-between items-start gap-4 transition-all`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                            Anonymous
                          </span>
                          <span className={`text-[10px] ${isDark ? "text-zinc-400" : "text-zinc-600"} font-medium`}>
                            on {comment.blogTitle}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            {new Date(comment.created_at).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className={`text-xs ${isDark ? "text-zinc-300" : "text-zinc-700"} leading-relaxed select-text pr-4`}>
                          {comment.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all flex-shrink-0"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen project editor overlay */}
      <AnimatePresence>
        {fullscreenProjectEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 bg-[#050505] text-[#ededed] flex flex-col font-sans select-none"
          >
            {/* Header bar */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-[#09090b]">
              <div>
                <h2 className="text-base font-extrabold font-outfit text-white tracking-tight flex items-center gap-2.5">
                  <FolderKanban className="w-5 h-5 text-red-500" />
                  <span>{editingProjectId ? "Update Dynamic Project Console" : "New Dynamic Project Workspace"}</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {editingProjectId ? `PROJECT ID: ${editingProjectId}` : "CREATING FRESH DATABASE ENTREE"}
                </p>
              </div>
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={cancelEditProject}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit Workspace</span>
                </button>
                <button
                  onClick={handleAddProject}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                >
                  {editingProjectId ? "Save Changes" : "Publish Project"}
                </button>
              </div>
            </div>

            {/* Body split-pane */}
            <div className="flex-1 flex overflow-hidden select-text">
              {/* Left Pane (Editor Form) */}
              <div className="w-1/2 p-10 overflow-y-auto border-r border-white/5 space-y-6 select-text">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5 select-none">
                  Project Parameters Configuration
                </h3>
                
                {projMsg && (
                  <div className="p-3.5 rounded-xl text-xs font-semibold text-center border bg-red-500/10 border-red-500/20 text-red-400">
                    {projMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Hireonova RAG Engine"
                      value={newProjTitle}
                      onChange={(e) => { setNewProjTitle(e.target.value); setProjMsg(""); }}
                      className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Tech Stack (Comma Separated) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="React, Python, Tailwind"
                        value={newProjTech}
                        onChange={(e) => { setNewProjTech(e.target.value); setProjMsg(""); }}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
                      <select
                        value={newProjCat}
                        onChange={(e) => setNewProjCat(e.target.value)}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-zinc-400 font-sans"
                      >
                        <option value="web">Web & Systems</option>
                        <option value="ai">AI / NLP / Chatbots</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        GitHub Repository URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/..."
                        value={newProjGithub}
                        onChange={(e) => { setNewProjGithub(e.target.value); setProjMsg(""); }}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Deployed Website Link (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProjDeployed}
                        onChange={(e) => { setNewProjDeployed(e.target.value); setProjMsg(""); }}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Project Thumbnail Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newProjImageUrl}
                      onChange={(e) => { setNewProjImageUrl(e.target.value); setProjMsg(""); }}
                      className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Short Description / Explainer Text
                    </label>
                    <textarea
                      placeholder="Provide a quick detailed summary of the codebase parameters..."
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      className="w-full h-40 bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Pane (Dynamic Card Preview) */}
              <div className="w-1/2 p-10 bg-[#09090b] overflow-y-auto flex flex-col justify-center items-center select-none">
                <div className="w-full max-w-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5 mb-8 text-center">
                    Portfolio Live Card Mockup
                  </h3>
                  
                  <div className="relative overflow-hidden rounded-[24px] glass-card border border-white/5 p-8 shadow-2xl hover:border-red-500/20 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
                    {/* Reflective top highlight */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent pointer-events-none z-20" />
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {newProjCat || "web"}
                        </span>
                        <span className="flex items-center space-x-1 text-[10px] font-mono text-zinc-400 font-bold bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                          <span>★</span>
                          <span>1</span>
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold font-outfit text-white mb-2 leading-snug">
                        {newProjTitle || "Your Project Title Mock"}
                      </h4>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
                        {newProjDesc || "Your short description parameters will populate dynamically in real-time as you type in the editor..."}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex flex-wrap gap-1 max-w-[70%]">
                        {(newProjTech ? newProjTech.split(",") : ["React", "Tailwind"]).map((t, idx) => (
                          <span key={idx} className="text-[8px] bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase font-semibold">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2 text-zinc-400">
                        <Globe className="w-4 h-4 hover:text-white transition-colors" />
                        <Github className="w-4 h-4 hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen blog editor overlay */}
      <AnimatePresence>
        {fullscreenBlogEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 bg-[#050505] text-[#ededed] flex flex-col font-sans select-none"
          >
            {/* Header bar */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-[#09090b]">
              <div>
                <h2 className="text-base font-extrabold font-outfit text-white tracking-tight flex items-center gap-2.5">
                  <BookHeart className="w-5 h-5 text-red-500" />
                  <span>{editingBlogId ? "Update Dynamic Blog Console" : "New Dynamic Blog Markdown Workspace"}</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {editingBlogId ? `BLOG ID: ${editingBlogId}` : "CREATING FRESH DATABASE MARKDOWN ENTRY"}
                </p>
              </div>
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={cancelEditBlog}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit Workspace</span>
                </button>
                <button
                  onClick={handleAddBlog}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                >
                  {editingBlogId ? "Save Changes" : "Publish Blog"}
                </button>
              </div>
            </div>

            {/* Body split-pane */}
            <div ref={splitContainerRef} className="flex-1 flex overflow-hidden">
              {/* Left Pane (Editor Form) */}
              <div style={{ width: `${blogEditorSplit}%` }} className="overflow-y-auto border-r border-white/5 space-y-6 select-text p-10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5 select-none">
                  Markdown Blog Parameters
                </h3>
                
                {blogMsg && (
                  <div className="p-3.5 rounded-xl text-xs font-semibold text-center border bg-red-500/10 border-red-500/20 text-red-400">
                    {blogMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Blog Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Dynamic RAG Pipelines"
                      value={newBlogTitle}
                      onChange={(e) => { setNewBlogTitle(e.target.value); setBlogMsg(""); }}
                      className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Thumbnail Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newBlogImage}
                        onChange={(e) => setNewBlogImage(e.target.value)}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Banner Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newBlogBanner}
                        onChange={(e) => setNewBlogBanner(e.target.value)}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Short Excerpt Summary</label>
                      <input
                        type="text"
                        placeholder="A quick overview of what the reader will explore..."
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Category Tag</label>
                      <input
                        type="text"
                        placeholder="AI & NLP, Systems, Web Dev"
                        value={newBlogCat}
                        onChange={(e) => setNewBlogCat(e.target.value)}
                        className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Blog Body Content (Markdown Supported) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="# Article Header&#10;&#10;Write blog content in **Markdown format** (like README.md). Support headings, bullets, blockquotes, bold text..."
                      value={newBlogContent}
                      onChange={(e) => { setNewBlogContent(e.target.value); setBlogMsg(""); }}
                      className="w-full h-80 bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-white font-mono resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drag Handle */}
              <div
                onMouseDown={startBlogResize}
                className="w-1.5 bg-white/5 hover:bg-red-500/30 cursor-col-resize flex items-center justify-center transition-colors group flex-shrink-0"
                title="Drag to resize"
              >
                <GripVertical className="w-3 h-3 text-zinc-600 group-hover:text-red-400" />
              </div>

              {/* Right Pane (Live README Markdown Preview) */}
              <div className="flex-1 p-10 bg-[#09090b] overflow-y-auto flex flex-col justify-start text-left select-text">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5 mb-6 text-center select-none">
                  Live README Markdown Preview compiles on-the-go
                </h3>
                
                <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-8 min-h-[400px]">
                  {newBlogContent.trim() ? (
                    <CustomMarkdown content={newBlogContent} isDark={true} />
                  ) : (
                    <p className="text-zinc-500 italic text-center py-40 select-none">No markdown written yet. Enter some text in the left pane to compile.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {toast.message && (
        <CustomToast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          isDark={true}
          onClose={() => setToast({ message: "", type: "success", key: 0 })}
        />
      )}
    </div>
  );
}
