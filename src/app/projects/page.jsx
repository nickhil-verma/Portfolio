"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Search, Code, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom Spotlight wrapper
const ProjectSpotlightCard = ({ children, className = "" }) => {
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
      className={`relative overflow-hidden rounded-[24px] glass-card hover:border-white/10 hover:-translate-y-1.5 transition-all duration-500 shadow-xl ${className}`}
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

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveProjects, setLiveProjects] = useState([]);
  const [starredProjectIds, setStarredProjectIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("starred_projects");
      if (stored) {
        setStarredProjectIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load starred projects:", e);
    }
  }, []);

  const handleToggleStarProject = async (project) => {
    const isStarred = starredProjectIds.includes(project._id || project.title);
    const action = isStarred ? "unstar" : "star";
    
    // Toggle locally for instant responsive UI feedback
    let nextStarred;
    if (isStarred) {
      nextStarred = starredProjectIds.filter(id => id !== (project._id || project.title));
      project.stars = Math.max(0, (project.stars || 0) - 1);
    } else {
      nextStarred = [...starredProjectIds, project._id || project.title];
      project.stars = (project.stars || 0) + 1;
    }
    setStarredProjectIds(nextStarred);
    localStorage.setItem("starred_projects", JSON.stringify(nextStarred));

    // If it is a database project, trigger API update
    if (project._id) {
      try {
        const res = await fetch(`/api/projects?id=${project._id}&action=${action}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (data.success) {
          setLiveProjects(prev => prev.map(p => {
            if (p._id === project._id) {
              return { ...p, stars: data.stars };
            }
            return p;
          }));
        }
      } catch (err) {
        console.error("Failed to update stars in database:", err);
      }
    }
  };

  // Local base projects with descending timestamps
  const baseProjects = [
    {
      title: "Hireonova – AI Job Engine",
      description: "A comprehensive jobs crawling engine and smart resume parser matching algorithm powered by Ollama 3B. Processes massive datasets with precision and ranks candidates contextually.",
      link: "https://github.com/Hireonova",
      tech: ["Python", "Playwright", "MERN", "NLP", "Ollama"],
      category: "ai",
      stars: 12,
      created_at: new Date("2026-05-10"),
    },
    {
      title: "MOSDAC ISRO Chatbot",
      description: "A FAISS and Gemma 3B based RAG chatbot engineered during the ISRO Space Hackathon. Delivers highly contextual responses based on space research datasets and meteorological data.",
      link: "https://github.com/nickhil-verma/MOSDAC_PARENT_REPO/tree/main",
      tech: ["React", "Node.js", "Gemma 3B", "MongoDB", "FAISS"],
      category: "ai",
      stars: 8,
      created_at: new Date("2026-04-20"),
    },
    {
      title: "Eternalan Concerts",
      description: "An interactive and visually stunning concert booking platform customized for cross-border audiences between the US and China. Highly optimized rendering pipeline.",
      link: "https://github.com/nickhil-verma/eternalan",
      tech: ["React", "Tailwind CSS", "JavaScript", "REST APIs"],
      category: "web",
      stars: 15,
      created_at: new Date("2026-03-30"),
    },
    {
      title: "Plant Disease Detection",
      description: "Deep Convolutional Neural Network (CNN) model built with TensorFlow and Keras, delivering a 95% classification accuracy across 15 distinct leaf disease types.",
      link: "https://github.com/nickhil-verma/Plant-disease-detection-model",
      tech: ["TensorFlow", "Keras", "NumPy", "HuggingFace", "Python"],
      category: "ai",
      stars: 10,
      created_at: new Date("2026-02-15"),
    },
    {
      title: "CEDAXDSU Club Website",
      description: "The official web portal designed and developed for the IEEE CEDA chapter at Dayananda Sagar University. Incorporates a broadcast notice system and serves over 500+ active members.",
      link: "https://dsuieeeceda.vercel.app/",
      tech: ["React", "Tailwind CSS", "framer-motion", "Node js", "Express"],
      category: "web",
      stars: 20,
      created_at: new Date("2026-01-05"),
    },
  ];

  // Fetch live uploaded projects from MongoDB on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch live projects:", err);
      }
    };
    fetchProjects();
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
    <div className="min-h-screen bg-[#050505] text-[#ededed] noise-overlay relative overflow-hidden p-6 sm:p-10 lg:p-16">
      <div className="absolute inset-0 z-0 grid-mesh pointer-events-none" />

      {/* Back to home */}
      <div className="max-w-6xl mx-auto mb-10 z-10 relative">
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

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit tracking-tight mb-3">
              Projects Archive
            </h1>
            <p className="text-sm text-zinc-400 max-w-md">
              A comprehensive archive of engineering projects spanning artificial intelligence, full-stack web applications, and meteorological chatbots.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors backdrop-blur-md text-white font-sans"
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
                  : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {filter === "all" ? "All Works" : filter === "web" ? "Web & Systems" : "AI & Data Science"}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectSpotlightCard key={idx} className="p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-red-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{project.category}</span>
                  </div>
                  
                  {/* Star count */}
                  <button
                    onClick={() => handleToggleStarProject(project)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border transition-all ${
                      starredProjectIds.includes(project._id || project.title)
                        ? "bg-[#ef4444]/10 text-red-400 border-red-500/30"
                        : "bg-white/5 text-zinc-500 hover:text-white border-white/5"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${starredProjectIds.includes(project._id || project.title) ? "fill-current" : ""}`} />
                    <span className="text-xs font-bold font-outfit">{project.stars || 0}</span>
                  </button>
                </div>

                <h3 className="text-xl font-bold font-outfit text-white mb-2">{project.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400 mb-6">{project.description}</p>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((tech, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 text-zinc-400 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA Links */}
                <div className="flex items-center space-x-3">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {project.deployedUrl && (
                    <a
                      href={project.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 rounded-xl transition-all"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>
                  )}
                  <a
                    href="https://github.com/nickhil-verma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 rounded-xl transition-all"
                  >
                    <Github className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </ProjectSpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
}
