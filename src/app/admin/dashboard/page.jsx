"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, LayoutDashboard, FolderKanban, BookHeart, LogOut, 
  Plus, Trash2, Users, Cpu, FileText, CheckCircle2, Globe, Monitor, Smartphone, Tablet,
  Github, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomToast from "../../../components/CustomToast";

// Senior-level React-based Markdown-to-HTML parser function for dynamic blog preview
function renderMarkdownContent(md, isDark = true) {
  if (!md) return "";
  
  const lines = md.split(/\r?\n/);
  const elements = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeBlockLang = "";
  let listItems = [];
  let currentListType = null; // "bullet" or "number"

  const flushList = (key) => {
    if (listItems.length > 0) {
      if (currentListType === "bullet") {
        elements.push(
          <ul key={`ul-${key}`} className={`list-disc pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      } else if (currentListType === "number") {
        elements.push(
          <ol key={`ol-${key}`} className={`list-decimal pl-6 mb-4 space-y-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      }
      listItems = [];
      currentListType = null;
    }
  };

  const parseInlineStyles = (text) => {
    if (!text) return "";
    let parts = [text];
    
    // Parse inline code: `code`
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const codeRegex = /`([^`]+)`/g;
      const subParts = [];
      let lastIdx = 0;
      let match;
      while ((match = codeRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          subParts.push(part.substring(lastIdx, match.index));
        }
        subParts.push(
          <code key={`code-${match.index}`} className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
            isDark ? "bg-white/10 text-red-400" : "bg-black/5 text-red-600"
          }`}>
            {match[1]}
          </code>
        );
        lastIdx = codeRegex.lastIndex;
      }
      if (lastIdx < part.length) {
        subParts.push(part.substring(lastIdx));
      }
      return subParts;
    });

    // Parse bold: **text**
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const subParts = [];
      let lastIdx = 0;
      let match;
      while ((match = boldRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          subParts.push(part.substring(lastIdx, match.index));
        }
        subParts.push(
          <strong key={`bold-${match.index}`} className={`font-bold ${isDark ? "text-white" : "text-zinc-950"}`}>
            {match[1]}
          </strong>
        );
        lastIdx = boldRegex.lastIndex;
      }
      if (lastIdx < part.length) {
        subParts.push(part.substring(lastIdx));
      }
      return subParts;
    });

    // Parse italic: *text*
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const italicRegex = /\*([^*]+)\*/g;
      const subParts = [];
      let lastIdx = 0;
      let match;
      while ((match = italicRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          subParts.push(part.substring(lastIdx, match.index));
        }
        subParts.push(
          <em key={`italic-${match.index}`} className="italic">
            {match[1]}
          </em>
        );
        lastIdx = italicRegex.lastIndex;
      }
      if (lastIdx < part.length) {
        subParts.push(part.substring(lastIdx));
      }
      return subParts;
    });

    // Parse links: [text](url)
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const subParts = [];
      let lastIdx = 0;
      let match;
      while ((match = linkRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          subParts.push(part.substring(lastIdx, match.index));
        }
        subParts.push(
          <a
            key={`link-${match.index}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold hover:underline transition-colors ${
              isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
            }`}
          >
            {match[1]}
          </a>
        );
        lastIdx = linkRegex.lastIndex;
      }
      if (lastIdx < part.length) {
        subParts.push(part.substring(lastIdx));
      }
      return subParts;
    });

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Handle Code Blocks
    if (trimmed.startsWith("```")) {
      flushList(i);
      if (inCodeBlock) {
        elements.push(
          <div key={`codeblock-${i}`} className={`p-4 rounded-xl font-mono text-[11px] overflow-x-auto mb-4 border ${
            isDark ? "bg-black/40 border-white/5 text-zinc-300" : "bg-zinc-100 border-black/5 text-zinc-800"
          }`}>
            {codeBlockLang && (
              <div className={`text-[9px] uppercase tracking-wider font-bold mb-2 pb-1 border-b ${
                isDark ? "text-zinc-500 border-white/5" : "text-zinc-400 border-black/5"
              }`}>
                {codeBlockLang}
              </div>
            )}
            <pre className="leading-relaxed">{codeBlockLines.join("\n")}</pre>
          </div>
        );
        codeBlockLines = [];
        codeBlockLang = "";
        inCodeBlock = false;
      } else {
        codeBlockLang = trimmed.substring(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // 2. Horizontal Rules
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList(i);
      elements.push(
        <hr key={`hr-${i}`} className={`my-6 border-t ${isDark ? "border-white/5" : "border-black/5"}`} />
      );
      continue;
    }

    // 3. Headers
    if (trimmed.startsWith("#")) {
      flushList(i);
      let depth = 0;
      while (trimmed[depth] === "#") {
        depth++;
      }
      const headerText = trimmed.substring(depth).trim();
      const parsedText = parseInlineStyles(headerText);

      if (depth === 1) {
        elements.push(
          <h2 key={`h2-${i}`} className={`text-base sm:text-lg font-extrabold font-outfit mt-6 mb-3 tracking-tight leading-tight ${
            isDark ? "text-white" : "text-zinc-950"
          }`}>
            {parsedText}
          </h2>
        );
      } else if (depth === 2) {
        elements.push(
          <h3 key={`h3-${i}`} className={`text-sm sm:text-base font-bold font-outfit mt-5 mb-2.5 tracking-tight ${
            isDark ? "text-white" : "text-zinc-950"
          }`}>
            {parsedText}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={`h4-${i}`} className={`text-xs sm:text-sm font-bold font-outfit mt-4 mb-2 ${
            isDark ? "text-white" : "text-zinc-950"
          }`}>
            {parsedText}
          </h4>
        );
      }
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith("> ")) {
      flushList(i);
      const quoteText = rawLine.substring(rawLine.indexOf(">") + 1).trim();
      elements.push(
        <blockquote key={`quote-${i}`} className={`border-l-2 border-red-500 pl-3 py-1 my-3 text-[10px] sm:text-xs text-zinc-400 italic bg-white/5 rounded-r-md`}>
          {parseInlineStyles(quoteText)}
        </blockquote>
      );
      continue;
    }

    // 5. Bullet Lists
    const bulletMatch = rawLine.match(/^(\s*)([-*+])\s+(.*)/);
    if (bulletMatch) {
      if (currentListType !== "bullet") {
        flushList(i);
        currentListType = "bullet";
      }
      listItems.push(parseInlineStyles(bulletMatch[3]));
      continue;
    }

    // 6. Numbered Lists
    const numberMatch = rawLine.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (numberMatch) {
      if (currentListType !== "number") {
        flushList(i);
        currentListType = "number";
      }
      listItems.push(parseInlineStyles(numberMatch[3]));
      continue;
    }

    // 7. Empty Lines
    if (trimmed === "") {
      flushList(i);
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // 8. Normal Paragraph
    flushList(i);
    elements.push(
      <p key={`p-${i}`} className={`text-[10px] sm:text-xs leading-relaxed mb-2 ${
        isDark ? "text-zinc-300" : "text-zinc-700"
      }`}>
        {parseInlineStyles(rawLine)}
      </p>
    );
  }

  flushList(lines.length);
  return elements;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

  const triggerToast = (message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  };
  
  // Dynamic states loaded from APIs
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [dashboardBlogs, setDashboardBlogs] = useState([]);
  
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

  const topProjects = Array.isArray(dashboardProjects) ? [...dashboardProjects].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 5) : [];
  const topBlogs = Array.isArray(dashboardBlogs) ? [...dashboardBlogs].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5) : [];

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
    <div className="min-h-screen bg-[#050505] text-[#ededed] noise-overlay relative overflow-hidden flex font-sans">
      <div className="absolute inset-0 z-0 grid-mesh pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-10 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Heading */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-extrabold font-outfit text-base tracking-tight text-white">Nikhil Console</span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
              { id: "projects", label: "Manage Projects", icon: FolderKanban },
              { id: "blogs", label: "Markdown Blogs", icon: BookHeart },
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
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick LogOut */}
        <div className="space-y-3.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 z-10 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Mobile menu bar */}
        <div className="flex md:hidden items-center justify-between p-4 mb-6 glass-card rounded-2xl">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4.5 h-4.5 text-red-400" />
            <span className="font-bold text-xs tracking-tight text-white">Nikhil Console</span>
          </div>
          <div className="flex space-x-1">
            {["overview", "projects", "blogs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${
                  activeTab === tab ? "bg-red-500/20 text-red-400" : "text-zinc-400"
                }`}
              >
                {tab === "overview" ? "Views" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold font-outfit tracking-tight text-white flex items-center gap-2">
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "projects" && "Projects Manager"}
              {activeTab === "blogs" && "Blogging Dashboard"}
            </h1>
            <p className="text-xs text-zinc-400">
              Manage database assets and monitor traffic geocoding telemetry.
            </p>
          </div>

          <Link href="/">
            <button className="flex items-center space-x-2 text-xs font-semibold tracking-wide text-zinc-400 hover:text-white transition-all py-2 px-3 bg-white/5 border border-white/5 rounded-xl">
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
                  <div key={idx} className="p-5 rounded-2xl glass-card relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{metric.label}</span>
                      <div className={`p-2 rounded-xl border flex items-center justify-center ${metric.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold font-outfit text-white tracking-tight">{metric.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Leaderboard */}
              <div className="p-6 rounded-[24px] glass-card relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold font-outfit text-white flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-amber-400" />
                    <span>Most Starred Projects</span>
                  </h3>
                  <span className="text-[9px] font-bold uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-400">
                    Leaderboard
                  </span>
                </div>
                {topProjects.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">No dynamic database projects recorded.</div>
                ) : (
                  <div className="space-y-3">
                    {topProjects.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-zinc-500 font-mono w-4">#{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-white leading-none mb-1.5">{p.title}</p>
                            <p className="text-[9px] text-zinc-400 font-mono">{p.category || "web"}</p>
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

              {/* Blogs Leaderboard */}
              <div className="p-6 rounded-[24px] glass-card relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold font-outfit text-white flex items-center gap-2">
                    <BookHeart className="w-4 h-4 text-red-400" />
                    <span>Most Liked Blogs</span>
                  </h3>
                  <span className="text-[9px] font-bold uppercase bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded text-red-400">
                    Leaderboard
                  </span>
                </div>
                {topBlogs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">No dynamic database blogs published.</div>
                ) : (
                  <div className="space-y-3">
                    {topBlogs.map((b, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-zinc-500 font-mono w-4">#{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-white leading-none mb-1.5">{b.title}</p>
                            <p className="text-[9px] text-zinc-400 font-mono">{b.category || "Tech"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold font-mono">
                          <span>♥</span>
                          <span>{b.likes || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Geolocation visitor logs table */}
            <div className="p-6 rounded-[24px] glass-card relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold font-outfit text-white">Live Visitor Geolocation Telemetry</h3>
                <span className="text-[10px] font-bold uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded-md text-zinc-400">
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
                      <tr className="border-b border-white/5 text-zinc-400 uppercase font-bold tracking-wider text-[9px]">
                        <th className="pb-3.5 pl-2">Device Profile & Screen</th>
                        <th className="pb-3.5">IP Address & ISP</th>
                        <th className="pb-3.5">Geocoded Location</th>
                        <th className="pb-3.5">Timestamp</th>
                        <th className="pb-3.5 pr-2 text-right">System Agent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analytics.logs.map((log, index) => (
                        <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3 pl-2 flex items-center space-x-2 text-zinc-200">
                            {log.device === "Mobile" ? (
                              <Smartphone className="w-4 h-4 text-red-400 flex-shrink-0" />
                            ) : log.device === "Tablet" ? (
                              <Tablet className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            ) : (
                              <Monitor className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                            <div>
                              <span className="font-semibold text-xs text-white">{log.device || "Desktop"}</span>
                              <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">{log.screenResolution || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="py-3 text-zinc-300 font-mono text-xs">
                            <div>
                              <span>{log.ip}</span>
                              <span className="block text-[10px] text-zinc-500 font-sans mt-0.5 max-w-[150px] truncate" title={log.isp || "Localhost Network"}>
                                {log.isp || "Localhost Network"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-zinc-200 font-medium text-xs">
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
                          <td className="py-3 text-zinc-400 font-mono text-[10px]">
                            {new Date(log.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-3 text-zinc-400 pr-2 text-right text-[10px] font-medium">
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
            <div className="flex justify-between items-center p-6 rounded-[24px] glass-card relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">Dynamic Project Control Panel</h3>
                <p className="text-xs text-zinc-400">Launch premium workspace consoles to edit or upload projects in distraction-free mode.</p>
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
            <div className="p-6 rounded-[24px] glass-card relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
              <h3 className="text-lg font-bold font-outfit text-white mb-4">Existing dynamic uploaded projects</h3>
              
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
                    <div key={idx} className="flex justify-between items-center p-4 bg-[#121214]/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.title}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.tech.map((t, tIdx) => (
                            <span key={tIdx} className="text-[8px] bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase font-semibold">
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
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all"
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
            <div className="flex justify-between items-center p-6 rounded-[24px] glass-card relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">Dynamic Markdown Blog Panel</h3>
                <p className="text-xs text-zinc-400">Launch our distraction-free, fullscreen split-pane workspace with real-time markdown compilers.</p>
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
            <div className="p-6 rounded-[24px] glass-card relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none" />
              <h3 className="text-lg font-bold font-outfit text-white mb-4">Published dynamic database blogs</h3>
              
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
                    <div key={idx} className="flex justify-between items-center p-4 bg-[#121214]/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                      <div>
                        <h4 className="text-xs font-bold text-white">{b.title}</h4>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">
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
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all"
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
            <div className="flex-1 flex overflow-hidden">
              {/* Left Pane (Editor Form) */}
              <div className="w-1/2 p-10 overflow-y-auto border-r border-white/5 space-y-6 select-text">
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

              {/* Right Pane (Live README Markdown Preview) */}
              <div className="w-1/2 p-10 bg-[#09090b] overflow-y-auto flex flex-col justify-start text-left select-text">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-3 border-b border-white/5 mb-6 text-center select-none">
                  Live README Markdown Preview compiles on-the-go
                </h3>
                
                <div className="w-full max-w-2xl bg-white/[0.01] border border-white/5 rounded-2xl p-8 min-h-[400px]">
                  {newBlogContent.trim() ? (
                    renderMarkdownContent(newBlogContent)
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
