"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Download,
  RefreshCw,
  ArrowLeft,
  Lock,
  Users,
  TrendingUp,
  ChevronLeft,
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;


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

    const actions = stats.actions || [];
    const uniqueUsers = new Set(
      actions
        .filter((a) => a.name)
        .map((a) => a.name.toLowerCase()),
    );
    const downloadsLast24h = actions.filter(
      (a) =>
        new Date() - new Date(a.timestamp) < 24 * 60 * 60 * 1000,
    ).length;

    return {
      uniqueUsers: uniqueUsers.size,
      recentActivityCount: actions.length,
      downloadsLast24h,
      totalDownloads: actions.length,
    };
  }, [stats]);

  const filteredActions = useMemo(() => {
    if (!stats || !stats.actions) return [];
    return stats.actions;
  }, [stats]);

  const totalPages = Math.max(1, Math.ceil(filteredActions.length / ITEMS_PER_PAGE));

  const paginatedActions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActions, currentPage]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [stats]);

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Total Downloads
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black">
                {dashboardStats?.totalDownloads || 0}
              </span>
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-lg flex flex-col justify-between">
            <span className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
              Unique Users
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
              Last 24h
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

        {/* Main Stats Card - Downloads Only */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* Card: Downloads */}
          <div className="group">
            <div className="h-full bg-linear-to-br from-emerald-950/20 to-neutral-950 border border-emerald-500/10 rounded-xl p-10 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

              <div className="relative z-10 flex h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Download className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-[0.2em]">
                    Total Downloads
                  </p>
                  <h3 className="text-neutral-300 font-medium mt-1">
                    Cards Generated & Downloaded
                  </h3>
                </div>
                <div className="">
                  <h2 className="text-7xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform origin-left">
                    {dashboardStats?.totalDownloads || 0}
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
                  Download{" "}
                  <span className="text-orange-500 not-italic font-light">
                    History
                  </span>
                </h3>
                <p className="text-neutral-500 text-sm font-medium mt-1">
                  Log of all card downloads
                </p>
              </div>

              <div className="hidden lg:block px-5 py-2.5 bg-neutral-800/80 rounded-full text-[10px] font-black tracking-widest text-neutral-400 border border-white/5">
                {filteredActions.length > 0
                  ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredActions.length)} OF ${filteredActions.length}`
                  : "0 RECORDS"}
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
                  {paginatedActions.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group/item relative flex items-center gap-6 p-6 bg-white/2 hover:bg-white/5 border border-white/5 rounded-3xl transition-all duration-300 hover:translate-x-1"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover/item:bg-emerald-500 group-hover/item:text-black"
                      >
                        <Download className="w-6 h-6" />
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black tracking-widest text-neutral-500 uppercase">
                              DOWNLOAD
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

            {/* Pagination Controls */}
            {filteredActions.length > 0 && (
              <div className="px-8 py-6 border-t border-white/5 bg-neutral-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-neutral-500 text-xs font-bold">
                  Page {currentPage} of {totalPages} · {filteredActions.length} total records
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  {(() => {
                    const pages = [];
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, start + 4);
                    if (end - start < 4) start = Math.max(1, end - 4);

                    if (start > 1) {
                      pages.push(
                        <button key={1} onClick={() => setCurrentPage(1)} className="w-10 h-10 rounded-xl text-xs font-black tracking-wider border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95">
                          1
                        </button>
                      );
                      if (start > 2) pages.push(<span key="dots-start" className="text-neutral-600 px-1">···</span>);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-10 h-10 rounded-xl text-xs font-black tracking-wider transition-all active:scale-95 ${
                            currentPage === i
                              ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20 border border-orange-400"
                              : "border border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (end < totalPages) {
                      if (end < totalPages - 1) pages.push(<span key="dots-end" className="text-neutral-600 px-1">···</span>);
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 rounded-xl text-xs font-black tracking-wider border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95">
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
