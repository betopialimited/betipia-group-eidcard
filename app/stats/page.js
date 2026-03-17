"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Eye,
  Download,
  RefreshCw,
  Clock,
  ArrowLeft,
  Lock,
  Users,
  TrendingUp,
  ChevronRight,
  LogOut,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function StatisticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchStats = useCallback(
    async (p = password) => {
      setLoading(true);
      setAuthError("");
      try {
        const res = await fetch(`/api/stats?password=${encodeURIComponent(p)}`);
        if (res.status === 401) {
          setAuthError("Incorrect access password.");
          setIsAuthenticated(false);
          setStats(null);
          return;
        }
        const data = await res.json();
        setStats(data);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("eid_stats_password", p);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    },
    [password],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eid_stats_password");
      if (saved) {
        setPassword(saved);
        fetchStats(saved);
      } else {
        setLoading(false);
      }
    }
  }, [fetchStats]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchStats();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eid_stats_password");
    }
    setIsAuthenticated(false);
    setStats(null);
    setPassword("");
  };

  const dashboardStats = useMemo(() => {
    if (!stats) return null;

    const uniqueUsers = new Set(
      (stats.actions || [])
        .filter((a) => a.name)
        .map((a) => a.name.toLowerCase()),
    );
    const downloadsLast24h = (stats.actions || []).filter(
      (a) =>
        a.action === "download" &&
        new Date() - new Date(a.timestamp) < 24 * 60 * 60 * 1000,
    ).length;

    return {
      uniqueUsers: uniqueUsers.size,
      recentActivityCount: (stats.actions || []).length,
      downloadsLast24h,
      totalActivity: (stats.views || 0) + (stats.downloads || 0),
      totalViews: stats.views || 0,
      totalDownloads: stats.downloads || 0,
    };
  }, [stats]);

  const filteredActions = useMemo(() => {
    if (!stats || !stats.actions) return [];
    if (filter === "all") return stats.actions;
    return stats.actions.filter((a) => a.action === filter);
  }, [stats, filter]);

  if (loading && !stats && !authError && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-neutral-400 font-medium tracking-wide">
            Initializing secure dashboard...
          </p>
        </div>
      </div>
    );
  }

  // --- Login Form ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-6 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-md w-full relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-orange-600/20 to-amber-600/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-neutral-900/80 border border-white/5 backdrop-blur-2xl rounded-3xl p-10 shadow-3xl">
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-linear-to-br from-orange-500/20 to-amber-500/5 rounded-2xl flex items-center justify-center mb-6 text-orange-400 border border-orange-500/20 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Portal
              </h1>
              <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                Connect your credentials to access the analytics suite.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-neutral-600 group-focus-within/input:text-orange-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret access key"
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white placeholder-neutral-500"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-400 text-xs mt-2 ml-1 font-medium flex items-center gap-1 animate-bounce">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>{" "}
                    {authError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group/btn relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Activity className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                )}
                <span className="relative z-10">
                  {loading ? "Verifying Access..." : "Enter Dashboard"}
                </span>
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/5 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group text-xs font-semibold text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to Generator
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Dashboard ---
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> CARD GENERATOR
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-1 bg-linear-to-b from-orange-400 to-amber-600 self-stretch rounded-full"></div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3 italic">
                  INSIGHTS{" "}
                  <span className="text-neutral-500 font-light not-italic">
                    HUB
                  </span>
                </h1>
                <p className="text-neutral-400 mt-2 font-medium">
                  {" "}
                  Real-time metrics for Betopia Eid Card performance
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/50 p-2 border border-white/5 backdrop-blur-xl rounded-2xl">
            <button
              onClick={() => fetchStats()}
              className="flex items-center gap-2 px-5 py-3 hover:bg-white/5 rounded-xl transition-all font-bold text-sm tracking-wide active:scale-95 group"
            >
              <RefreshCw
                className={`w-4 h-4 text-orange-400 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              REFRESH
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm tracking-wide active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              EXIT
            </button>
          </div>
        </header>

        {/* Secondary Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Active Users
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black">
                {dashboardStats?.uniqueUsers || 0}
              </span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Recent Actions
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black">
                {dashboardStats?.recentActivityCount || 0}
              </span>
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              24h Growth
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black">
                +{dashboardStats?.downloadsLast24h || 0}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Total Combined
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black">
                {dashboardStats?.totalActivity || 0}
              </span>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Status
            </span>
            <div className="flex items-baseline gap-2 mt-2 truncate">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                Live
              </span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Page Views */}
          <div className="lg:col-span-1 group">
            <div className="h-full bg-linear-to-br from-neutral-900/80 to-neutral-900/40 border border-white/5 rounded-xl p-10 relative overflow-hidden transition-all duration-500 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

              <div className="relative z-10 flex h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mb-8 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-black transition-all">
                    <Eye className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-[0.2em]">
                    Audience Engagement
                  </p>
                  <h3 className="text-neutral-300 font-medium mt-1">
                    Total Page Traffic
                  </h3>
                </div>
                <div className="">
                  <h2 className="text-7xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform origin-left">
                    {stats?.views || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Downloads */}
          <div className="lg:col-span-1">
            <div className="h-full bg-linear-to-br from-emerald-950/20 to-neutral-950 border border-emerald-500/10 rounded-xl p-10 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

              <div className="relative z-10 flex h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Download className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-[0.2em]">
                    Conversion Data
                  </p>
                  <h3 className="text-neutral-300 font-medium mt-1">
                    Content Generated
                  </h3>
                </div>
                <div className="">
                  <h2 className="text-7xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform origin-left">
                    {stats?.downloads || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log Feed */}
        <div className="relative group">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="bg-neutral-900/40 border border-white/5 rounded-xl overflow-hidden backdrop-blur-2xl">
            <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
              <div>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 italic uppercase">
                  Activity{" "}
                  <span className="text-orange-500 not-italic font-light">
                    History
                  </span>
                </h3>
                <p className="text-neutral-500 text-sm font-medium mt-1">
                  Detailed log of recent portal interactions
                </p>
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-neutral-950/50 border border-white/5 rounded-full backdrop-blur-md">
                {[
                  {
                    id: "all",
                    label: "All",
                    count: dashboardStats?.totalActivity,
                    icon: Activity,
                  },
                  {
                    id: "view",
                    label: "Views",
                    count: dashboardStats?.totalViews,
                    icon: Eye,
                  },
                  {
                    id: "download",
                    label: "Downloads",
                    count: dashboardStats?.totalDownloads,
                    icon: Download,
                  },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      filter === btn.id
                        ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                        : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"
                    }`}
                  >
                    <btn.icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] ${filter === btn.id ? "bg-black/10 text-black" : "bg-white/5 text-neutral-400"}`}
                    >
                      {btn.count || 0}
                    </span>
                  </button>
                ))}
              </div>

              <div className="hidden lg:block px-5 py-2.5 bg-neutral-800/80 rounded-full text-[10px] font-black tracking-widest text-neutral-400 border border-white/5">
                SHOWING {filteredActions.length} RECORDS
              </div>
            </div>

            <div className="p-6 md:p-10">
              {!stats?.actions || stats?.actions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-[0.2em] text-sm">
                    Waiting for data...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActions.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group/item relative flex items-center gap-6 p-6 bg-white/2 hover:bg-white/5 border border-white/5 rounded-3xl transition-all duration-300 hover:translate-x-1"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${
                          item.action === "download"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover/item:bg-emerald-500 group-hover/item:text-black"
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover/item:bg-orange-500 group-hover/item:text-black"
                        }`}
                      >
                        {item.action === "download" ? (
                          <Download className="w-6 h-6" />
                        ) : (
                          <Eye className="w-6 h-6" />
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black tracking-widest text-neutral-500 uppercase">
                              {item.action}
                            </span>
                            <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                            <span className="text-xs font-bold text-neutral-400 tracking-tight">
                              {new Date(item.timestamp).toLocaleString(
                                undefined,
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            {item.name ? (
                              <h4 className="text-lg font-black text-white tracking-tight leading-tight">
                                {item.name}
                                {item.designation && (
                                  <span className="text-neutral-500 font-medium ml-2 text-sm italic">
                                    — {item.designation}
                                  </span>
                                )}
                              </h4>
                            ) : (
                              <h4 className="text-lg font-medium text-neutral-500 tracking-tight leading-tight italic">
                                Anonymous User
                              </h4>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-start md:justify-end">
                          <div className="px-4 py-1.5 bg-neutral-900 border border-white/5 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-neutral-300 uppercase">
                              Status: Success
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute right-6 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-neutral-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-neutral-950/40 text-center text-neutral-600 text-[10px] font-black tracking-[0.3em] uppercase">
              End of Log Stream
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 py-10 text-center relative z-10">
        <p className="text-neutral-600 text-[10px] uppercase font-black tracking-[0.5em]">
          Powered by Betopia Engineering
        </p>
      </footer>
    </div>
  );
}
