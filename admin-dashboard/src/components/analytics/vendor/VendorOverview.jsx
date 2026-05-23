// src/components/vendor/VendorOverview.jsx

import { useState, useEffect } from "react";

// Cards
import MetricCard from "./MetricCard";

// Charts & Panels
import EventTrends from "./VendorEventTrends";
import InsightsPanel from "./VendorInsightsPanel";
import RevenueChart from "./VendorRevenueChart";
import SponsorEngagement from "./VendorSponsorEngagement";
import TopVehicles from "./VendorTopVehicles";
import VehiclePageVisits from "./VendorVehiclePageVisits";
import VehicleTypeChart from "./VendorVehicleTypeChart";

// Icons
import { TrendingUp, Users, Car, Handshake } from "lucide-react";

export default function VendorOverview() {
  const [workspace, setWorkspace] = useState("All Workspaces");
  const [dateRange, setDateRange] = useState("01/01/2023 - 05/31/2023");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in animations after mount
    setMounted(true);
  }, []);

  return (
    <div className="p-6 space-y-8 text-white bg-gradient-to-br from-[#0B1220] to-[#111827] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>

        <div className="flex gap-3">
          {/* Workspace Selector */}
          <select
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 transition"
          >
            <option>All Workspaces</option>
            <option>Marketing</option>
            <option>Engineering</option>
            <option>Sales</option>
          </select>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 transition"
          >
            <option>01/01/2023 - 01/31/2023</option>
            <option>02/01/2023 - 02/28/2023</option>
            <option>03/01/2023 - 03/31/2023</option>
            <option>01/01/2023 - 05/31/2023</option>
          </select>
        </div>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <MetricCard
          title="Profile Views"
          value="15,284"
          delta="+12.4%"
          icon={TrendingUp}
        />
        <MetricCard
          title="Event Participation"
          value="428"
          delta="+6.1%"
          icon={Users}
        />
        <MetricCard
          title="Vehicles Listed"
          value="18"
          delta="-1.3%"
          icon={Car}
        />
        <MetricCard
          title="Sponsor Leads"
          value="96"
          delta="+9.8%"
          icon={Handshake}
        />
      </div>

      {/* ================= CHART ROW ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart workspace={workspace} dateRange={dateRange} />
        <EventTrends workspace={workspace} dateRange={dateRange} />
      </div>

      {/* ================= INSIGHTS ================= */}
      <InsightsPanel workspace={workspace} dateRange={dateRange} />

      {/* ================= ENGAGEMENT ================= */}
      <SponsorEngagement workspace={workspace} dateRange={dateRange} />

      {/* ================= VEHICLES ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TopVehicles workspace={workspace} dateRange={dateRange} />
        <VehiclePageVisits workspace={workspace} dateRange={dateRange} />
        <VehicleTypeChart workspace={workspace} dateRange={dateRange} />
      </div>
    </div>
  );
}
