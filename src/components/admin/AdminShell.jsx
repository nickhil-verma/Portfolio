"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  BookHeart,
  Briefcase,
  MessageSquare,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Bell,
  ArrowLeft,
  Menu,
  X,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, IconButton, Badge } from "./ui";

export function AdminShell({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  unreadComments = [],
  onLogout,
  isDark,
  setIsDark,
  children,
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollapse = localStorage.getItem("admin_sidebar_collapsed");
      if (savedCollapse) {
        setIsCollapsed(savedCollapse === "true");
      }
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("admin_sidebar_collapsed", next ? "true" : "false");
  };

  const toggleTheme = () => {
    const next = !isDark;
    if (setIsDark) setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navGroups = [
    {
      group: "Overview",
      items: [
        { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
        { id: "blog-analytics", label: "Blog Analytics App", icon: BarChart3 },
      ],
    },
    {
      group: "Content",
      items: [
        { id: "experiences", label: "Work Experiences", icon: Briefcase },
        { id: "projects", label: "Manage Projects", icon: FolderKanban },
        { id: "blogs", label: "Markdown Blogs", icon: BookHeart },
      ],
    },
    {
      group: "Audience",
      items: [
        { id: "comments", label: "Visitor Reflections", icon: MessageSquare, badge: unreadCount },
      ],
    },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return { title: "Overview & Analytics", desc: "Telemetry insights, visitor metrics, and IP tracking." };
      case "blog-analytics":
        return { title: "Blog Analytics App", desc: "Per-article performance, view counts, and engagement trends." };
      case "experiences":
        return { title: "Work Experiences", desc: "Manage work history, company logos, roles, dates, and priorities." };
      case "projects":
        return { title: "Manage Projects", desc: "Manage portfolio codebases, pinned items, and live demos." };
      case "blogs":
        return { title: "Markdown Blogs", desc: "Write, edit, and publish technical articles and guides." };
      case "comments":
        return { title: "Visitor Reflections", desc: "Review, manage, and moderate anonymous visitor notes." };
      default:
        return { title: "Admin Console", desc: "Manage content and view site telemetry." };
    }
  };

  const currentInfo = getPageTitle();

  return (
    <div className={`min-h-screen flex font-sans antialiased selection:bg-red-500/20 selection:text-red-400 transition-colors ${
      isDark ? "bg-[#0A0A0B] text-zinc-100" : "bg-[#F4F4F6] text-zinc-900"
    }`}>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r transition-all duration-200 z-20 ${
          isDark ? "border-white/[0.08] bg-[#111113]" : "border-black/10 bg-white"
        } ${isCollapsed ? "w-16 px-2 py-4" : "w-60 p-4"}`}
      >
        <div>
          {/* Console Header */}
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-6 px-1`}>
            <div className="flex items-center space-x-2.5">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                isDark ? "bg-red-600/10 border-red-500/20 text-red-500" : "bg-red-50 border-red-200 text-red-600"
              }`}>
                <Cpu className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <span className={`font-semibold text-xs tracking-tight font-mono ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  Nikhil Console
                </span>
              )}
            </div>
            {!isCollapsed && (
              <IconButton title="Collapse sidebar" onClick={toggleCollapse} size="sm">
                <ChevronLeft className="w-4 h-4" />
              </IconButton>
            )}
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <p className={`px-2.5 text-[10px] font-medium uppercase tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    {group.group}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (isMobileOpen) setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isCollapsed ? "justify-center px-0" : "px-2.5"
                      } py-2 rounded-lg text-xs font-medium transition-all relative ${
                        isActive
                          ? isDark
                            ? "bg-white/[0.06] text-zinc-100 border border-white/[0.08]"
                            : "bg-black/[0.06] text-zinc-900 border border-black/10 font-semibold"
                          : isDark
                          ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.03] border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-red-500 rounded-r" />
                      )}
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-2.5 truncate">{item.label}</span>}
                      {!isCollapsed && item.badge > 0 && (
                        <Badge variant="danger" className="ml-auto font-mono text-[9px]">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className={`space-y-1 pt-4 border-t ${isDark ? "border-white/[0.08]" : "border-black/10"}`}>
          {isCollapsed && (
            <IconButton title="Expand sidebar" onClick={toggleCollapse} size="sm" className="w-full mb-2">
              <ChevronRight className="w-4 h-4" />
            </IconButton>
          )}

          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-0" : "px-2.5"
            } py-2 rounded-lg text-xs font-medium transition-colors ${
              isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]" : "text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.03]"
            }`}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
            {!isCollapsed && <span className="ml-2.5">{isDark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <button
            onClick={onLogout}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-0" : "px-2.5"
            } py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2.5">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className={`h-14 border-b px-4 md:px-6 flex items-center justify-between z-10 sticky top-0 transition-colors ${
          isDark ? "border-white/[0.08] bg-[#111113]" : "border-black/10 bg-white"
        }`}>
          <div className="flex items-center space-x-3">
            <IconButton
              title="Open Mobile Menu"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden"
            >
              <Menu className="w-4 h-4" />
            </IconButton>

            <div>
              <h1 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                {currentInfo.title}
              </h1>
              <p className={`text-[11px] hidden sm:block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {currentInfo.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Notification Bell */}
            <div className="relative">
              <IconButton
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </IconButton>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? "bg-[#141417] border-white/[0.08]" : "bg-white border-black/10"
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isDark ? "border-white/[0.08]" : "border-black/10"}`}>
                    <span className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Notifications</span>
                    <Badge variant={unreadCount > 0 ? "danger" : "neutral"}>
                      {unreadCount} New
                    </Badge>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-white/[0.06] py-1">
                    {unreadComments.length === 0 ? (
                      <p className="text-[11px] text-zinc-500 text-center py-4">No unread reflections.</p>
                    ) : (
                      unreadComments.slice(0, 5).map((c, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveTab("comments");
                            setShowNotifications(false);
                          }}
                          className={`py-2 px-1 rounded transition-colors cursor-pointer ${
                            isDark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.04]"
                          }`}
                        >
                          <p className={`text-xs font-medium truncate ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>{c.name || "Anonymous Visitor"}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{c.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Public Portfolio Ghost Button */}
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Portfolio</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-[1200px] w-full mx-auto space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileOpen(false)} />
          <div className={`relative w-64 border-r p-4 flex flex-col justify-between h-full z-10 ${
            isDark ? "bg-[#111113] border-white/[0.08]" : "bg-white border-black/10"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-red-500" />
                  <span className={`font-semibold text-xs font-mono ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>Nikhil Console</span>
                </div>
                <IconButton title="Close menu" onClick={() => setIsMobileOpen(false)}>
                  <X className="w-4 h-4" />
                </IconButton>
              </div>

              <nav className="space-y-4">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
                      {group.group}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileOpen(false);
                          }}
                          className={`w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? isDark
                                ? "bg-white/[0.06] text-zinc-100 border border-white/[0.08]"
                                : "bg-black/[0.06] text-zinc-900 border border-black/10"
                              : isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2.5" />
                          <span>{item.label}</span>
                          {item.badge > 0 && (
                            <Badge variant="danger" className="ml-auto font-mono text-[9px]">
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className={`space-y-2 pt-4 border-t ${isDark ? "border-white/[0.08]" : "border-black/10"}`}>
              <button
                onClick={onLogout}
                className="w-full flex items-center px-2.5 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
