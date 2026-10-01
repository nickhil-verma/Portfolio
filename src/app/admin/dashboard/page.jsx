"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Globe,
  Heart,
  MessageSquare,
  Cpu,
  FolderKanban,
  BookHeart,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Pin,
  ChevronLeft,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Github,
  Calendar,
  MapPin,
  Image as ImageIcon,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Helmet from "../../../components/Helmet";
import CustomToast from "../../../components/CustomToast";
import { AdminShell } from "../../../components/admin/AdminShell";
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Badge,
  Card,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tabs,
  Drawer,
  Dialog,
  EmptyState,
  Skeleton,
} from "../../../components/admin/ui";
import { Sparkline } from "../../../components/admin/ui/Sparkline";

// Dynamically load heavy markdown preview chunk on demand
const CustomMarkdown = dynamic(
  () => import("../../../components/admin/CustomMarkdown"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full rounded-lg" />,
  }
);

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth & Navigation States
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success", key: 0 });

  // Data Collections States
  const [dashboardProjects, setDashboardProjects] = useState([]);
  const [dashboardBlogs, setDashboardBlogs] = useState([]);
  const [dashboardExperiences, setDashboardExperiences] = useState([]);
  const [dashboardComments, setDashboardComments] = useState([]);
  const [analytics, setAnalytics] = useState({ logs: [] });
  const [blogAnalytics, setBlogAnalytics] = useState({ logs: [] });

  // Filter & Search States
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState("30d");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [projSearchQuery, setProjSearchQuery] = useState("");
  const [expSearchQuery, setExpSearchQuery] = useState("");
  const [commentSearchQuery, setCommentSearchQuery] = useState("");
  const [selectedBlogAnalyticsFilter, setSelectedBlogAnalyticsFilter] = useState("all");

  // Dialog & Drawer States
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, title: "", id: null, type: "" });

  // Form States - Experience
  const [expDrawerOpen, setExpDrawerOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expLogoUrl, setExpLogoUrl] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expIsPresent, setExpIsPresent] = useState(false);
  const [expLocation, setExpLocation] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expOrder, setExpOrder] = useState(1);

  // Form States - Project
  const [projDrawerOpen, setProjDrawerOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjTech, setNewProjTech] = useState("");
  const [newProjGithub, setNewProjGithub] = useState("");
  const [newProjDeployed, setNewProjDeployed] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjCat, setNewProjCat] = useState("web");
  const [newProjImageUrl, setNewProjImageUrl] = useState("");
  const [newProjPinned, setNewProjPinned] = useState(false);
  const [newProjDate, setNewProjDate] = useState("");

  // Form States - Blog
  const [blogDrawerOpen, setBlogDrawerOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogImage, setNewBlogImage] = useState("");
  const [newBlogBanner, setNewBlogBanner] = useState("");
  const [newBlogCat, setNewBlogCat] = useState("Tech");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [debouncedBlogContent, setDebouncedBlogContent] = useState("");

  // Debounce blog markdown preview updates (200ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBlogContent(newBlogContent);
    }, 200);
    return () => clearTimeout(handler);
  }, [newBlogContent]);

  // Auth Verification
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLogged = localStorage.getItem("admin_logged_in") === "true";
      if (!isLogged) {
        router.push("/admin");
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  // Trigger Toast helper
  const triggerToast = (message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  };

  // Fetch telemetry & dynamic collections
  const fetchData = async () => {
    try {
      // Projects
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (Array.isArray(projData)) setDashboardProjects(projData);

      // Blogs
      const blogRes = await fetch("/api/blogs");
      const blogData = await blogRes.json();
      if (Array.isArray(blogData)) setDashboardBlogs(blogData);

      // Experiences
      try {
        const expRes = await fetch("/api/experiences");
        const expData = await expRes.json();
        if (Array.isArray(expData)) setDashboardExperiences(expData);
      } catch (e) {
        console.error("Failed loading experiences:", e);
      }

      // Visitor Reflections
      try {
        const commentsRes = await fetch("/api/blogs/comments");
        const commentsData = await commentsRes.json();
        if (Array.isArray(commentsData)) setDashboardComments(commentsData);
      } catch (e) {
        console.error("Failed loading reflections:", e);
      }

      // Site Traffic Analytics
      try {
        const analyticsRes = await fetch("/api/analytics");
        const analyticsData = await analyticsRes.json();
        if (analyticsData && !analyticsData.error) setAnalytics(analyticsData);
      } catch (e) {
        console.error("Failed loading analytics:", e);
      }

      // Blog Analytics
      try {
        const blogAnalyticsRes = await fetch("/api/blogs/analytics");
        const blogAnalyticsData = await blogAnalyticsRes.json();
        if (blogAnalyticsData && !blogAnalyticsData.error) setBlogAnalytics(blogAnalyticsData);
      } catch (e) {
        console.error("Failed loading blog analytics:", e);
      }
    } catch (err) {
      console.error("Failed fetching active data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authorized) return;
    fetchData();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [authorized]);

  // --- EXPERIENCE HANDLERS ---
  const handleLogoFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("Logo file size exceeds 2MB limit", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setExpLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!expTitle.trim() || !expCompany.trim()) {
      triggerToast("Job Title and Company Name are required fields", "warn");
      return;
    }

    try {
      const url = "/api/experiences";
      const method = editingExpId ? "PUT" : "POST";
      const payload = {
        title: expTitle,
        company: expCompany,
        logoUrl: expLogoUrl,
        startDate: expStartDate,
        endDate: expIsPresent ? "Present" : expEndDate,
        isPresent: expIsPresent,
        location: expLocation,
        description: expDescription,
        order: parseInt(expOrder, 10) || 1,
      };
      if (editingExpId) payload.id = editingExpId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(editingExpId ? "Experience updated successfully" : "Experience added successfully", "success");
        cancelEditExperience();
        fetchData();
      } else {
        triggerToast(data.error || "Failed submitting experience data", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting experience payload", "error");
    }
  };

  const startEditExperience = (exp) => {
    setEditingExpId(exp._id);
    setExpTitle(exp.title || "");
    setExpCompany(exp.company || "");
    setExpLogoUrl(exp.logoUrl || "");
    setExpStartDate(exp.startDate || "");
    setExpEndDate(exp.endDate === "Present" ? "" : exp.endDate || "");
    setExpIsPresent(Boolean(exp.isPresent || exp.endDate === "Present"));
    setExpLocation(exp.location || "");
    setExpDescription(Array.isArray(exp.description) ? exp.description.join("\n") : exp.description || "");
    setExpOrder(exp.order !== undefined ? exp.order : 1);
    setExpDrawerOpen(true);
  };

  const cancelEditExperience = () => {
    setEditingExpId(null);
    setExpTitle("");
    setExpCompany("");
    setExpLogoUrl("");
    setExpStartDate("");
    setExpEndDate("");
    setExpIsPresent(false);
    setExpLocation("");
    setExpDescription("");
    setExpOrder(1);
    setExpDrawerOpen(false);
  };

  const handleDeleteExperience = async (id) => {
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        triggerToast("Experience deleted", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete experience", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting experience", "error");
    }
  };

  const handleMoveExperience = async (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === dashboardExperiences.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newList = [...dashboardExperiences];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    const reorderedItems = newList.map((item, i) => ({
      id: item._id,
      order: i + 1,
    }));

    setDashboardExperiences(newList.map((item, i) => ({ ...item, order: i + 1 })));

    try {
      const res = await fetch("/api/experiences?action=reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedItems),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Priority order updated", "success");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error reordering experiences", "error");
    }
  };

  // --- PROJECT HANDLERS ---
  const handleTogglePinProject = async (id) => {
    try {
      const res = await fetch(`/api/projects?id=${id}&action=togglePin`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.pinned ? "Project pinned to top" : "Project unpinned", "success");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error updating pin status", "error");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjTech.trim() || !newProjGithub.trim()) {
      triggerToast("Title, Tech Stack, and GitHub link are required", "warn");
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
        pinned: newProjPinned,
        date: newProjDate,
      };
      if (editingProjectId) payload.id = editingProjectId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(editingProjectId ? "Project updated" : "Project uploaded", "success");
        cancelEditProject();
        fetchData();
      } else {
        triggerToast(data.error || "Failed to submit project", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting project", "error");
    }
  };

  const startEditProject = (p) => {
    setEditingProjectId(p._id);
    setNewProjTitle(p.title || "");
    setNewProjTech(Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "");
    setNewProjGithub(p.link || p.githubUrl || "");
    setNewProjDeployed(p.deployedUrl || p.deployedLink || "");
    setNewProjDesc(p.description || "");
    setNewProjCat(p.category || "web");
    setNewProjImageUrl(p.imageUrl || "");
    setNewProjPinned(Boolean(p.pinned));
    setNewProjDate(p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "");
    setProjDrawerOpen(true);
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setNewProjTitle("");
    setNewProjTech("");
    setNewProjGithub("");
    setNewProjDeployed("");
    setNewProjDesc("");
    setNewProjCat("web");
    setNewProjImageUrl("");
    setNewProjPinned(false);
    setNewProjDate("");
    setProjDrawerOpen(false);
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        triggerToast("Project deleted", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete project", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting project", "error");
    }
  };

  // --- BLOG HANDLERS ---
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      triggerToast("Blog title and content are required", "warn");
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
      if (editingBlogId) payload.id = editingBlogId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(editingBlogId ? "Blog updated" : "Blog published", "success");
        cancelEditBlog();
        fetchData();
      } else {
        triggerToast(data.error || "Failed to save blog", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error submitting blog", "error");
    }
  };

  const startEditBlog = (b) => {
    setEditingBlogId(b._id);
    setNewBlogTitle(b.title || "");
    setNewBlogExcerpt(b.excerpt || "");
    setNewBlogImage(b.imageUrl || "");
    setNewBlogBanner(b.bannerUrl || "");
    setNewBlogCat(b.category || "Tech");
    setNewBlogContent(b.content || "");
    setBlogDrawerOpen(true);
  };

  const cancelEditBlog = () => {
    setEditingBlogId(null);
    setNewBlogTitle("");
    setNewBlogExcerpt("");
    setNewBlogImage("");
    setNewBlogBanner("");
    setNewBlogCat("Tech");
    setNewBlogContent("");
    setBlogDrawerOpen(false);
  };

  const handleDeleteBlog = async (id) => {
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        triggerToast("Blog deleted", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete blog", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting blog", "error");
    }
  };

  // --- REFLECTION / COMMENT HANDLERS ---
  const handleDeleteComment = async (id) => {
    try {
      const res = await fetch(`/api/blogs/comments?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        triggerToast("Reflection deleted", "success");
        fetchData();
      } else {
        triggerToast(data.error || "Failed to delete reflection", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting reflection", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin");
  };

  // Analytics Computation
  const overviewStats = useMemo(() => {
    const logs = analytics.logs || [];
    const totalViews = logs.length;
    const uniqueIps = new Set(logs.map((l) => l.ip || "unknown")).size;
    return {
      views: totalViews,
      visitors: uniqueIps,
      projects: dashboardProjects.length,
      blogs: dashboardBlogs.length,
    };
  }, [analytics, dashboardProjects, dashboardBlogs]);

  // Top Locations computation
  const topLocations = useMemo(() => {
    const logs = analytics.logs || [];
    const counts = {};
    logs.forEach((log) => {
      const loc = log.location || "Unknown Location";
      counts[loc] = (counts[loc] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const max = sorted.length > 0 ? sorted[0][1] : 1;
    return sorted.map(([loc, val]) => ({
      location: loc,
      count: val,
      percentage: Math.round((val / max) * 100),
    }));
  }, [analytics]);

  // Blog analytics computation
  const blogMetricsTable = useMemo(() => {
    const logs = blogAnalytics.logs || [];
    const metricsMap = {};

    dashboardBlogs.forEach((b) => {
      metricsMap[b._id] = {
        id: b._id,
        title: b.title,
        category: b.category,
        views: 0,
        likes: b.likes || 0,
        comments: 0,
      };
    });

    logs.forEach((log) => {
      if (log.blogId && metricsMap[log.blogId]) {
        if (log.action === "view") metricsMap[log.blogId].views += 1;
        if (log.action === "like") metricsMap[log.blogId].likes += 1;
        if (log.action === "reflection") metricsMap[log.blogId].comments += 1;
      }
    });

    let list = Object.values(metricsMap);
    if (blogSearchQuery.trim()) {
      const q = blogSearchQuery.toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }
    return list;
  }, [dashboardBlogs, blogAnalytics, blogSearchQuery]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 flex items-center justify-center p-6 font-sans">
        <Helmet title="Verifying Session... | Nikhil Console" />
        <div className="text-center space-y-3">
          <Skeleton className="w-10 h-10 rounded-lg mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      unreadCount={dashboardComments.length}
      unreadComments={dashboardComments}
      onLogout={handleLogout}
    >
      <Helmet title="Admin Dashboard | Nikhil Console" />

      {/* OVERVIEW & ANALYTICS TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top 4 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Page Views"
              value={overviewStats.views}
              delta="+12%"
              icon={Globe}
              sparkline={<Sparkline data={[12, 18, 14, 22, 28, 25, 34, 40]} color="#EF4444" />}
            />
            <StatCard
              label="Unique Visitors"
              value={overviewStats.visitors}
              delta="+8%"
              icon={Globe}
              sparkline={<Sparkline data={[8, 12, 10, 15, 20, 18, 24, 29]} color="#3B82F6" />}
            />
            <StatCard
              label="Live Projects"
              value={overviewStats.projects}
              icon={FolderKanban}
            />
            <StatCard
              label="Markdown Articles"
              value={overviewStats.blogs}
              icon={BookHeart}
            />
          </div>

          {/* Traffic Overview & Top Locations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                    Traffic Trends
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Recorded visitor views over selected time horizon
                  </p>
                </div>
                <Tabs
                  tabs={[
                    { id: "7d", label: "7d" },
                    { id: "30d", label: "30d" },
                    { id: "90d", label: "90d" },
                  ]}
                  activeTab={analyticsTimeRange}
                  onChange={setAnalyticsTimeRange}
                />
              </div>

              {analytics.logs && analytics.logs.length > 0 ? (
                <div className="h-48 w-full pt-4">
                  <Sparkline
                    data={
                      analytics.logs.length > 5
                        ? analytics.logs.slice(-15).map((l, idx) => (idx + 1) * 3 + (l.ip ? l.ip.length % 5 : 2))
                        : [5, 12, 8, 20, 24, 18, 30]
                    }
                    color="#EF4444"
                    height={160}
                  />
                </div>
              ) : (
                <EmptyState
                  icon={Globe}
                  title="No traffic recorded yet"
                  description="Visitor telemetry logs will display dynamic trendlines here once visitors explore your portfolio."
                />
              )}
            </Card>

            {/* Ranked Top Locations */}
            <Card className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                  Top Visitor Locations
                </h3>
                <p className="text-[11px] text-zinc-500">Geolocated reader locations</p>
              </div>

              {topLocations.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title="No location data"
                  description="Geocoded visitor locations will appear as visits occur."
                />
              ) : (
                <div className="space-y-3 pt-1">
                  {topLocations.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-zinc-200 truncate">{loc.location}</span>
                        <span className="font-mono text-zinc-400">{loc.count} visits</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-300"
                          style={{ width: `${loc.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* BLOG ANALYTICS APP TAB */}
      {activeTab === "blog-analytics" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Article Performance Table</h3>
              <p className="text-[11px] text-zinc-500">View count, reader likes, reflections, and engagement</p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search articles..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Reflections</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogMetricsTable.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    No articles found matching search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                blogMetricsTable.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-zinc-100 max-w-xs truncate">
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{item.views}</TableCell>
                    <TableCell className="font-mono text-rose-400">{item.likes}</TableCell>
                    <TableCell className="font-mono text-amber-400">{item.comments}</TableCell>
                    <TableCell>
                      <div className="w-16 h-5">
                        <Sparkline data={[item.views, item.likes + 2, item.comments + 4, item.views + 5]} color="#EF4444" height={20} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* WORK EXPERIENCES TAB */}
      {activeTab === "experiences" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Work Experiences</h3>
              <p className="text-[11px] text-zinc-500">Manage roles, order priority, logos, and descriptions</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                cancelEditExperience();
                setExpDrawerOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </Button>
          </div>

          {dashboardExperiences.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No work experiences"
              description="Click Add Experience to create your first work history entry."
              action={
                <Button size="sm" onClick={() => setExpDrawerOpen(true)}>
                  Add Experience
                </Button>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {dashboardExperiences.map((exp, idx) => (
                <div
                  key={exp._id || idx}
                  className="flex items-center justify-between p-3.5 bg-[#141417] border border-white/[0.08] rounded-lg transition-colors hover:border-white/[0.12]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Priority & Move Up/Down Controls */}
                    <div className="flex items-center space-x-1 pr-2 border-r border-white/[0.08]">
                      <Badge variant="brand" className="font-mono text-[9px]">
                        #{exp.order !== undefined ? exp.order : idx + 1}
                      </Badge>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveExperience(idx, "up")}
                          disabled={idx === 0}
                          className="p-0.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ChevronLeft className="w-3 h-3 rotate-90" />
                        </button>
                        <button
                          onClick={() => handleMoveExperience(idx, "down")}
                          disabled={idx === dashboardExperiences.length - 1}
                          className="p-0.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronLeft className="w-3 h-3 -rotate-90" />
                        </button>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      {exp.logoUrl ? (
                        <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-semibold text-zinc-100 truncate">{exp.title}</h4>
                        {exp.isPresent && <Badge variant="success">Present</Badge>}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <IconButton title="Edit Experience" onClick={() => startEditExperience(exp)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton
                      title="Delete Experience"
                      variant="danger"
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          title: exp.title,
                          id: exp._id,
                          type: "experience",
                        })
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* MANAGE PROJECTS TAB */}
      {activeTab === "projects" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Manage Projects</h3>
              <p className="text-[11px] text-zinc-500">Configure codebase links, tech tags, and pinned items</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                cancelEditProject();
                setProjDrawerOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Project</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Pinned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                    No dynamic projects uploaded yet.
                  </TableCell>
                </TableRow>
              ) : (
                dashboardProjects.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-semibold text-zinc-100">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">{p.category || "web"}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleTogglePinProject(p._id)}
                        className={`p-1 rounded transition-colors ${
                          p.pinned ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        title={p.pinned ? "Unpin Project" : "Pin Project"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex space-x-1">
                        <IconButton title="Edit Project" onClick={() => startEditProject(p)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </IconButton>
                        <IconButton
                          title="Delete Project"
                          variant="danger"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              title: p.title,
                              id: p._id,
                              type: "project",
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* MARKDOWN BLOGS TAB */}
      {activeTab === "blogs" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Markdown Blogs</h3>
              <p className="text-[11px] text-zinc-500">Publish and edit technical articles with live preview</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                cancelEditBlog();
                setBlogDrawerOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Blog</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                    No blog posts published yet.
                  </TableCell>
                </TableRow>
              ) : (
                dashboardBlogs.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="font-semibold text-zinc-100 max-w-sm truncate">{b.title}</TableCell>
                    <TableCell>
                      <Badge variant="brand">{b.category || "Tech"}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-rose-400">{b.likes || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex space-x-1">
                        <IconButton title="Edit Blog" onClick={() => startEditBlog(b)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </IconButton>
                        <IconButton
                          title="Delete Blog"
                          variant="danger"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              title: b.title,
                              id: b._id,
                              type: "blog",
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* VISITOR REFLECTIONS TAB */}
      {activeTab === "comments" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Visitor Reflections</h3>
              <p className="text-[11px] text-zinc-500">Review anonymous notes and feedback submitted by portfolio visitors</p>
            </div>
            <Badge variant={dashboardComments.length > 0 ? "brand" : "neutral"}>
              {dashboardComments.length} Total Reflections
            </Badge>
          </div>

          {dashboardComments.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No visitor reflections"
              description="Submitted notes from visitors will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor / Scope</TableHead>
                  <TableHead>Reflection Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardComments.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium text-zinc-200">
                      {c.name || "Anonymous Visitor"}
                    </TableCell>
                    <TableCell className="max-w-md text-zinc-300 truncate">
                      "{c.message}"
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-zinc-500">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "Recent"}
                    </TableCell>
                    <TableCell className="text-right">
                      <IconButton
                        title="Delete Reflection"
                        variant="danger"
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Reflection by ${c.name || "Anonymous"}`,
                            id: c._id,
                            type: "comment",
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* EXPERIENCE EDIT/CREATE DRAWER */}
      <Drawer
        isOpen={expDrawerOpen}
        onClose={cancelEditExperience}
        title={editingExpId ? "Edit Work Experience" : "New Work Experience"}
        description="Configure role title, company details, logo, dates, and order priority"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={cancelEditExperience}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddExperience}>
              {editingExpId ? "Save Changes" : "Create Experience"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddExperience} className="space-y-4">
          <Input
            label="Job Title *"
            required
            placeholder="e.g. Full Stack Intern"
            value={expTitle}
            onChange={(e) => setExpTitle(e.target.value)}
          />

          <Input
            label="Company Name *"
            required
            placeholder="e.g. Donald Hans"
            value={expCompany}
            onChange={(e) => setExpCompany(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-400">Company Logo URL / File</label>
            <div className="flex gap-2.5 items-center">
              <Input
                placeholder="https://company.com/logo.png"
                value={expLogoUrl}
                onChange={(e) => setExpLogoUrl(e.target.value)}
              />
              <label className="inline-flex items-center px-3 py-2 bg-[#1A1A1E] border border-white/[0.08] rounded-lg text-xs font-medium text-zinc-300 hover:bg-[#222226] cursor-pointer flex-shrink-0">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload
                <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Period"
              placeholder="e.g. Jun 2025"
              value={expStartDate}
              onChange={(e) => setExpStartDate(e.target.value)}
            />
            <Input
              label="End Period"
              disabled={expIsPresent}
              placeholder={expIsPresent ? "Present" : "e.g. Sept 2025"}
              value={expIsPresent ? "Present" : expEndDate}
              onChange={(e) => setExpEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="presentCheck"
              checked={expIsPresent}
              onChange={(e) => {
                setExpIsPresent(e.target.checked);
                if (e.target.checked) setExpEndDate("Present");
              }}
              className="w-4 h-4 rounded border-white/[0.08] bg-[#141417] text-red-600 focus:ring-red-500/40"
            />
            <label htmlFor="presentCheck" className="text-xs text-zinc-300 cursor-pointer">
              Currently working here / Present role
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Location / Region"
              placeholder="e.g. Los Angeles, CA"
              value={expLocation}
              onChange={(e) => setExpLocation(e.target.value)}
            />
            <Input
              label="Priority Order (1 = Top)"
              type="number"
              min="1"
              value={expOrder}
              onChange={(e) => setExpOrder(e.target.value)}
            />
          </div>

          <Textarea
            label="Bullet Point Responsibilities (One per line)"
            rows={5}
            placeholder="Engineered high-fidelity chatbot MVP...\nOptimized runtime middleware..."
            value={expDescription}
            onChange={(e) => setExpDescription(e.target.value)}
          />
        </form>
      </Drawer>

      {/* PROJECT EDIT/CREATE DRAWER */}
      <Drawer
        isOpen={projDrawerOpen}
        onClose={cancelEditProject}
        title={editingProjectId ? "Edit Project" : "New Project"}
        description="Configure GitHub repository, tech stack tags, and status"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={cancelEditProject}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddProject}>
              {editingProjectId ? "Save Changes" : "Publish Project"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input
            label="Project Title *"
            required
            placeholder="e.g. HireNova Job Scraper"
            value={newProjTitle}
            onChange={(e) => setNewProjTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tech Stack (Comma Separated) *"
              required
              placeholder="React, Python, Tailwind"
              value={newProjTech}
              onChange={(e) => setNewProjTech(e.target.value)}
            />
            <Select
              label="Category"
              value={newProjCat}
              onChange={(e) => setNewProjCat(e.target.value)}
              options={[
                { label: "Web & Systems", value: "web" },
                { label: "AI & NLP", value: "ai" },
              ]}
            />
          </div>

          <Input
            label="GitHub Repository URL *"
            type="url"
            required
            placeholder="https://github.com/..."
            value={newProjGithub}
            onChange={(e) => setNewProjGithub(e.target.value)}
          />

          <Input
            label="Deployed Demo URL"
            type="url"
            placeholder="https://..."
            value={newProjDeployed}
            onChange={(e) => setNewProjDeployed(e.target.value)}
          />

          <Input
            label="Thumbnail Image URL"
            type="url"
            placeholder="https://..."
            value={newProjImageUrl}
            onChange={(e) => setNewProjImageUrl(e.target.value)}
          />

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="pinCheck"
              checked={newProjPinned}
              onChange={(e) => setNewProjPinned(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.08] bg-[#141417] text-red-600 focus:ring-red-500/40"
            />
            <label htmlFor="pinCheck" className="text-xs text-zinc-300 cursor-pointer flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-amber-400 fill-current" /> Pin project to top of portfolio
            </label>
          </div>

          <Textarea
            label="Short Description"
            rows={4}
            placeholder="Automated job application browser extension powered by Playwright and AI..."
            value={newProjDesc}
            onChange={(e) => setNewProjDesc(e.target.value)}
          />
        </form>
      </Drawer>

      {/* BLOG EDIT/CREATE DRAWER */}
      <Drawer
        isOpen={blogDrawerOpen}
        onClose={cancelEditBlog}
        title={editingBlogId ? "Edit Markdown Blog" : "New Markdown Blog"}
        description="Write and compile markdown articles with live split preview"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={cancelEditBlog}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddBlog}>
              {editingBlogId ? "Save Changes" : "Publish Article"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddBlog} className="space-y-4">
          <Input
            label="Article Title *"
            required
            placeholder="e.g. Building Scalable AI Search Engines"
            value={newBlogTitle}
            onChange={(e) => setNewBlogTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Category Tag"
              placeholder="e.g. AI & Search"
              value={newBlogCat}
              onChange={(e) => setNewBlogCat(e.target.value)}
            />
            <Input
              label="Thumbnail Image URL"
              type="url"
              placeholder="https://..."
              value={newBlogImage}
              onChange={(e) => setNewBlogImage(e.target.value)}
            />
          </div>

          <Input
            label="Short Excerpt Summary"
            placeholder="An in-depth exploration of vector databases..."
            value={newBlogExcerpt}
            onChange={(e) => setNewBlogExcerpt(e.target.value)}
          />

          <Textarea
            label="Article Content (Markdown Supported) *"
            required
            rows={8}
            placeholder="# Article Header\n\nWrite in Markdown format..."
            value={newBlogContent}
            onChange={(e) => setNewBlogContent(e.target.value)}
          />

          {debouncedBlogContent.trim() && (
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              <label className="block text-[11px] font-medium text-zinc-400">Live Markdown Preview</label>
              <div className="p-3 bg-[#141417] border border-white/[0.08] rounded-lg max-h-56 overflow-y-auto">
                <CustomMarkdown content={debouncedBlogContent} />
              </div>
            </div>
          )}
        </form>
      </Drawer>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, title: "", id: null, type: "" })}
        title="Confirm Deletion"
        description={`Are you sure you want to permanently delete "${deleteConfirm.title}"? This action cannot be undone.`}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirm({ isOpen: false, title: "", id: null, type: "" })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                const { id, type } = deleteConfirm;
                setDeleteConfirm({ isOpen: false, title: "", id: null, type: "" });
                if (type === "experience") handleDeleteExperience(id);
                if (type === "project") handleDeleteProject(id);
                if (type === "blog") handleDeleteBlog(id);
                if (type === "comment") handleDeleteComment(id);
              }}
            >
              Delete Permanently
            </Button>
          </>
        }
      />

      {/* TOAST FEEDBACK */}
      {toast.message && (
        <CustomToast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          isDark={true}
          onClose={() => setToast({ message: "", type: "success", key: 0 })}
        />
      )}
    </AdminShell>
  );
}
