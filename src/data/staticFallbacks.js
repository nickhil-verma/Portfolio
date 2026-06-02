export const fallbackBlogs = [
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

export const staticFallbackProjects = [
  {
    title: "Hireonova – AI Job Engine",
    description: "Crawled 200K+ jobs, AI resume matcher with Ollama 3B",
    link: "https://github.com/Hireonova",
    deployedLink: null,
    tech: ["React", "Python", "Docker", "Ollama"],
    stars: 14
  },
  {
    title: "DocuQuery AI RAG Engine",
    description: "FAISS + Gemini based PDF analyzer with precise citations",
    link: "https://github.com/nickhil-verma/DocuQuery-AI-PDF-RAG",
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

export const experiences = [
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

export const achievements = [
  "Grand Finalist – SIH 2024 (Top 5/500 nationally)",
  "IEEE AVINYA Hackathon Winner",
  "Built a 500+ user university club site with broadcast system",
  "Global Rank 1097/35K – LeetCode Weekly Contest 408",
  "1700+ LeetCode rating, 600+ problems solved",
];

export const skillset = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "C++", "HTML/CSS"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Redux"] },
  { category: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"] },
  { category: "AI & ML", items: ["TensorFlow", "Keras", "NLP", "Ollama", "FAISS", "Gemini API"] },
  { category: "Tools", items: ["Git", "GitHub Actions", "Vercel", "Docker", "Playwright"] }
];
