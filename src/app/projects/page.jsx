"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomToast from "../../components/CustomToast";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Search, Code, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper supporting isDark
const ProjectSpotlightCard = ({ children, isDark, className = "" }) => {
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
      className={`relative overflow-hidden rounded-[24px] ${
        isDark ? "glass-card hover:border-white/10" : "glass-card-light hover:border-black/10"
      } hover:-translate-y-1.5 transition-all duration-300 shadow-xl ${className}`}
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

const baseProjects = [
  {
    title: "Hireonova – AI Job Engine",
    description: "A comprehensive jobs crawling engine and smart resume parser matching algorithm powered by Ollama 3B. Processes massive datasets with precision and ranks candidates contextually.",
    link: "https://github.com/Hireonova",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    tech: ["Python", "Playwright", "MERN", "NLP", "Ollama"],
    category: "ai",
    stars: 12,
    created_at: new Date("2026-05-10"),
  },
  {
    title: "MOSDAC ISRO Chatbot",
    description: "A FAISS and Gemma 3B based RAG chatbot engineered during the ISRO Space Hackathon. Delivers highly contextual responses based on space research datasets and meteorological data.",
    link: "https://github.com/nickhil-verma/MOSDAC_PARENT_REPO/tree/main",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    tech: ["React", "Node.js", "Gemma 3B", "MongoDB", "FAISS"],
    category: "ai",
    stars: 8,
    created_at: new Date("2026-04-20"),
  },
  {
    title: "Eternalan Concerts",
    description: "An interactive and visually stunning concert booking platform customized for cross-border audiences between the US and China. Highly optimized rendering pipeline.",
    link: "https://github.com/nickhil-verma/eternalan",
    deployedUrl: "https://eternalan.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    tech: ["React", "Tailwind CSS", "JavaScript", "REST APIs"],
    category: "web",
    stars: 15,
    created_at: new Date("2026-03-30"),
  },
  {
    title: "Plant Disease Detection",
    description: "Deep Convolutional Neural Network (CNN) model built with TensorFlow and Keras, delivering a 95% classification accuracy across 15 distinct leaf disease types.",
    link: "https://github.com/nickhil-verma/Plant-disease-detection-model",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    tech: ["TensorFlow", "Keras", "NumPy", "HuggingFace", "Python"],
    category: "ai",
    stars: 10,
    created_at: new Date("2026-02-15"),
  },
  {
    title: "CEDAXDSU Club Website",
    description: "The official web portal designed and developed for the IEEE CEDA chapter at Dayananda Sagar University. Incorporates a broadcast notice system and serves over 500+ active members.",
    link: "https://github.com/nickhil-verma/CEDAXDSU",
    deployedUrl: "https://dsuieeeceda.vercel.app/",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    tech: ["React", "Tailwind CSS", "framer-motion", "Node js", "Express"],
    category: "web",
    stars: 20,
    created_at: new Date("2026-01-05"),
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveProjects, setLiveProjects] = useState([]);
  const [starredProjectIds, setStarredProjectIds] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

  // Webpage-wide theme state synchronization
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("starred_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        setStarredProjectIds(parsed);
        // Sync static fallback projects star count in memory on mount
        baseProjects.forEach(p => {
          if (parsed.includes(p.title) && !p.hasStarredIncremented) {
            p.stars = (p.stars || 0) + 1;
            p.hasStarredIncremented = true;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load starred projects:", e);
    }
  }, []);

  const handleToggleStarProject = async (project) => {
    const id = project._id || project.title;
    const isStarred = starredProjectIds.includes(id);
    const action = isStarred ? "unstar" : "star";
    
    // Toggle locally for instant responsive UI feedback
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

    try {
      const fallbackVal = project.stars || 0;
      const res = await fetch(`/api/interactions?id=${encodeURIComponent(id)}&type=star&action=${action}&fallback=${fallbackVal}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setInteractions(prev => ({ ...prev, [id]: data.count }));
        if (project._id) {
          setLiveProjects(prev => prev.map(p => p._id === project._id ? { ...p, stars: data.count } : p));
        }
      }
    } catch (err) {
      console.error("Failed to update stars in database:", err);
    }
  };

  // Fetch live uploaded projects and interactions from MongoDB on mount
  useEffect(() => {
    const fetchProjectsAndInteractions = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch live projects:", err);
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
    fetchProjectsAndInteractions();
  }, []);

  // Merge lists and sort by created_at in descending order (most recent first)
  const combinedProjects = [...liveProjects, ...baseProjects].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredProjects = combinedProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && project.category === activeFilter;
  });

  return (
    <div className={`min-h-screen transition-colors duration-0 noise-overlay relative overflow-hidden p-6 sm:p-10 lg:p-16 ${
      isDark ? "bg-[#050505] text-[#ededed]" : "bg-[#f8f9fa] text-[#1c1c1e]"
    }`}>
      {/* Grid Mesh Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "grid-mesh" : "grid-mesh-light"}`} />
      </div>

      {/* Back to home */}
      <div className="max-w-6xl mx-auto mb-10 z-10 relative">
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

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className={`text-4xl sm:text-5xl font-extrabold font-outfit tracking-tight mb-3 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}>
              Projects Archive
            </h1>
            <p className={`text-sm max-w-md ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              A comprehensive archive of engineering projects spanning artificial intelligence, full-stack web applications, and meteorological chatbots.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`} />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors backdrop-blur-md font-sans ${
                isDark 
                  ? "bg-[#121214]/60 border-white/5 focus:border-white/10 text-white" 
                  : "bg-white/80 border-black/10 focus:border-black/20 text-zinc-900"
              }`}
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2.5 mb-10">
          {["all", "web", "ai"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter 
                  ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                  : isDark 
                    ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                    : "bg-black/5 hover:bg-black/10 text-zinc-600 hover:text-zinc-950 border-black/5"
              }`}
            >
              {filter === "all" ? "All Works" : filter === "web" ? "Web & Systems" : "AI & Data Science"}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectSpotlightCard key={idx} isDark={isDark} className="flex flex-col justify-between overflow-hidden">
              {/* Thumbnail */}
              {(project.imageUrl || project.thumbnailUrl) && (
                <div className="w-full h-48 overflow-hidden relative flex-shrink-0">
                  <img
                    src={project.imageUrl || project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-transparent to-black/80" : "from-transparent to-black/50"}`} />
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    project.category === "ai" 
                      ? "bg-violet-500/80 text-white" 
                      : "bg-red-500/80 text-white"
                  }`}>
                    {project.category === "ai" ? "AI & Data" : "Web"}
                  </span>
                </div>
              )}

              <div className="p-7 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      {!(project.imageUrl || project.thumbnailUrl) && (
                        <><Code className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-red-400" : "text-red-600"}`}>{project.category}</span></>
                      )}
                    </div>

                    {/* Star count */}
                    <button
                      onClick={() => handleToggleStarProject(project)}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition-all ${
                        starredProjectIds.includes(project._id || project.title)
                          ? "bg-[#ef4444]/10 text-red-400 border-red-500/30"
                          : isDark ? "bg-white/5 text-zinc-500 hover:text-white border-white/5" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${starredProjectIds.includes(project._id || project.title) ? "fill-current" : ""}`} />
                      <span className="text-xs font-bold font-outfit">{interactions[project._id || project.title] !== undefined ? interactions[project._id || project.title] : (project.stars || 0)}</span>
                    </button>
                  </div>

                  <h3 className={`text-xl font-bold font-outfit mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>{project.title}</h3>
                  <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{project.description}</p>
                </div>

                <div>
                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((tech, tIdx) => (
                      <span key={tIdx} className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        isDark ? "bg-white/5 text-zinc-400 border-white/5" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}>{tech}</span>
                    ))}
                  </div>

                  {/* CTA Links */}
                  <div className="flex items-center space-x-3">
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20">
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {(project.deployedUrl || project.liveLink || project.deployedLink) && (
                      <a href={project.deployedUrl || project.liveLink || project.deployedLink} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                          isDark ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                        }`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                    <a href="https://github.com/nickhil-verma" target="_blank" rel="noopener noreferrer"
                      className={`flex items-center justify-center p-2 border rounded-xl transition-all ${
                        isDark ? "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                      }`}>
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </ProjectSpotlightCard>
          ))}
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
