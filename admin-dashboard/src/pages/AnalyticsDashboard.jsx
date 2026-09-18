import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarCheck, Car, Download, Eye, Loader2, RefreshCw, Store, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import { fetchAdminAnalytics } from "../api/admin.api";

const tabs = ["Team", "Vendor", "Admin"];
const chartColors = ["#0080ff", "#ec4899", "#22c55e", "#facc15", "#f97316", "#a78bfa"];
const numberFormat = new Intl.NumberFormat("en-IN");

const emptyAnalytics = {
  metrics: {
    teams: { total: 0, profileViews: 0, events: 0, registrations: 0 },
    vendors: { total: 0, profileViews: 0, events: 0, registrations: 0 },
    platform: { profileViews: 0, events: 0, approvedEvents: 0, pendingEvents: 0, registrations: 0, activeChats: 0, products: 0 },
  },
  charts: { registrationsOverTime: [], eventsByType: [], vendorCategories: [], profileViews: [] },
};

function Metric({ label, value, icon: Icon, color = "text-admin-accent" }) {
  return <div className="rounded-xl border border-white/10 bg-admin-surface-raised p-4"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-wide text-white/50">{label}</p><Icon size={19} className={color} /></div><p className={`mt-2 text-2xl font-semibold ${color}`}>{numberFormat.format(value || 0)}</p><p className="mt-1 text-xs text-white/40">Live database value</p></div>;
}

function ChartCard({ title, children, empty }) {
  return <section className="rounded-xl border border-white/10 bg-admin-surface-raised p-4 sm:p-5"><h2 className="mb-4 text-base font-semibold text-white">{title}</h2>{empty ? <div className="flex h-64 items-center justify-center text-sm text-white/40">No data available for this period.</div> : children}</section>;
}

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("Team");
  const [range, setRange] = useState("all");
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchAdminAnalytics(range);
      setAnalytics(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const metrics = useMemo(() => {
    if (tab === "Team") {
      return [
        ["Team Profile Views", analytics.metrics.teams.profileViews, Eye, "text-admin-accent"],
        ["Total Teams", analytics.metrics.teams.total, Users, "text-admin-accent"],
        ["Team Events", analytics.metrics.teams.events, CalendarCheck, "text-green-400"],
        ["Team Registrations", analytics.metrics.teams.registrations, BarChart3, "text-yellow-400"],
      ];
    }
    if (tab === "Vendor") {
      return [
        ["Vendor Profile Views", analytics.metrics.vendors.profileViews, Eye, "text-pink-400"],
        ["Total Vendors", analytics.metrics.vendors.total, Store, "text-pink-400"],
        ["Vendor Events", analytics.metrics.vendors.events, CalendarCheck, "text-green-400"],
        ["Vendor Registrations", analytics.metrics.vendors.registrations, BarChart3, "text-yellow-400"],
      ];
    }
    return [
      ["Total Profile Views", analytics.metrics.platform.profileViews, Eye, "text-admin-accent"],
      ["Events", analytics.metrics.platform.events, CalendarCheck, "text-green-400"],
      ["Registrations", analytics.metrics.platform.registrations, BarChart3, "text-yellow-400"],
      ["Pending Events", analytics.metrics.platform.pendingEvents, RefreshCw, "text-orange-400"],
    ];
  }, [analytics, tab]);

  const exportCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ...metrics.map(([label, value]) => [label, value]),
      [],
      ["Registration Month", "Registrations"],
      ...analytics.charts.registrationsOverTime.map((row) => [row.month, row.value]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `scylla-analytics-${range}.csv`;
    link.click();
    toast.success("Analytics CSV exported");
  };

  return <div className="min-h-screen space-y-6 bg-admin-bg px-4 py-5 text-white sm:px-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-admin-accent">Scylla Motorsport</p><h1 className="mt-1 text-2xl font-semibold">Analytics</h1><p className="mt-1 text-sm text-white/50">Live platform activity from teams, vendors, events, and registrations.</p></div><div className="flex flex-wrap gap-2"><select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg border border-white/10 bg-admin-surface px-3 py-2 text-sm text-white outline-none"><option value="all">Year to date</option><option value="90d">Last 90 days</option><option value="30d">Last 30 days</option></select><button onClick={loadAnalytics} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/75 hover:bg-white/5"><RefreshCw size={15} /> Refresh</button><button onClick={exportCsv} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-3 py-2 text-sm font-medium hover:bg-admin-accent-dark disabled:opacity-50"><Download size={15} /> Export CSV</button></div></div>

    <div className="flex gap-5 border-b border-white/10">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`pb-2 text-sm ${tab === item ? "border-b-2 border-admin-accent text-admin-accent" : "text-white/50 hover:text-white"}`}>{item}</button>)}</div>

    {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
    {loading ? <div className="flex min-h-72 items-center justify-center text-white/50"><Loader2 className="mr-2 animate-spin" size={20} /> Loading live analytics...</div> : <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(([label, value, Icon, color]) => <Metric key={label} label={label} value={value} icon={Icon} color={color} />)}</div>

      <div className="grid gap-6 xl:grid-cols-2"><ChartCard title="Registrations over time" empty={!analytics.charts.registrationsOverTime.length}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={analytics.charts.registrationsOverTime}><CartesianGrid stroke="#263246" strokeDasharray="3 3" /><XAxis dataKey="month" stroke="#9aa3bd" /><YAxis allowDecimals={false} stroke="#9aa3bd" /><Tooltip contentStyle={{ background: "#12182a", border: "1px solid #313c5e", color: "#fff" }} /><Line type="monotone" dataKey="value" name="Registrations" stroke="#0080ff" strokeWidth={3} /></LineChart></ResponsiveContainer></div></ChartCard><ChartCard title="Events by type" empty={!analytics.charts.eventsByType.length}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.charts.eventsByType}><CartesianGrid stroke="#263246" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#9aa3bd" /><YAxis allowDecimals={false} stroke="#9aa3bd" /><Tooltip contentStyle={{ background: "#12182a", border: "1px solid #313c5e", color: "#fff" }} /><Bar dataKey="value" name="Events" fill="#22c55e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard></div>

      <div className="grid gap-6 xl:grid-cols-2"><ChartCard title="Vendor categories" empty={!analytics.charts.vendorCategories.length}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={analytics.charts.vendorCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>{analytics.charts.vendorCategories.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "#12182a", border: "1px solid #313c5e", color: "#fff" }} /><Legend /></PieChart></ResponsiveContainer></div></ChartCard><ChartCard title="Most viewed profiles" empty={!analytics.charts.profileViews.length}><div className="space-y-3">{analytics.charts.profileViews.map((profile, index) => <div key={`${profile.type}-${profile.name}`} className="flex items-center justify-between rounded-lg bg-admin-bg p-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 text-xs text-admin-accent">{index + 1}</span><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{profile.name}</p><p className="text-xs text-white/45">{profile.type}</p></div></div><span className="shrink-0 text-sm font-semibold text-admin-accent">{numberFormat.format(profile.views)} views</span></div>)}</div></ChartCard></div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Approved Events" value={analytics.metrics.platform.approvedEvents} icon={CalendarCheck} color="text-green-400" /><Metric label="Rejected Events" value={analytics.metrics.platform.rejectedEvents} icon={CalendarCheck} color="text-red-400" /><Metric label="Products" value={analytics.metrics.platform.products} icon={Car} color="text-pink-400" /><Metric label="Active Chats" value={analytics.metrics.platform.activeChats} icon={BarChart3} color="text-yellow-400" /></div>
    </>}
  </div>;
}
