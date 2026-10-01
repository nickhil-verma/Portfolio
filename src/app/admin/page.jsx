"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Helmet from "../../components/Helmet";
import { Button, Card, Input } from "../../components/admin/ui";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_logged_in") === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 flex flex-col justify-center items-center p-6 selection:bg-red-500/20 selection:text-red-400">
      <Helmet title="Admin Login | Nikhil's Console" description="Sign in to manage projects, blogs, and configurations." />

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </Button>
        </Link>
      </div>

      {/* Minimal Card */}
      <Card className="w-full max-w-sm p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 mx-auto flex items-center justify-center mb-3 text-red-500">
            <Lock className="w-4 h-4" />
          </div>
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">
            Admin Console
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Sign in to access management portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <div className="space-y-1.5 relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[26px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-[10px] text-zinc-500 border-t border-white/[0.08] pt-4">
          Credentials are authenticated against server-side <span className="text-zinc-400 font-mono">.env</span> variables.
        </div>
      </Card>
    </div>
  );
}
