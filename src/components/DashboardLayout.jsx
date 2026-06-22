import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HardHat, LogOut, Bell, Search, Languages, GitBranch, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLE_LABELS = {
  worker: "Field Worker",
  contractor: "Site Contractor",
  builder: "Builder / Developer",
  regulator: "Labour Regulator",
};

export default function DashboardLayout({
  children,
  lang,
  toggleLang,
  LANG_LABELS,
  showBuildLog,
  setShowBuildLog,
  searchQuery,
  setSearchQuery,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(searchQuery || "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen bg-dark overflow-hidden w-full">
      {/* ── Main column ─────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden w-full">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border shrink-0">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <div className="bg-primary p-1.5 rounded-lg shrink-0">
              <HardHat size={16} className="text-dark" />
            </div>
            <div>
              <p className="font-display text-xs text-white leading-none font-bold">BuildSafe</p>
              <p className="text-[9px] text-textMuted font-mono mt-0.5">Wage protection</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors"
            >
              <Search size={13} />
            </button>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search workers, sites, tx..."
              className="w-full pl-8 pr-8 py-2 bg-surface3 border border-border rounded-lg text-xs text-white placeholder-textMuted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              title="Toggle Language"
              className="flex items-center gap-1.5 text-[11px] font-mono text-textSecondary hover:text-primary border border-border hover:border-primary/30 bg-surface3 rounded-lg px-2.5 py-1.5 transition-all"
            >
              <Languages size={12} />
              <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
            </button>

            {/* Build log */}
            <button
              onClick={() => setShowBuildLog(true)}
              title="Build Log"
              className="flex items-center gap-1.5 text-[11px] font-mono text-textSecondary hover:text-primary border border-border hover:border-primary/30 bg-surface3 rounded-lg px-2.5 py-1.5 transition-all"
            >
              <GitBranch size={12} className="text-primary" />
              <span className="hidden sm:inline">Log</span>
            </button>

            {/* Notification bell */}
            <button className="relative text-textMuted hover:text-white p-2 rounded-lg border border-border bg-surface3 transition-all mr-1">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>

            {/* User profile and logout */}
            <div className="flex items-center gap-2.5 px-2 py-1.5 bg-surface3 border border-border rounded-lg ml-1 shrink-0">
              <div className="w-7 h-7 rounded-full bg-primaryMuted border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-primary">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-[11px] font-semibold text-white truncate max-w-[80px] leading-tight">{user?.name}</p>
                <p className="text-[9px] text-textMuted leading-none mt-0.5">{ROLE_LABELS[user?.role] || user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="text-textMuted hover:text-danger p-1 rounded transition-colors shrink-0"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-dark">
          <div className="relative min-h-full">
            {/* Ambient glow orbs — very low opacity, add visual depth */}
            <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
            <div className="ambient-orb ambient-orb-2" aria-hidden="true" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
