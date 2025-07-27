import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  User,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Award,
  Twitter,
  Youtube,
  GitBranch,
  Star,
  Users,
  Calendar,
} from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true);
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/nickhil-verma"
        );
        const userData = await response.json();

        const reposResponse = await fetch(
          "https://api.github.com/users/nickhil-verma/repos?per_page=100"
        );
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce(
          (acc, repo) => acc + repo.stargazers_count,
          0
        );
        const totalForks = reposData.reduce(
          (acc, repo) => acc + repo.forks_count,
          0
        );

        setGithubStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars,
          totalForks,
          createdAt: new Date(userData.created_at).getFullYear(),
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        // Fallback stats
        setGithubStats({
          publicRepos: 25,
          followers: 12,
          following: 18,
          totalStars: 45,
          totalForks: 8,
          createdAt: 2021,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const dockBtnStyle = `p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
    isDark ? "hover:bg-zinc-700" : "hover:bg-zinc-300"
  }`;

  const projects = [
    {
      title: "Hireonova – AI Job Engine",
      description: "Crawled 200K+ jobs, AI resume matcher with Ollama 3B",
      link: "https://github.com/Hireonova",
      tech: ["Python", "Playwright", "MERN", "NLP"],
    },
    {
      title: "MOSDAC RAG Chatbot – ISRO Hackathon",
      description: "FAISS + Gemma 3B based chatbot for ISRO queries",
      link: "https://github.com/nickhil-verma/MOSDAC_PARENT_REPO/tree/main",
      tech: ["React", "Node.js", "Gemma 3B", "MongoDB"],
    },
    {
      title: "Plant Disease Detection",
      description: "95% accuracy CNN model for 15 leaf diseases",
      link: "https://github.com/nickhil-verma/Plant-disease-detection-model",
      tech: ["TensorFlow", "Keras", "NumPy", "HuggingFace"],
    },
  ];

  const experiences = [
    {
      title: "Full Stack Intern",
      company: "Donald Hans, LA (Remote)",
      period: "Jun 2025 – Present",
      description: [
        "Improved SEO from 71% to 94% using schema, sitemaps.",
        "Built a chatbot MVP with Google Gemini API.",
        "Reduced form latency by 30% using optimized Express.",
        "Set up CI/CD pipelines with GitHub Actions + Vercel.",
      ],
    },
    {
      title: "Software Development Intern",
      company: "Ultra TV Ads, Thailand (Remote)",
      period: "Feb 2025 – Apr 2025",
      description: [
        "Migrated from WordPress to React stack, reduced load time by 40%.",
        "Implemented Twilio re-subscribe alerts via n8n + NodeMailer.",
        "Managed DevOps + RBAC with GitHub Actions and JWT.",
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

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className={`p-6 rounded-2xl ${
        isDark ? "bg-zinc-700/50" : "bg-zinc-200/50"
      } backdrop-blur-sm border ${
        isDark ? "border-zinc-600" : "border-zinc-300"
      } hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
      <p
        className={`text-sm font-medium ${
          isDark ? "text-zinc-300" : "text-zinc-700"
        }`}
      >
        {label}
      </p>
    </div>
  );

  return (
    <div
      className={`min-h-screen p-4 lg:p-6 transition-colors duration-300 ${
        isDark ? "bg-zinc-900 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Mesh Grid Background */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-zinc-900" : "bg-zinc-50"
          }`}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${
                isDark ? "#71717a" : "#a1a1aa"
              } 1px, transparent 1px), linear-gradient(90deg, ${
                isDark ? "#71717a" : "#a1a1aa"
              } 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Floating Dock */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${
          isDark ? "bg-zinc-800/80" : "bg-zinc-200/80"
        } backdrop-blur-md rounded-2xl px-3 py-2 border flex items-center space-x-2 ${
          isDark ? "border-zinc-700" : "border-zinc-300"
        }`}
      >
        <button onClick={toggleTheme} className={dockBtnStyle}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <a
          href="https://github.com/nickhil-verma"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com/in/nikhil-verma-b9ba861b0"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="mailto:vermanick75@gmail.com" className={dockBtnStyle}>
          <Mail className="w-5 h-5" />
        </a>
        <a
          href="https://x.com/0xnickhilverma"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href="https://leetcode.com/u/nickhil_verma/"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <SiLeetcode className="w-5 h-5" />
        </a>
        <a
          href="https://codeforces.com/profile/nickhilverma"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <SiCodeforces className="w-5 h-5" />
        </a>
        <a
          href="https://www.youtube.com/watch?v=oXbNl3tMYuc"
          target="_blank"
          rel="noopener noreferrer"
          className={dockBtnStyle}
        >
          <Youtube className="w-5 h-5" />
        </a>
      </div>

      {/* Main Grid - First Screen */}
      <div className="relative z-10 h-screen overflow-hidden">
        <div className="grid grid-cols-12 grid-rows-8 gap-4 h-full max-w-7xl mx-auto">
          {/* About */}
          <div
            className={`col-span-12 md:col-span-5 row-span-4 p-6 rounded-2xl ${
              isDark ? "bg-zinc-800/50" : "bg-zinc-100/50"
            } backdrop-blur-sm border ${
              isDark ? "border-zinc-700" : "border-zinc-300"
            } flex flex-col justify-center items-center text-center`}
          >
            <div
              className={`w-20 h-20 rounded-full mb-4 ${
                isDark ? "bg-zinc-700" : "bg-zinc-300"
              } flex items-center justify-center`}
            >
              <img
                className="w-20 h-20 rounded-full"
                src="https://i.pinimg.com/736x/00/51/9a/00519ae0e89f8b1252d33ab1eeb337fc.jpg"
                alt="User Avatar"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">Nikhil Verma</h1>
            <p
              className={`text-lg mb-3 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Full Stack Developer
            </p>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Passionate about scalable apps, AI systems, and crafting
              developer-first user experiences.
            </p>
          </div>

          {/* Experience */}
          <div
            className={`col-span-12 md:col-span-7 row-span-4 p-6 rounded-2xl ${
              isDark ? "bg-zinc-800/50" : "bg-zinc-100/50"
            } backdrop-blur-sm border ${
              isDark ? "border-zinc-700" : "border-zinc-300"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-4 overflow-y-auto h-5/6 hide-scrollbar">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-zinc-700/50" : "bg-zinc-200/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.title}</h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        isDark
                          ? "bg-zinc-600 text-zinc-300"
                          : "bg-zinc-300 text-zinc-700"
                      }`}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {exp.description.map((point, idx) => (
                      <li
                        key={idx}
                        className={`${
                          isDark ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div
            className={`col-span-12 md:col-span-8 row-span-4 p-6 rounded-2xl ${
              isDark ? "bg-zinc-800/50" : "bg-zinc-100/50"
            } backdrop-blur-sm border ${
              isDark ? "border-zinc-700" : "border-zinc-300"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto h-5/6 hide-scrollbar">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-zinc-700/50" : "bg-zinc-200/50"
                  } hover:scale-105 transition-all duration-300 flex flex-col`}
                >
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p
                    className={`text-sm mb-3 flex-1 ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDark
                            ? "bg-zinc-600 text-zinc-300"
                            : "bg-zinc-300 text-zinc-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 self-start ${
                      isDark
                        ? "bg-zinc-600 hover:bg-zinc-500"
                        : "bg-zinc-300 hover:bg-zinc-400"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div
            className={`col-span-12 md:col-span-4 row-span-2 p-6 rounded-2xl ${
              isDark ? "bg-zinc-800/50" : "bg-zinc-100/50"
            } backdrop-blur-sm border ${
              isDark ? "border-zinc-700" : "border-zinc-300"
            } flex flex-col justify-center`}
          >
            <h2 className="text-xl font-bold mb-3">Education</h2>
            <div className="text-center">
              <h3 className="font-bold">
                B.Tech in Electronics and Communication
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Dayananda Sagar University, Bengaluru
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${
                  isDark
                    ? "bg-zinc-700 text-zinc-300"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                2023 – 2027
              </span>
            </div>
          </div>

          {/* Achievements */}
          <div
            className={`col-span-12 md:col-span-4 row-span-2 p-6 rounded-2xl ${
              isDark ? "bg-zinc-800/50" : "bg-zinc-100/50"
            } backdrop-blur-sm border ${
              isDark ? "border-zinc-700" : "border-zinc-300"
            }`}
          >
            <h2 className="text-xl font-bold mb-3">Achievements</h2>
            <div className="space-y-2 overflow-y-auto h-4/5 hide-scrollbar">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Award
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Stats Section - Second Screen */}
      {/* <div className="relative z-10 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto">
          <div className={`w-full p-8 rounded-2xl ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-100/50'} backdrop-blur-sm border ${isDark ? 'border-zinc-700' : 'border-zinc-300'}`}>
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Github className="w-8 h-8" />
              <h2 className="text-3xl font-bold">GitHub Statistics</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  icon={GitBranch} 
                  label="Public Repositories" 
                  value={githubStats?.publicRepos || 0} 
                  color="bg-blue-500"
                />
                <StatCard 
                  icon={Star} 
                  label="Total Stars Earned" 
                  value={githubStats?.totalStars || 0} 
                  color="bg-yellow-500"
                />
                <StatCard 
                  icon={Users} 
                  label="Followers" 
                  value={githubStats?.followers || 0} 
                  color="bg-green-500"
                />
                <StatCard 
                  icon={GitBranch} 
                  label="Total Forks" 
                  value={githubStats?.totalForks || 0} 
                  color="bg-purple-500"
                />
                <StatCard 
                  icon={Users} 
                  label="Following" 
                  value={githubStats?.following || 0} 
                  color="bg-indigo-500"
                />
                <StatCard 
                  icon={Calendar} 
                  label="GitHub Since" 
                  value={githubStats?.createdAt || 2021} 
                  color="bg-red-500"
                />
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <a 
                href="https://github.com/nickhil-verma" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-lg transition-all duration-300 hover:scale-105 ${isDark ? 'bg-zinc-600 hover:bg-zinc-500' : 'bg-zinc-300 hover:bg-zinc-400'}`}
              >
                <Github className="w-5 h-5" />
                <span>View GitHub Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
