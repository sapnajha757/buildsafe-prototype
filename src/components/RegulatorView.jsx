import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";
import { ShieldCheck, AlertTriangle, Building2, TrendingUp, Eye } from "lucide-react";
import GlowCard from "./GlowCard";

const SITE_COMPLIANCE = [
  { site: "Sector-21 Metro", score: 94, flag: "green" },
  { site: "Greenfield Hts", score: 82, flag: "yellow" },
  { site: "River Residency", score: 73, flag: "yellow" },
  { site: "NH-44 Overpass", score: 61, flag: "red" },
  { site: "Skyline Tower", score: 91, flag: "green" },
];

const REGIONS = [
  { name: "Uttar Pradesh", pct: 87 },
  { name: "Maharashtra", pct: 79 },
  { name: "Rajasthan", pct: 65 },
  { name: "Gujarat", pct: 90 },
];

function StatCard({ icon: Icon, label, value, sub, subColor = "text-textMuted", iconBg = "bg-surface3", iconColor = "text-textMuted" }) {
  return (
    <GlowCard className="p-5 flex flex-col gap-3" tilt={true} borderGlow={true}>
      <div className="flex items-start justify-between">
        <p className="label-mono uppercase">{label}</p>
        <span className={`icon-pulse p-2 rounded-lg ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-display stat-shimmer">{value}</p>
        {sub && <p className={`text-xs mt-1 font-mono ${subColor}`}>{sub}</p>}
      </div>
    </GlowCard>
  );
}

const barColor = (flag) =>
  flag === "green" ? "#10b981" : flag === "yellow" ? "#f59e0b" : "#ef4444";

export default function RegulatorView({ chain = [], workers = [], projects = [] }) {
  const totalWages = chain
    .filter((b) => b.type === "PAYOUT")
    .reduce((s, b) => s + (b.data?.amount || 0), 0);

  const openDisputes = chain.filter(
    (b) => b.type === "DISPUTE_RAISED" &&
      !chain.some(
        (x) => x.type === "DISPUTE_RESOLVED" && x.data?.disputeId === b.data?.disputeId
      )
  );

  const avgCompliance = Math.round(
    SITE_COMPLIANCE.reduce((s, x) => s + x.score, 0) / SITE_COMPLIANCE.length
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="font-display text-2xl text-white">Labour Compliance Authority</h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/30">
              REGULATOR
            </span>
          </div>
          <p className="text-sm text-textMuted">
            {projects.length} registered sites · {workers.length} workers indexed · Read-only access
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-textMuted font-mono bg-surface2 border border-border rounded-lg px-3 py-2">
          <Eye size={12} className="text-primary" />
          Read-only audit mode
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Sites monitored"
          value={SITE_COMPLIANCE.length}
          sub={`${projects.length} registered`}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open flags"
          value={openDisputes.length}
          sub={`${openDisputes.length > 0 ? openDisputes.length : 0} high priority`}
          subColor={openDisputes.length > 0 ? "text-danger" : "text-textMuted"}
          iconBg={openDisputes.length > 0 ? "bg-danger/10" : "bg-surface3"}
          iconColor={openDisputes.length > 0 ? "text-danger" : "text-textMuted"}
        />
        <StatCard
          icon={ShieldCheck}
          label="Wages audited"
          value={`₹${(totalWages / 1000).toFixed(1)}K`}
          sub="100% on-chain verified"
          subColor="text-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg compliance"
          value={`${avgCompliance}%`}
          sub="↗ 3.2% vs last period"
          subColor="text-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compliance by site */}
        <GlowCard className="p-5" tilt={false} borderGlow={true}>
          <p className="text-sm font-semibold text-white mb-4">Compliance Score by Site</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SITE_COMPLIANCE} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="site"
                tick={{ fontSize: 10, fill: "#A0A0A8", fontFamily: "JetBrains Mono, monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#A0A0A8", fontFamily: "JetBrains Mono, monospace" }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#A0A0A8" }}
                cursor={{ fill: "rgba(16,185,129,0.05)" }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {SITE_COMPLIANCE.map((entry, idx) => (
                  <Cell key={idx} fill={barColor(entry.flag)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[["green", "#10b981", "≥ 85%"], ["yellow", "#f59e0b", "65–84%"], ["red", "#ef4444", "< 65%"]].map(([key, color, label]) => (
              <span key={key} className="flex items-center gap-1.5 label-mono">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </GlowCard>

        {/* Regional compliance progress */}
        <GlowCard className="p-5" tilt={false} borderGlow={true}>
          <p className="text-sm font-semibold text-white mb-4">Compliance by Region</p>
          <div className="space-y-4">
            {REGIONS.map((r) => {
              const color =
                r.pct >= 85 ? "#10b981" : r.pct >= 65 ? "#f59e0b" : "#ef4444";
              return (
                <div key={r.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="label-mono">{r.name}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color }}>{r.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface3 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* On-chain audit trail */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="label-mono uppercase mb-2">Recent Audit Events</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {chain.slice(-5).reverse().map((b, i) => (
                <div key={i} className="flex items-center justify-between label-mono py-1 border-b border-border/50 last:border-0">
                  <span className="text-primary/70">#{b.index}</span>
                  <span>{b.type?.replace("_", " ")}</span>
                  <span>{new Date(b.timestamp).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
              {chain.length === 0 && (
                <p className="label-mono text-center py-2">No ledger events yet</p>
              )}
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Registered sites table */}
      <GlowCard className="p-5" tilt={false} borderGlow={true}>
        <p className="text-sm font-semibold text-white mb-4">Registered Sites</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-textMuted border-b border-border">
                <th className="text-left pb-2 font-medium">Site ID</th>
                <th className="text-left pb-2 font-medium">Site Name</th>
                <th className="text-left pb-2 font-medium">Workers</th>
                <th className="text-left pb-2 font-medium">Wage Locked (₹)</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const siteWorkers = workers.filter((w) => w.projectId === p.id).length;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-surface2 transition-colors">
                    <td className="py-2.5 font-mono text-textMuted">{p.id}</td>
                    <td className="py-2.5 text-white">{p.name}</td>
                    <td className="py-2.5 text-textMuted">{siteWorkers}</td>
                    <td className="py-2.5 text-textMuted">₹{(p.wageLocked || 0).toLocaleString("en-IN")}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {projects.length === 0 && (
            <p className="text-xs text-textMuted text-center py-4">No projects registered yet.</p>
          )}
        </div>
      </GlowCard>
    </div>
  );
}
