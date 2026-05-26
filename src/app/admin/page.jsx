"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, User, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_logged_in") === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_logged_in", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credential combination.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to authentication server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] noise-overlay relative overflow-hidden flex flex-col justify-center items-center p-6">
      <div className="absolute inset-0 z-0 grid-mesh pointer-events-none" />

      {/* Back to dashboard */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center space-x-2 text-xs font-semibold tracking-wide text-zinc-400 hover:text-white transition-colors py-2 px-3 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard Home</span>
          </motion.button>
        </Link>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 glass-card relative z-10 shadow-2xl"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-red-400" />
          </div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight text-white mb-1">
            Admin Console
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to manage projects, blogs, and configurations.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors backdrop-blur-md text-white font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-[#121214]/60 border border-white/5 focus:border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs focus:outline-none transition-colors backdrop-blur-md text-white font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-red-500/20"
            >
              Sign In to Console
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-[10px] text-zinc-500 border-t border-zinc-800/40 pt-4">
          Credentials are loaded securely from server-side <span className="text-zinc-400 font-mono">.env</span> variables.
        </div>
      </motion.div>
    </div>
  );
}
