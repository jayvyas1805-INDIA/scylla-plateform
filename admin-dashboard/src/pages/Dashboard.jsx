import StatCard from "../components/StatCard";
import PaymentChart from "../components/PaymentChart";
import ProfileRow from "../components/ProfileRow";
import SideStat from "../components/SideStat";
import QuickAction from "../components/QuickAction";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/admin.api";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Store,
  Calendar,
  Wallet,
  UserPlus,
  MessageCircle,
  Clock,
  Flag,
  Cog,
  UserRoundCheck,
} from "lucide-react";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    getDashboardStats().then(res => {
      setStats(res.data);
      setPendingCount(
        (res.data.teams?.pending || 0) +
        (res.data.vendors?.pending || 0) +
        (res.data.products?.pending || 0) +
        (res.data.events?.pending || 0)
      );
    });
  }, []);

 

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          value={stats?.teams?.total}
          title="Total Teams"
          bar="bg-admin-accent"
          iconBg="bg-admin-accent-dark shadow-[0_0_15px_#2563eb]"
          titleColor="text-admin-accent"
          neonGlow="bg-gradient-to-r from-admin-accent/70 to-transparent"
          hoverGlow="hover:shadow-[0_0_30px_#3b82f6]"
        />

        <StatCard
          icon={Store}
          value={stats?.vendors?.total}
          title="Total Vendors"
          bar="bg-pink-500"
          iconBg="bg-pink-600 shadow-[0_0_15px_#db2777]"
          titleColor="text-pink-400"
          neonGlow="bg-gradient-to-r from-pink-500/70 to-transparent"
          hoverGlow="hover:shadow-[0_0_30px_#ec4899]"
        />

        <StatCard
          icon={Calendar}
          value={stats?.events?.total || 0}
          title="Total Events"
          bar="bg-green-500"
          iconBg="bg-green-600 shadow-[0_0_15px_#16a34a]"
          titleColor="text-green-400"
          neonGlow="bg-gradient-to-r from-green-500/70 to-transparent"
          hoverGlow="hover:shadow-[0_0_30px_#22c55e]"
        />

        <StatCard
          icon={Wallet}
          value={`₹${((stats?.payments?.collected || 0) / 1000000).toFixed(1)}M`}
          title="Revenue"
          bar="bg-yellow-500"
          iconBg="bg-yellow-600 shadow-[0_0_15px_#ca8a04]"
          titleColor="text-yellow-400"
          neonGlow="bg-gradient-to-r from-yellow-400/70 to-transparent"
          hoverGlow="hover:shadow-[0_0_30px_#eab308]"
        />
      </div>

      {/* ================= PAYMENT CHART ================= */}
      <div className="bg-black p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]">
        <PaymentChart paymentStats={stats?.payments} />
      </div>

      <div className="bg-black p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Registration invitations</h2>
          <span className="text-admin-accent font-semibold">{stats?.invitations?.conversionRate || 0}% converted</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-white/5 p-4"><strong className="block text-2xl text-white">{stats?.invitations?.total || 0}</strong><span className="text-xs text-white/60">Sent</span></div>
          <div className="rounded-lg bg-green-500/10 p-4"><strong className="block text-2xl text-green-400">{stats?.invitations?.converted || 0}</strong><span className="text-xs text-white/60">Converted</span></div>
          <div className="rounded-lg bg-yellow-500/10 p-4"><strong className="block text-2xl text-yellow-400">{stats?.invitations?.pending || 0}</strong><span className="text-xs text-white/60">Pending</span></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-white/70">
          <div className="rounded-lg border border-admin-accent/30 px-4 py-3">Team: <strong className="text-white">{stats?.invitations?.team?.converted || 0}/{stats?.invitations?.team?.total || 0}</strong> converted ({stats?.invitations?.team?.conversionRate || 0}%)</div>
          <div className="rounded-lg border border-pink-500/30 px-4 py-3">Vendor: <strong className="text-white">{stats?.invitations?.vendor?.converted || 0}/{stats?.invitations?.vendor?.total || 0}</strong> converted ({stats?.invitations?.vendor?.conversionRate || 0}%)</div>
        </div>
      </div>

      {/* ================= PROFILES + SIDE STATS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profiles */}
        <div className="lg:col-span-2 bg-black p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.03)] space-y-4">
          <h2 className="text-white font-semibold mb-2">
            Most Viewed Profiles
          </h2>

          {(stats?.mostViewedProfiles || []).map((profile, index) => (
            <ProfileRow
              key={`${profile.kind}-${profile.name}`}
              index={index + 1}
              icon={profile.kind === "vendor" ? Cog : Flag}
              name={profile.name}
              type={profile.type}
              views={profile.views}
              color={index % 2 ? "bg-pink-500/10" : "bg-admin-accent/10"}
              iconColor={index % 2 ? "text-pink-400" : "text-admin-accent"}
              glowColor={index % 2 ? "rgba(236,72,153,0.7)" : "rgba(59,130,246,0.7)"}
            />
          ))}
          {!stats?.mostViewedProfiles?.length && (
            <p className="text-sm text-white/50">No profile views recorded yet.</p>
          )}
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <SideStat
            value={stats?.newThisMonth?.teams || 0}
            labelTop="New Teams"
            labelBottom="This Month"
            icon={UserPlus}
            color="bg-admin-accent-dark"
            iconColor="text-admin-accent"
            glowColor="rgba(59,130,246,0.7)"
          />

          <SideStat
            value={stats?.newThisMonth?.vendors || 0}
            labelTop="New Vendors"
            labelBottom="This Month"
            icon={Store}
            color="bg-pink-600"
            iconColor="text-pink-400"
            glowColor="rgba(236,72,153,0.7)"
          />

          <SideStat
            value={stats?.activeChats || 0}
            labelTop="Active Chats"
            labelBottom="Live Now"
            icon={MessageCircle}
            color="bg-green-600"
            iconColor="text-green-400"
            glowColor="rgba(34,197,94,0.7)"
          />

          <SideStat
            value={pendingCount}
            labelTop="Pending"
            labelBottom="Verifications"
            icon={Clock}
            color="bg-yellow-600"
            iconColor="text-yellow-400"
            glowColor="rgba(234,179,8,0.7)"
          />
        </div>
      </div>

      <div className="bg-black p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Event registrations this month</h2>
          <span className="text-xs text-white/50">{stats?.newThisMonth?.registrations || 0} total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SideStat value={stats?.registrations?.guests || 0} labelTop="Guest" labelBottom="Registrations" icon={UserRoundCheck} color="bg-cyan-600" iconColor="text-cyan-300" glowColor="rgba(34,211,238,0.7)" />
          <SideStat value={stats?.registrations?.teams || 0} labelTop="Team" labelBottom="Registrations" icon={Flag} color="bg-admin-accent-dark" iconColor="text-admin-accent" glowColor="rgba(59,130,246,0.7)" />
          <SideStat value={stats?.registrations?.vendors || 0} labelTop="Vendor" labelBottom="Registrations" icon={Store} color="bg-pink-600" iconColor="text-pink-400" glowColor="rgba(236,72,153,0.7)" />
        </div>
      </div>

      {/* ================= QUICK ACTION ================= */}
      <QuickAction />
    </div>
  );
}
