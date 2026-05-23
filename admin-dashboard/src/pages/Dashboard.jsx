import StatCard from "../components/StatCard";
import PaymentChart from "../components/PaymentChart";
import ProfileRow from "../components/ProfileRow";
import SideStat from "../components/SideStat";
import QuickAction from "../components/QuickAction";
import { useEffect, useState } from "react";
import { getDashboardStats, getPendingUsers } from "../api/admin.api";
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
  Bolt,
} from "lucide-react";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [admin,setAdmin] = useState("")
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data));
  }, []);

  useEffect(() => {
    getPendingUsers().then(res => {
      const teams = res.data.teams?.length || 0;
      const vendors = res.data.vendors?.length || 0;
      const products = res.data.products?.length || 0;

      setPendingCount(teams + vendors + products);
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
          bar="bg-blue-500"
          iconBg="bg-blue-600 shadow-[0_0_15px_#2563eb]"
          titleColor="text-blue-400"
          neonGlow="bg-gradient-to-r from-blue-500/70 to-transparent"
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
          value="12"
          title="Total Events"
          bar="bg-green-500"
          iconBg="bg-green-600 shadow-[0_0_15px_#16a34a]"
          titleColor="text-green-400"
          neonGlow="bg-gradient-to-r from-green-500/70 to-transparent"
          hoverGlow="hover:shadow-[0_0_30px_#22c55e]"
        />

        <StatCard
          icon={Wallet}
          value="₹2.4M"
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
        <PaymentChart />
      </div>

      {/* ================= PROFILES + SIDE STATS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profiles */}
        <div className="lg:col-span-2 bg-black p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.03)] space-y-4">
          <h2 className="text-white font-semibold mb-2">
            Most Viewed Profiles
          </h2>

          <ProfileRow
            index={1}
            icon={Flag}
            name="Red Bull Racing"
            type="Formula 1 Team"
            views="15.2K"
            color="bg-blue-500/10"
            iconColor="text-blue-400"
            glowColor="rgba(59,130,246,0.7)"
          />

          <ProfileRow
            index={2}
            icon={Cog}
            name="Michelin Tyres"
            type="Tyre Vendor"
            views="12.8K"
            color="bg-pink-500/10"
            iconColor="text-pink-400"
            glowColor="rgba(236,72,153,0.7)"
          />

          <ProfileRow
            index={3}
            icon={Flag}
            name="McLaren F1"
            type="Formula 1 Team"
            views="11.5K"
            color="bg-green-500/10"
            iconColor="text-green-400"
            glowColor="rgba(34,197,94,0.7)"
          />

          <ProfileRow
            index={4}
            icon={Bolt}
            name="Brembo Brakes"
            type="Brake Vendor"
            views="9.2K"
            color="bg-yellow-500/10"
            iconColor="text-yellow-400"
            glowColor="rgba(234,179,8,0.7)"
          />
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <SideStat
            value="24"
            labelTop="New Teams"
            labelBottom="This Month"
            icon={UserPlus}
            color="bg-blue-600"
            iconColor="text-blue-400"
            glowColor="rgba(59,130,246,0.7)"
          />

          <SideStat
            value="8"
            labelTop="New Vendors"
            labelBottom="This Month"
            icon={Store}
            color="bg-pink-600"
            iconColor="text-pink-400"
            glowColor="rgba(236,72,153,0.7)"
          />

          <SideStat
            value="156"
            labelTop="Active Chats"
            labelBottom="Live Now"
            icon={MessageCircle}
            color="bg-green-600"
            iconColor="text-green-400"
            glowColor="rgba(34,197,94,0.7)"
          />

          <SideStat
            value={pendingCount.teams + pendingCount.vendors}
            labelTop="Pending"
            labelBottom="Verifications"
            icon={Clock}
            color="bg-yellow-600"
            iconColor="text-yellow-400"
            glowColor="rgba(234,179,8,0.7)"
          />
        </div>
      </div>

      {/* ================= QUICK ACTION ================= */}
      <QuickAction />
    </div>
  );
}
