"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomToast from "./CustomToast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
  FolderKanban,
  Star,
  Cpu,
  BookOpen,
  Heart,
  FileText,
} from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";
import Link from "next/link";

// macOS-like Spring Dock Item Wrapper
const DockItem = ({ href, target, rel, children, isDark }) => {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`p-2.5 sm:p-3 rounded-xl transition-colors duration-300 flex items-center justify-center relative group z-10`}
      whileHover={{ 
        scale: 1.25, 
        y: -10,
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
      }}
      transition={{ type: "spring", stiffness: 450, damping: 20 }}
    >
      {children}
      {/* Tooltip */}
      <span className={`absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 font-sans tracking-tight ${
        isDark ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "bg-white text-zinc-800 border border-zinc-200 shadow-md"
      }`}>
        {href.includes("github") ? "GitHub" :
         href.includes("linkedin") ? "LinkedIn" :
         href.includes("mailto") ? "Email" :
         href.includes("x.com") ? "Twitter" :
         href.includes("leetcode") ? "LeetCode" :
         href.includes("codeforces") ? "Codeforces" :
         href.includes("youtube") ? "YouTube" : "Theme"}
      </span>
    </motion.a>
  );
};

// Interactive Spotlight Card Component
const SpotlightCard = ({ children, isDark, className = "", style = {} }) => {
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

  const classesList = className.split(/\s+/).filter(Boolean);
  const gridClasses = classesList.filter(c => c.startsWith("col-span-") || c.startsWith("row-span-")).join(" ");
  const innerClasses = classesList.filter(c => !c.startsWith("col-span-") && !c.startsWith("row-span-")).join(" ");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[24px] flex flex-col ${
        isDark ? "glass-card hover:border-white/10" : "glass-card-light hover:border-black/10"
      } transition-all duration-300 shadow-lg hover:shadow-2xl ${gridClasses}`}
      style={style}
    >
      {/* Reflective top highlight */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${
        isDark ? "via-white/10" : "via-black/5"
      } to-transparent pointer-events-none z-20`} />

      {/* Mouse spotlight light effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${
            isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.025)"
          }, transparent 80%)`,
        }}
      />

      {/* Dynamic Border Spotlight mask matching macOS dock coordinate glows */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-300 z-10"
          style={{
            border: isDark ? "1.5px solid rgba(255, 255, 255, 0.4)" : "1.5px solid rgba(0, 0, 0, 0.15)",
            background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)"}, transparent 80%)`,
            maskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
          }}
        />
      )}
      
      <div className={`relative z-20 w-full h-full flex flex-col ${innerClasses}`}>{children}</div>
    </div>
  );
};

const fallbackBlogs = [
  {
    _id: "fb1",
    title: "Building Scalable AI Search Engines with FAISS",
    category: "AI & Search",
    likes: 18,
    excerpt: "An in-depth exploration of vector databases, similarity indexing, and building blazingly fast semantic search architectures...",
    created_at: new Date("2024-01-01")
  },
  {
    _id: "fb2",
    title: "Architecting High-Performance Next.js Serverless Routers",
    category: "Web Engineering",
    likes: 24,
    excerpt: "Demystifying connection pools, route compiler trees, force-dynamic exports, and securing serverless executions under modern Vercel constraints...",
    created_at: new Date("2024-01-02")
  }
];

const staticFallbackProjects = [
  {
    title: "Hireonova – AI Job Engine",
    description: "Crawled 200K+ jobs, AI resume matcher with Ollama 3B",
    link: "https://github.com/Hireonova",
    deployedLink: null,
    tech: ["Python", "Playwright", "MERN", "NLP"],
    stars: 12
  },
  {
    title: "MOSDAC ISRO Chatbot",
    description: "FAISS + Gemma 3B based chatbot for ISRO queries",
    link: "https://github.com/nickhil-verma/MOSDAC_PARENT_REPO/tree/main",
    deployedLink: null,
    tech: ["React", "Node.js", "Gemma 3B", "MongoDB"],
    stars: 8
  },
  {
    title: "Eternalan Concerts",
    description: "Concert booking platform tailored for Chinese and US audiences.",
    link: "https://github.com/nickhil-verma/eternalan",
    deployedLink: "https://eternalan.vercel.app",
    tech: ["React", "Tailwind CSS", "JavaScript"],
    stars: 15
  },
  {
    title: "Plant Disease Detection",
    description: "95% accuracy CNN model for 15 leaf diseases",
    link: "https://github.com/nickhil-verma/Plant-disease-detection-model",
    deployedLink: null,
    tech: ["TensorFlow", "Keras", "NumPy", "HuggingFace"],
    stars: 9
  },
  {
    title: "CEDAXDSU Club Website",
    description: "IEEE Bangalore Chapter × DSU – Frontend Portal",
    link: "https://github.com/nickhil-verma/CEDAXDSU",
    deployedLink: "https://dsuieeeceda.vercel.app/",
    tech: ["React", "Tailwind CSS", "framer-motion", "Node js"],
    stars: 11
  }
];

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true);
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedExperience, setExpandedExperience] = useState(0); // Index 0 expanded by default
  const [liveProjects, setLiveProjects] = useState([]);
  const [starredProjectIds, setStarredProjectIds] = useState([]);
  const [liveBlogs, setLiveBlogs] = useState([]);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

  useEffect(() => {
    try {
      const storedStars = localStorage.getItem("starred_projects");
      if (storedStars) {
        const parsedStars = JSON.parse(storedStars);
        setStarredProjectIds(parsedStars);
        
        // Sync static fallback projects star count in memory on mount
        staticFallbackProjects.forEach(p => {
          if (parsedStars.includes(p.title) && !p.hasStarredIncremented) {
            p.stars = (p.stars || 0) + 1;
            p.hasStarredIncremented = true;
          }
        });
      }

      const storedLikes = localStorage.getItem("liked_blogs");
      if (storedLikes) {
        const parsedLikes = JSON.parse(storedLikes);
        setLikedBlogIds(parsedLikes);

        // Sync static fallback blogs likes count in memory on mount
        fallbackBlogs.forEach(b => {
          if (parsedLikes.includes(b._id || b.title) && !b.hasLikedIncremented) {
            b.likes = (b.likes || 0) + 1;
            b.hasLikedIncremented = true;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load local storage locks:", e);
    }
  }, []);

  const handleToggleStarProject = async (project) => {
    const id = project._id || project.title;
    const isStarred = starredProjectIds.includes(id);
    const action = isStarred ? "unstar" : "star";

    // 1. Toggle locally for instant responsive UI feedback
    let nextStarred;
    if (isStarred) {
      nextStarred = starredProjectIds.filter(x => x !== id);
    } else {
      nextStarred = [...starredProjectIds, id];
      setToast({ message: "Thank you for liking! ⭐", type: "star", key: Date.now() });
    }
    setStarredProjectIds(nextStarred);
    localStorage.setItem("starred_projects", JSON.stringify(nextStarred));

    // Calculate current stars count
    const currentCount = (interactions[id] !== undefined)
      ? interactions[id]
      : (project.stars || 0);
    const increment = isStarred ? -1 : 1;
    const newCount = Math.max(0, currentCount + increment);

    // Update interactions mapping locally
    setInteractions(prev => ({ ...prev, [id]: newCount }));

    // 2. Dispatch database call to interactions endpoint
    try {
      const fallbackVal = project.stars || 0;
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(id)}&type=star&action=${action}&fallback=${fallbackVal}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setInteractions(prev => ({ ...prev, [id]: data.count }));
        // Also update live projects state so dynamic data maps accurately
        if (project._id) {
          setLiveProjects(prev => prev.map(p => p._id === project._id ? { ...p, stars: data.count } : p));
        }
      }
    } catch (err) {
      console.error("Failed to update stars in database:", err);
    }
  };

  const handleToggleLikeBlog = async (blog) => {
    const id = blog._id || blog.title;
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

    // Update interactions mapping locally
    setInteractions(prev => ({ ...prev, [id]: newCount }));

    // 2. Dispatch database call to interactions endpoint
    try {
      const fallbackVal = blog.likes || 0;
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(id)}&type=like&action=${action}&fallback=${fallbackVal}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setInteractions(prev => ({ ...prev, [id]: data.count }));
        // Also update live blogs state so dynamic data maps accurately
        if (blog._id) {
          setLiveBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, likes: data.count } : b));
        }
      }
    } catch (err) {
      console.error("Failed to update likes in database:", err);
    }
  };

  // Dock spotlight variables
  const [dockCoords, setDockCoords] = useState({ x: 0, y: 0 });
  const [isDockHovered, setIsDockHovered] = useState(false);
  const dockRef = useRef(null);

  const handleDockMouseMove = (e) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setDockCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch("/api/github-stats");
        const statsData = await response.json();

        if (statsData.error) {
          throw new Error(statsData.error);
        }

        setGithubStats({
          avatarUrl: statsData.avatarUrl || "https://avatars.githubusercontent.com/u/99318181?v=4",
          name: statsData.name || "Nikhil Verma",
          repoCount: statsData.repoCount || 77,
          commits: statsData.commits || "1,480+",
          loc: statsData.loc || "12,400+",
          languages: statsData.languages || "JS/TS/Py",
          totalStars: statsData.totalStars || 45,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats via API route, falling back to REST:", error);
        
        // REST API client-side fallback
        try {
          const response = await fetch(
            "https://api.github.com/users/nickhil-verma"
          );
          const userData = await response.json();

          const reposResponse = await fetch(
            "https://api.github.com/users/nickhil-verma/repos?per_page=100"
          );
          const reposData = await reposResponse.json();

          const totalStars = Array.isArray(reposData)
            ? reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0)
            : 0;

          const publicReposCount = userData.public_repos || 77;

          // Estimate commits & LOC dynamically from REST fallback
          let dynamicCommits = "1,480+";
          let dynamicLOC = "12,400+";
          let dynamicLanguages = "JS/TS/Py";

          if (Array.isArray(reposData)) {
            const totalSizeKB = reposData.reduce((acc, r) => acc + (r.size || 0), 0);
            
            const estimatedCommits = reposData.reduce((acc, r) => acc + Math.round((r.size || 0) / 12 + (r.stargazers_count || 0) * 6 + 20), 0);
            dynamicCommits = estimatedCommits.toLocaleString() + "+";

            const estimatedLOC = Math.round(totalSizeKB * 20);
            dynamicLOC = estimatedLOC.toLocaleString() + "+";

            const langCounts = {};
            reposData.forEach(r => {
              if (r.language) {
                langCounts[r.language] = (langCounts[r.language] || 0) + 1;
              }
            });
            const sortedLangs = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a]);
            const langMapper = (l) => {
              const map = {
                "JavaScript": "JS",
                "TypeScript": "TS",
                "Python": "Py",
                "C++": "C++",
                "HTML": "HTML",
                "CSS": "CSS",
                "Jupyter Notebook": "Ipynb",
                "Shell": "Sh"
              };
              return map[l] || l.slice(0, 4);
            };
            if (sortedLangs.length > 0) {
              dynamicLanguages = sortedLangs.slice(0, 3).map(langMapper).join("/");
            }
          }

          setGithubStats({
            avatarUrl: userData.avatar_url || "https://avatars.githubusercontent.com/u/99318181?v=4",
            name: userData.name || "Nikhil Verma",
            repoCount: publicReposCount,
            commits: dynamicCommits,
            loc: dynamicLOC,
            languages: dynamicLanguages,
            totalStars: totalStars || 45,
          });
        } catch (fallbackError) {
          console.error("Error in REST fallback:", fallbackError);
          setGithubStats({
            avatarUrl: "https://avatars.githubusercontent.com/u/99318181?v=4",
            name: "Nikhil Verma",
            repoCount: 77,
            commits: "1,480+",
            loc: "12,400+",
            languages: "JS/TS/Py",
            totalStars: 45,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  // Log visit and fetch dynamic projects on mount
  useEffect(() => {
    const logVisitAndFetchProjects = async () => {


      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch live projects from MongoDB:", err);
      }

      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch live blogs from MongoDB:", err);
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
    logVisitAndFetchProjects();
  }, []);

  // Theme Sync with standard class modifiers
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleThemeChange = (val) => {
    setIsDark(val);
    localStorage.setItem("theme", val ? "dark" : "light");
    if (val) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const combinedProjects = [...liveProjects, ...staticFallbackProjects];
  const combinedBlogs = [...liveBlogs, ...fallbackBlogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const experiences = [
    {
      title: "Full Stack Intern",
      company: "Donald Hans, LA (Remote)",
      period: "Jun 2025 – Sept 2025",
      description: [
  "Advanced SEO Engineering: Architected structured microdata schematics and dynamic sitemap topologies, accelerating organic discoverability and elevating the SEO score from 71% to 94%.",
  "Intelligent Agentic Chatbots: Engineered a high-fidelity chatbot MVP powered by the Google Gemini API, integrating a custom RAG (Retrieval-Augmented Generation) pipeline anchored by a Knowledge Graph to achieve context-aware, deterministic responses.",
  "Latency Optimization: Restructured runtime Express middleware and request-handling topologies, yielding a 30% reduction in form processing latency.",
  "Automated GitOps & Deployment: Orchestrated production-grade CI/CD automation blueprints utilizing GitHub Actions and Vercel to enforce seamless, zero-downtime deployment workflows."
],
    },
    {
      title: "Webmaster Head",
      company: "IEEE CEDA Student Chapter (Remote)",
      period: "Sept 2024 – Present",
      description: [
        "Engineered a high-throughput email broadcasting pipeline reaching 500+ members, leveraging automated workflows with n8n, NodeMailer, and Twilio integrations.",
        "Developed an automated QR-based certificate generation and authentication system, enabling secure, tamper-resistant verification for event participants.",
        "Implemented secure JWT-based RBAC and streamlined CI/CD pipelines via GitHub Actions, ensuring reliable and compliant deployments.",
      ],
    },
  ];

  const achievements = [
    "Grand Finalist – SIH 2024 (Top 5/500 nationally)",
    "IEEE AVINYA Hackathon Winner",
    "Built a 500+ user university club site with broadcast system",
    "Global Rank 1097/35K – LeetCode Weekly Contest 408",
    "1700+ LeetCode rating, 300+ problems solved",
  ];

  const skillset = [
    { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "C++", "HTML/CSS"] },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Redux"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"] },
    { category: "AI & ML", items: ["TensorFlow", "Keras", "NLP", "Ollama", "FAISS", "Gemini API"] },
    { category: "Tools", items: ["Git", "GitHub Actions", "Vercel", "Docker", "Playwright"] }
  ];

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-0 relative overflow-hidden select-none font-sans ${
        isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
      }`}
    >
      {/* Background static noise and texture overlay */}
      <div className="absolute inset-0 z-0 noise-overlay pointer-events-none" />

      {/* Grid Mesh Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "grid-mesh" : "grid-mesh-light"}`} />
      </div>

      {/* Soft Ambient Floating Blurred Gradient Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] left-[10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] right-[15%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none"
        />
      </div>



      {/* Main Content Container */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full">
          {/* Desktop Grid Layout (Bento Grid) - Height is dynamic to prevent clipping distortion */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 grid-rows-8 gap-5 min-h-[820px]">
              
              {/* Card 1: About / Hero - Flexible Padding and Aspect Ratio */}
              <SpotlightCard isDark={isDark} className="col-span-5 row-span-4 p-6 sm:p-8 flex flex-col justify-center items-center text-center">

                {/* Avatar with Ambient Glow - Width and height locked on parent to ensure absolute centering */}
                <div className="relative mb-4 w-20 h-20 sm:w-24 sm:h-24 group">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md group-hover:bg-red-500/35 transition-colors duration-500" />
                  <img
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/10 group-hover:scale-105 transition-transform duration-500 object-cover shadow-xl"
                    src="https://i.pinimg.com/736x/00/51/9a/00519ae0e89f8b1252d33ab1eeb337fc.jpg"
                    alt="Nikhil Verma"
                  />
                </div>

                <h1 
                  style={{ fontFamily: "'Instrument Serif', cursive" }}
                  className={`text-4xl sm:text-5xl font-normal italic tracking-wide mb-1.5 ${isDark ? "text-white" : "text-zinc-900"}`}
                >
                  Nikhil Verma
                </h1>
                <p className={`text-xs sm:text-sm font-semibold mb-3 tracking-wide uppercase ${isDark ? "text-red-400" : "text-red-600"}`}>
                  Software Developer
                </p>
                <p className={`text-xs leading-relaxed max-w-sm mb-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Passionate about scalable apps, AI engines, and crafting developer-first user experiences with absolute performance precision.
                </p>

                {/* Stats Banner Tagline */}
                <div className={`mb-5 px-3 py-2 rounded-xl border text-[10px] sm:text-xs font-mono tracking-wide w-full flex items-center justify-around gap-2 ${
                  isDark ? "bg-[#09090b]/80 border-white/5 text-red-400" : "bg-black/[0.02] border-black/5 text-red-600 shadow-sm"
                }`}>
                  <span className="font-bold flex items-center gap-1">🏆 4x Hacks</span>
                  <span className="opacity-30">|</span>
                  <span className="font-bold flex items-center gap-1">🚀 30+ Projs</span>
                  <span className="opacity-30">|</span>
                  <span className="font-bold flex items-center gap-1">🌍 10 Deployed</span>
                  <span className="opacity-30">|</span>
                  <span className="font-bold flex items-center gap-1">💻 1500+ LeetCode</span>
                </div>

                {/* Email and Resume Button Area */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                  <a
                    href="mailto:vermanick75@gmail.com"
                    className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300 hover:text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700 hover:text-zinc-900 shadow-sm"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>vermanick75@gmail.com</span>
                  </a>

                  <a
                    href="https://drive.google.com/file/d/1ZgAlhK1aCL-lr9i2jp6PgQwE6tGYyr8u/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                  >
                    <span>View Resume</span>
                  </a>
                </div>
              </SpotlightCard>

              {/* Card 2: Experience Card with Timeline Track & glowing nodes */}
              <SpotlightCard isDark={isDark} className="col-span-7 row-span-4 p-6 sm:p-8 flex flex-col justify-start">
                <div className="flex items-center space-x-3 mb-5 flex-shrink-0">
                  <Briefcase className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-xl sm:text-2xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Experience
                  </h2>
                </div>

                {/* Timeline Container - Height locked to prevent parent card jitter, scrollbar enabled */}
                <div data-lenis-prevent className="relative pl-8 pr-2 space-y-5 overflow-y-auto h-[260px] sm:h-[300px]" onWheel={(e) => e.stopPropagation()}>
                  {/* Vertical Timeline Track Line - Mathematically aligned at center = 16px */}
                  <div className={`absolute left-[15px] top-3 bottom-3 w-0.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

                  {experiences.map((exp, index) => {
                    const isExpanded = expandedExperience === index;
                    return (
                      <div
                        key={index}
                        onClick={() => setExpandedExperience(isExpanded ? null : index)}
                        className={`relative p-4 rounded-2xl transition-all duration-300 ml-2 cursor-pointer ${
                          isDark 
                            ? "bg-[#121214]/50 border border-white/5 hover:bg-[#18181b]/50" 
                            : "bg-white/60 border border-black/5 hover:bg-white shadow-sm"
                        }`}
                      >
                        {/* glowing Node Circle - Centered exactly at 16px */}
                        <div className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full flex items-center justify-center z-20 ${
                          isExpanded 
                            ? "bg-red-500 ring-4 ring-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" 
                            : isDark ? "bg-zinc-700 ring-4 ring-zinc-700/20" : "bg-zinc-300 ring-4 ring-zinc-300/10"
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-bold font-outfit text-sm sm:text-base ${isDark ? "text-white" : "text-zinc-900"}`}>
                              {exp.title}
                            </h3>
                            <p className={`text-xs font-medium tracking-wide mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                              {exp.company}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              isDark ? "bg-[#1e1e24] text-zinc-300 border border-white/5" : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {exp.period}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-90 text-red-500" : ""}`} />
                          </div>
                        </div>

                        {/* Timeline Details list */}
                        <AnimatePresence initial={index === 0}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <ul className="list-disc pl-4 text-xs space-y-1.5 border-t pt-3 border-dashed border-zinc-700/30">
                                {exp.description.map((point, idx) => (
                                  <li key={idx} className={isDark ? "text-zinc-300" : "text-zinc-700"}>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </SpotlightCard>

              {/* Card 3: Featured Projects with Scroll Container & styled Scrollbar */}
              <SpotlightCard isDark={isDark} className="col-span-8 row-span-4 p-6 sm:p-8 flex flex-col justify-start">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <h2 className={`text-xl sm:text-2xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                      Featured Projects
                    </h2>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isDark ? "bg-white/5 text-zinc-300" : "bg-black/5 text-zinc-600"
                    }`}>
                      {combinedProjects.length} Total
                    </span>
                  </div>
                  <Link
                    href="/projects"
                    className={`text-xs font-bold transition-all hover:underline flex items-center space-x-1 ${
                      isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Fixed height scrollable projects container with visible premium custom scrollbar */}
                <div data-lenis-prevent className="overflow-y-auto pr-2 h-[260px] sm:h-[300px]" onWheel={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-3 gap-4 pb-2">
                    {combinedProjects.map((project, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl flex flex-col justify-between group transition-all duration-300 min-h-[220px] ${
                          isDark 
                            ? "bg-[#121214]/50 border border-white/5 hover:bg-[#18181b]/50" 
                            : "bg-white/60 border border-black/5 hover:bg-white shadow-sm"
                        }`}
                      >
                        <div>
                          <h3 className={`font-bold font-outfit text-xs sm:text-sm mb-1.5 group-hover:text-red-400 transition-colors ${
                            isDark ? "text-white" : "text-zinc-900"
                          }`}>
                            {project.title}
                          </h3>
                          <p className={`text-[11px] sm:text-xs leading-relaxed mb-3 font-normal ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            {project.description && project.description.length > 60
                              ? project.description.slice(0, 60) + "..."
                              : project.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tech.map((tech, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider ${
                                  isDark ? "bg-white/5 text-zinc-400 border border-white/5" : "bg-zinc-100 text-zinc-600"
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between w-full mt-2">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={project.link}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wide transition-all ${
                                  isDark 
                                    ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5" 
                                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200"
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                              >
                                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                <span>Code</span>
                              </a>
                              {(project.deployedUrl || project.deployedLink || project.liveLink) && (
                                <a
                                  href={project.deployedUrl || project.deployedLink || project.liveLink}
                                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wide transition-all ${
                                    isDark 
                                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20" 
                                      : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                  }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Live Demo"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>Live</span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => handleToggleStarProject(project)}
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                                starredProjectIds.includes(project._id || project.title)
                                  ? "bg-[#ef4444]/10 text-red-400 border-red-500/30"
                                  : isDark
                                    ? "bg-white/5 text-zinc-400 hover:text-white border-white/5"
                                    : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 border-zinc-200"
                              }`}
                            >
                              <Star className={`w-3 h-3 ${starredProjectIds.includes(project._id || project.title) ? "fill-current" : ""}`} />
                              <span>{interactions[project._id || project.title] !== undefined ? interactions[project._id || project.title] : (project.stars || 0)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>

              {/* Card 4: Education */}
              <SpotlightCard isDark={isDark} className="col-span-4 row-span-2 p-6 flex flex-col justify-center">
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <GraduationCap className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-base sm:text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Education
                  </h2>
                </div>
                <div>
                  <h3 className={`font-bold font-outfit text-xs sm:text-sm leading-snug mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    B.Tech in Electronics and Communication
                  </h3>
                  <p className={`text-[11px] sm:text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Dayananda Sagar University, Bengaluru
                  </p>
                  <p className={`text-[11px] sm:text-xs font-semibold mt-1 ${isDark ? "text-red-400" : "text-red-600"}`}>
                    GPA: 8.0/10.0
                  </p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider mt-2 ${
                    isDark ? "bg-[#1e1e24] text-red-400 border border-white/5" : "bg-red-50 text-red-600"
                  }`}>
                    2023 – 2027
                  </span>
                </div>
              </SpotlightCard>

              {/* Card 5: Achievements */}
              <SpotlightCard isDark={isDark} className="col-span-4 row-span-2 p-6 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-2.5">
                  <Award className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-base sm:text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Achievements
                  </h2>
                </div>
                <div data-lenis-prevent className="space-y-1.5 overflow-y-auto pr-1 flex-1 hide-scrollbar" onWheel={(e) => e.stopPropagation()}>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${isDark ? "bg-red-400" : "bg-red-600"}`} />
                      <span className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

            </div>

            {/* Desktop Skillset & Blogs Cards Grid */}
            <div className="grid grid-cols-12 gap-5 mt-5">
              {/* Left Stacked Column (Skills & Github) */}
              <div className="col-span-8 flex flex-col gap-5">
                {/* Skillset Card */}
                <SpotlightCard isDark={isDark} className="w-full p-4 sm:p-5 flex flex-col justify-between h-[170px]">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-3 flex-shrink-0">
                      <Cpu className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                      <h2 className={`text-sm sm:text-base font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                        Technical Skillset
                      </h2>
                    </div>
                    
                    {/* Infinite Scrolling Professional Marquees */}
                    <div className="space-y-3.5 overflow-hidden relative py-1 mt-1">
                      {/* Track 1: Left-to-Right Scrolling Marquee */}
                      <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                        <motion.div
                          animate={{ x: ["0%", "-50%"] }}
                          transition={{
                            ease: "linear",
                            duration: 25,
                            repeat: Infinity,
                          }}
                          className="flex space-x-3 w-max"
                        >
                          {[...skillset[0].items, ...skillset[1].items, ...skillset[0].items, ...skillset[1].items].map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                                isDark
                                  ? "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10 hover:text-white"
                                  : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-950"
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </motion.div>
                      </div>

                      {/* Track 2: Right-to-Left Scrolling Marquee */}
                      <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                        <motion.div
                          animate={{ x: ["-50%", "0%"] }}
                          transition={{
                            ease: "linear",
                            duration: 28,
                            repeat: Infinity,
                          }}
                          className="flex space-x-3 w-max"
                        >
                          {[...skillset[2].items, ...skillset[3].items, ...skillset[4].items, ...skillset[2].items, ...skillset[3].items, ...skillset[4].items].map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                                isDark
                                  ? "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10 hover:text-white"
                                  : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-950"
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* GitHub Stats Card - Middle */}
                <SpotlightCard isDark={isDark} className="w-full p-3 sm:p-4 flex flex-col justify-between h-[190px] relative overflow-hidden">
                  {/* Decorative Cover Image background banner at top */}
                  <div className={`absolute top-0 inset-x-0 h-[76px] ${
                    isDark 
                      ? "border-b border-white/5" 
                      : "border-b border-black/5"
                  } overflow-hidden flex items-center justify-center px-4 z-0`}
                  style={{
                    backgroundImage: `url("https://camo.githubusercontent.com/20b0e586a6532cedfecaaefed0e8fe35dd5acf524e30a5d2dd5e75f637e95ef1/68747470733a2f2f692e706f7374696d672e63632f6b47366e6d5a475a2f41534b2d42616e6e65722d496d6167652d4769746875622e706e67")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}>
                    {/* Semi-transparent dark overlay to ensure readability */}
                    <div className="absolute inset-0 bg-black/35 z-0" />

                    {/* Centered Profile Info: Avatar, Name & Username in Center */}
                    <div className="flex flex-col items-center justify-center text-center z-10 mt-1">
                      {/* Avatar Octocat circular */}
                      <div className={`w-[38px] h-[38px] rounded-full border-2 ${isDark ? "border-red-400 bg-zinc-900" : "border-white bg-white"} overflow-hidden flex-shrink-0 flex items-center justify-center shadow`}>
                        <img
                          src={githubStats?.avatarUrl || "https://avatars.githubusercontent.com/u/99318181?v=4"}
                          alt="Nikhil Verma Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-0.5">
                        <h4 className="text-[11px] font-black font-outfit tracking-tight text-white leading-none mb-0.5">
                          {githubStats?.name || "Nikhil Verma"}
                        </h4>
                        <span className="text-[8px] font-bold font-mono text-zinc-300 leading-none">
                          @nickhil-verma
                        </span>
                      </div>
                    </div>

                    {/* Banner Right: External Link - Absolute positioned on top right */}
                    <a
                      href="https://github.com/nickhil-verma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg border transition-all bg-black/40 border-white/10 hover:bg-black/60 text-white shadow-sm"
                      title="View GitHub Profile"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Empty spacer for the absolute banner height */}
                  <div className="h-[76px] flex-shrink-0" />

                  {/* 4 Column Bottom Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 items-center flex-1 py-3 px-2 z-10">
                    {/* Repo Count Metric */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                        Repo Count
                      </span>
                      <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {githubStats?.repoCount || 77}
                      </span>
                    </div>

                    {/* Commits Metric */}
                    <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="4"/>
                        <line x1="1.05" y1="12" x2="8" y2="12"/>
                        <line x1="16" y1="12" x2="22.95" y2="12"/>
                      </svg>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                        Commits
                      </span>
                      <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {githubStats?.commits || "0"}
                      </span>
                    </div>

                    {/* Lines of Code Metric */}
                    <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                        Line of code
                      </span>
                      <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {githubStats?.loc || "0"}
                      </span>
                    </div>

                    {/* Languages Metric */}
                    <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                      </svg>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                        Languages
                      </span>
                      <span className={`text-[10px] font-black font-mono mt-1 leading-none ${isDark ? "text-white" : "text-zinc-900"} truncate max-w-full px-1`} title={githubStats?.languages || "JS, TS, Python"}>
                        {githubStats?.languages || "Null"}
                      </span>
                    </div>
                  </div>


                </SpotlightCard>
              </div>

              {/* Blogs Card */}
              <SpotlightCard isDark={isDark} className="col-span-4 p-6 sm:p-8 flex flex-col justify-start h-[380px]">
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <div className="flex items-center space-x-2.5">
                    <FileText className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                    <h2 className={`text-base sm:text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                      Recent Insights
                    </h2>
                  </div>
                  <Link
                    href="/blogs"
                    className={`text-xs font-bold transition-all hover:underline flex items-center space-x-1 ${
                      isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div data-lenis-prevent className="space-y-4 overflow-y-auto pr-1 flex-1 hide-scrollbar max-h-[240px]" onWheel={(e) => e.stopPropagation()}>
                  {combinedBlogs.slice(0, 2).map((blog, idx) => (
                    <Link
                      key={idx}
                      href={`/blogs/${blog._id}`}
                      className={`block p-4 rounded-2xl flex flex-col justify-between transition-all group cursor-pointer ${
                        isDark 
                          ? "bg-[#121214]/50 border border-white/5 hover:bg-[#18181b]/50 hover:border-red-500/20" 
                          : "bg-white/60 border border-black/5 hover:bg-white hover:border-red-200 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                          isDark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"
                        }`}>
                          {blog.category}
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleLikeBlog(blog); }}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition-all ${
                            likedBlogIds.includes(blog._id || blog.title)
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : isDark 
                                ? "bg-white/5 text-zinc-500 hover:text-white border-white/5" 
                                : "bg-zinc-100 text-zinc-500 border-zinc-200"
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${likedBlogIds.includes(blog._id || blog.title) ? "fill-current" : ""}`} />
                          <span className="text-[10px] font-bold">{interactions[blog._id || blog.title] !== undefined ? interactions[blog._id || blog.title] : (blog.likes || 0)}</span>
                        </button>
                      </div>
                      <h3 className={`font-bold font-outfit text-xs sm:text-sm mb-1 group-hover:text-red-400 transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {blog.title}
                      </h3>
                      <p className={`text-[10px] sm:text-xs leading-relaxed line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {blog.excerpt}
                      </p>
                      <span className={`mt-2 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                        isDark ? "text-red-500/60 group-hover:text-red-400" : "text-red-400 group-hover:text-red-600"
                      }`}>
                        Read article <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* Mobile and Tablet Layout */}
          <div className="lg:hidden space-y-5 pb-24">
            
            {/* About (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-6 flex flex-col justify-center items-center text-center">

              {/* Avatar with Ambient Glow - Width and height locked on parent to ensure absolute centering */}
              <div className="relative mb-4 w-20 h-20 group">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md group-hover:bg-red-500/35 transition-colors duration-500" />
                <img
                  className="relative w-20 h-20 rounded-full border-2 border-white/10 group-hover:scale-105 transition-transform duration-500 object-cover shadow-lg"
                  src="https://i.pinimg.com/736x/00/51/9a/00519ae0e89f8b1252d33ab1eeb337fc.jpg"
                  alt="Nikhil Verma"
                />
              </div>

              <h1 
                style={{ fontFamily: "'Instrument Serif', cursive" }}
                className={`text-4xl font-normal italic tracking-wide mb-1.5 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                Nikhil Verma
              </h1>
              <p className={`text-sm font-semibold mb-3 tracking-wide uppercase ${isDark ? "text-red-400" : "text-red-600"}`}>
                Software Developer
              </p>
              <p className={`text-xs leading-relaxed max-w-sm mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Passionate about scalable apps, AI engines, and crafting developer-first user experiences with absolute performance precision.
              </p>

              {/* Stats Banner Tagline */}
              <div className={`mb-5 px-3 py-2 rounded-xl border text-[10px] sm:text-xs font-mono tracking-wide w-full flex items-center justify-around gap-2 ${
                isDark ? "bg-[#09090b]/80 border-white/5 text-red-400" : "bg-black/[0.02] border-black/5 text-red-600 shadow-sm"
              }`}>
                <span className="font-bold flex items-center gap-1">🏆 8x Hacks</span>
                <span className="opacity-30">|</span>
                <span className="font-bold flex items-center gap-1">🚀 30+ Projs</span>
                <span className="opacity-30">|</span>
                <span className="font-bold flex items-center gap-1">🌍 10 Deployed</span>
                <span className="opacity-30">|</span>
                <span className="font-bold flex items-center gap-1">💻 1500+ LeetCode</span>
              </div>

              {/* Email and Resume Button Area */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <a
                  href="mailto:vermanick75@gmail.com"
                  className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300 hover:text-white"
                      : "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700 hover:text-zinc-900 shadow-sm"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>vermanick75@gmail.com</span>
                </a>

                <a
                  href="https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                >
                  <span>View Resume</span>
                </a>
              </div>
            </SpotlightCard>

            {/* Experience timeline with glowing nodes (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-6">
              <div className="flex items-center space-x-2.5 mb-5">
                <Briefcase className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <h2 className={`text-xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Experience
                </h2>
              </div>
              
              <div className="relative pl-6 space-y-4">
                {/* Vertical Timeline line (Mobile) - Centered at 13px */}
                <div className={`absolute left-[13px] top-2 bottom-2 w-0.5 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

                {experiences.map((exp, index) => {
                  const isExpanded = expandedExperience === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setExpandedExperience(isExpanded ? null : index)}
                      className={`relative p-4 rounded-2xl ml-2 cursor-pointer transition-all duration-300 ${
                        isDark ? "bg-[#121214]/50 border border-white/5" : "bg-white/60 border border-black/5"
                      }`}
                    >
                      {/* circular timeline node - Mathematically aligned at 13px */}
                      <div className={`absolute -left-[25px] top-6 w-3 h-3 rounded-full flex items-center justify-center z-20 ${
                        isExpanded 
                          ? "bg-red-500 ring-4 ring-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" 
                          : isDark ? "bg-zinc-700 ring-4 ring-zinc-700/20" : "bg-zinc-300 ring-4 ring-zinc-300/10"
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="flex justify-between items-start mb-2.5">
                        <div>
                          <h3 className={`font-bold font-outfit text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>
                            {exp.title}
                          </h3>
                          <p className={`text-[10px] font-semibold text-zinc-400 mt-0.5`}>
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isDark ? "bg-white/5 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                          }`}>
                            {exp.period}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-90 text-red-500" : ""}`} />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="list-disc pl-4 text-xs space-y-1 border-t pt-3 border-dashed border-zinc-700/30">
                              {exp.description.map((point, idx) => (
                                <li key={idx} className={isDark ? "text-zinc-300" : "text-zinc-700"}>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>

            {/* Featured Projects (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Featured Projects
                </h2>
                <Link
                  href="/projects"
                  className={`text-xs font-bold transition-all hover:underline flex items-center space-x-1 ${
                    isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                  }`}
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {combinedProjects.map((project, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl flex flex-col justify-between group ${
                      isDark ? "bg-[#121214]/50 border border-white/5" : "bg-white/60 border border-black/5"
                    }`}
                  >
                    <div>
                      <h3 className={`font-bold font-outfit text-sm mb-1.5 group-hover:text-red-400 transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {project.title}
                      </h3>
                      <p className={`text-xs leading-relaxed mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {project.description && project.description.length > 70
                          ? project.description.slice(0, 70) + "..."
                          : project.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {project.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                              isDark ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between w-full mt-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={project.link}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isDark ? "bg-white/5 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-600"
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                            <span>Code</span>
                          </a>
                          {(project.deployedUrl || project.deployedLink || project.liveLink) && (
                            <a
                              href={project.deployedUrl || project.deployedLink || project.liveLink}
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                isDark ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live</span>
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleToggleStarProject(project)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                            starredProjectIds.includes(project._id || project.title)
                              ? "bg-[#ef4444]/10 text-red-400 border-red-500/30"
                              : isDark
                                ? "bg-white/5 text-zinc-400 hover:text-white border-white/5"
                                : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 border-zinc-200"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${starredProjectIds.includes(project._id || project.title) ? "fill-current" : ""}`} />
                          <span>{interactions[project._id || project.title] !== undefined ? interactions[project._id || project.title] : (project.stars || 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Education and Achievements Row (Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Education (Mobile) */}
              <SpotlightCard isDark={isDark} className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Education
                  </h2>
                </div>
                <div>
                  <h3 className={`font-bold font-outfit text-sm mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    B.Tech in Electronics and Communication
                  </h3>
                  <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Dayananda Sagar University, Bengaluru
                  </p>
                  <p className={`text-xs font-semibold mt-1 ${isDark ? "text-red-400" : "text-red-600"}`}>
                    GPA: 8.0/10.0
                  </p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-2.5 ${
                    isDark ? "bg-[#1e1e24] text-red-400" : "bg-red-50 text-red-600"
                  }`}>
                    2023 – 2027
                  </span>
                </div>
              </SpotlightCard>

              {/* Achievements (Mobile) */}
              <SpotlightCard isDark={isDark} className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-lg font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Achievements
                  </h2>
                </div>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${isDark ? "bg-red-400" : "bg-red-600"}`} />
                      <span className={`text-[11px] leading-relaxed ${isDark ? "text-[#ededed]" : "text-zinc-700"}`}>
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

            </div>

            {/* Skillset (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-6">
              <div className="flex items-center space-x-2.5 mb-6">
                <Cpu className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <h2 className={`text-xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Technical Skillset
                </h2>
              </div>
              
              {/* Infinite Scrolling Professional Marquees (Mobile) */}
              <div className="space-y-4 overflow-hidden relative py-1">
                {/* Track 1 */}
                <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                  <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 20,
                      repeat: Infinity,
                    }}
                    className="flex space-x-2.5 w-max"
                  >
                    {[...skillset[0].items, ...skillset[1].items, ...skillset[0].items, ...skillset[1].items].map((item, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-[10px] font-semibold tracking-wide ${
                          isDark
                            ? "bg-white/5 text-zinc-300 border border-white/5"
                            : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Track 2 */}
                <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                  <motion.div
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{
                      ease: "linear",
                      duration: 23,
                      repeat: Infinity,
                    }}
                    className="flex space-x-2.5 w-max"
                  >
                    {[...skillset[2].items, ...skillset[3].items, ...skillset[4].items, ...skillset[2].items, ...skillset[3].items, ...skillset[4].items].map((item, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-[10px] font-semibold tracking-wide ${
                          isDark
                            ? "bg-white/5 text-zinc-300 border border-white/5"
                            : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className={`text-[9px] tracking-wider italic font-mono text-center pt-5 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                ✦ Continuous Marquee Loop • Non-stop Animation ✦
              </div>
            </SpotlightCard>

            {/* GitHub Stats (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-3 sm:p-4 flex flex-col justify-between h-[190px] relative overflow-hidden">
              {/* Decorative Cover Image background banner at top */}
              <div className={`absolute top-0 inset-x-0 h-[76px] ${
                isDark 
                  ? "border-b border-white/5" 
                  : "border-b border-black/5"
              } overflow-hidden flex items-center justify-center px-4 z-0`}
              style={{
                backgroundImage: `url("https://camo.githubusercontent.com/20b0e586a6532cedfecaaefed0e8fe35dd5acf524e30a5d2dd5e75f637e95ef1/68747470733a2f2f692e706f7374696d672e63632f6b47366e6d5a475a2f41534b2d42616e6e65722d496d6167652d4769746875622e706e67")`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}>
                {/* Semi-transparent dark overlay to ensure readability */}
                <div className="absolute inset-0 bg-black/35 z-0" />

                {/* Centered Profile Info: Avatar, Name & Username in Center */}
                <div className="flex flex-col items-center justify-center text-center z-10 mt-1">
                  {/* Avatar Octocat circular */}
                  <div className={`w-[38px] h-[38px] rounded-full border-2 ${isDark ? "border-red-400 bg-zinc-900" : "border-white bg-white"} overflow-hidden flex-shrink-0 flex items-center justify-center shadow`}>
                    <img
                      src={githubStats?.avatarUrl || "https://avatars.githubusercontent.com/u/99318181?v=4"}
                      alt="Nikhil Verma Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-0.5">
                    <h4 className="text-[11px] font-black font-outfit tracking-tight text-white leading-none mb-0.5">
                      {githubStats?.name || "Nikhil Verma"}
                    </h4>
                    <span className="text-[8px] font-bold font-mono text-zinc-300 leading-none">
                      @nickhil-verma
                    </span>
                  </div>
                </div>

                {/* Banner Right: External Link - Absolute positioned on top right */}
                <a
                  href="https://github.com/nickhil-verma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg border transition-all bg-black/40 border-white/10 hover:bg-black/60 text-white shadow-sm"
                  title="View GitHub Profile"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z"/>
                  </svg>
                </a>
              </div>

              {/* Empty spacer for the absolute banner height */}
              <div className="h-[76px] flex-shrink-0" />

              {/* 4 Column Bottom Stats Grid */}
              <div className="grid grid-cols-4 gap-2 items-center flex-1 py-3 px-2 z-10">
                {/* Repo Count Metric */}
                <div className="flex flex-col items-center justify-center text-center">
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                    Repo Count
                  </span>
                  <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {githubStats?.repoCount || 77}
                  </span>
                </div>

                {/* Commits Metric */}
                <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="1.05" y1="12" x2="8" y2="12"/>
                    <line x1="16" y1="12" x2="22.95" y2="12"/>
                  </svg>
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                    Commits
                  </span>
                  <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {githubStats?.commits || "1,480+"}
                  </span>
                </div>

                {/* Lines of Code Metric */}
                <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                    Line of code
                  </span>
                  <span className={`text-xs font-black font-mono mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {githubStats?.loc || "12,400+"}
                  </span>
                </div>

                {/* Languages Metric */}
                <div className="flex flex-col items-center justify-center text-center border-l border-dashed border-zinc-700/20">
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 mb-1.5 ${isDark ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                    Languages
                  </span>
                  <span className={`text-[10px] font-black font-mono mt-1 leading-none ${isDark ? "text-white" : "text-zinc-900"} truncate max-w-full px-1`} title={githubStats?.languages || "JS, TS, Python"}>
                    {githubStats?.languages || "JS/TS/Py"}
                  </span>
                </div>
              </div>
            </SpotlightCard>

            {/* Recent Insights (Mobile) */}
            <SpotlightCard isDark={isDark} className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2.5">
                  <FileText className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <h2 className={`text-xl font-bold font-outfit tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Recent Insights
                  </h2>
                </div>
                <Link
                  href="/blogs"
                  className={`text-xs font-bold transition-all hover:underline flex items-center space-x-1 ${
                    isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                  }`}
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {combinedBlogs.slice(0, 2).map((blog, idx) => (
                  <Link
                    key={idx}
                    href={`/blogs/${blog._id}`}
                    className={`block p-4 rounded-2xl flex flex-col justify-between transition-all group cursor-pointer ${
                      isDark 
                        ? "bg-[#121214]/50 border border-white/5 hover:bg-[#18181b]/50 hover:border-red-500/20" 
                        : "bg-white/60 border border-black/5 hover:bg-white hover:border-red-200 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                        isDark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {blog.category}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleLikeBlog(blog); }}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition-all ${
                          likedBlogIds.includes(blog._id || blog.title)
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : isDark 
                              ? "bg-white/5 text-zinc-500 hover:text-white border-white/5" 
                              : "bg-zinc-100 text-zinc-500 border-zinc-200"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedBlogIds.includes(blog._id || blog.title) ? "fill-current" : ""}`} />
                        <span className="text-[10px] font-bold">{interactions[blog._id || blog.title] !== undefined ? interactions[blog._id || blog.title] : (blog.likes || 0)}</span>
                      </button>
                    </div>
                    <h3 className={`font-bold font-outfit text-sm mb-1 group-hover:text-red-400 transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {blog.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      {blog.excerpt}
                    </p>
                    <span className={`mt-2 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                      isDark ? "text-red-500/60 group-hover:text-red-400" : "text-red-400 group-hover:text-red-600"
                    }`}>
                      Read article <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </SpotlightCard>

          </div>

        </div>

        <footer className={`py-6 text-center text-[10px] tracking-widest uppercase font-mono relative z-10 ${
          isDark ? "text-zinc-600" : "text-zinc-400"
        }`}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Nikhil Verma</span>
            <Link href="/admin" className="hover:text-red-500 transition-colors font-bold">Admin Portal</Link>
          </div>
        </footer>

      </div>

      {/* Floating macOS-inspired Dock */}
      <div
        ref={dockRef}
        onMouseMove={handleDockMouseMove}
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
        className={`fixed bottom-6 top-auto left-1/2 transform -translate-x-1/2 z-50 ${
          isDark
            ? "bg-[#09090b]/80 border-white/5 shadow-2xl shadow-black/80"
            : "bg-white/85 border-black/5 shadow-xl shadow-zinc-200/50"
        } backdrop-blur-xl rounded-[24px] px-3.5 py-2 border flex items-center space-x-1.5 overflow-x-auto lg:overflow-visible max-w-[95vw] hide-scrollbar`}
      >
        {/* Dock Border Spotlight Light Source */}
        {isDockHovered && (
          <div
            className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-300 z-0"
            style={{
              border: isDark ? "1.5px solid rgba(239, 68, 68, 0.5)" : "1.5px solid rgba(220, 38, 38, 0.45)",
              background: `radial-gradient(80px circle at ${dockCoords.x}px ${dockCoords.y}px, ${isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(220, 38, 38, 0.04)"}, transparent 80%)`,
              maskImage: `radial-gradient(80px circle at ${dockCoords.x}px ${dockCoords.y}px, black 30%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(80px circle at ${dockCoords.x}px ${dockCoords.y}px, black 30%, transparent 100%)`,
            }}
          />
        )}

        <button
          onClick={() => handleThemeChange(!isDark)}
          className={`p-2.5 sm:p-3 rounded-xl transition-colors duration-300 flex items-center justify-center relative group z-10`}
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-red-500 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        <div className={`w-px h-6 z-10 ${isDark ? "bg-white/10" : "bg-black/10"}`} />

        <DockItem href="https://github.com/nickhil-verma" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <Github className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="https://linkedin.com/in/nikhil-verma-b9ba861b0" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <Linkedin className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="mailto:vermanick75@gmail.com" isDark={isDark}>
          <Mail className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="https://x.com/0xnickhilverma" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <Twitter className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="https://leetcode.com/u/nickhil_verma/" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <SiLeetcode className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="https://codeforces.com/profile/nickhilverma" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <SiCodeforces className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
        <DockItem href="https://www.youtube.com/watch?v=oXbNl3tMYuc" target="_blank" rel="noopener noreferrer" isDark={isDark}>
          <Youtube className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`} />
        </DockItem>
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