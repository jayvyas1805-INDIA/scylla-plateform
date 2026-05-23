import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Car, Handshake, CalendarCheck } from "lucide-react";

// Team/Admin components
import MetricCard from "../components/analytics/MetricCard";
import RevenueChart from "../components/analytics/RevenueChart";
import VehicleTypeChart from "../components/analytics/VehicleTypeChart";
import VehiclePageVisits from "../components/analytics/VehiclePageVisits";
import TopVehicles from "../components/analytics/TopVehicles";
import SponsorEngagement from "../components/analytics/SponsorEngagement";
import EventTrends from "../components/analytics/EventTrends";
import InsightsPanel from "../components/analytics/InsightsPanel";

// Vendor components
import VendorRevenueChart from "../components/analytics/vendor/VendorRevenueChart";
import VendorVehicleTypeChart from "../components/analytics/vendor/VendorVehicleTypeChart";
import VendorVehiclePageVisits from "../components/analytics/vendor/VendorVehiclePageVisits";
import VendorTopVehicles from "../components/analytics/vendor/VendorTopVehicles";
import VendorSponsorEngagement from "../components/analytics/vendor/VendorSponsorEngagement";
import VendorEventTrends from "../components/analytics/vendor/VendorEventTrends";
import VendorInsightsPanel from "../components/analytics/vendor/VendorInsightsPanel";

// Skeleton loading card
function SkeletonCard() {
  return (
    <div className="bg-gray-200 rounded-xl p-6 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-4"></div>
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("Team");
  const [workspace, setWorkspace] = useState("All Workspaces");
  const [dateRange, setDateRange] = useState("01/01/2023 - 01/31/2023");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [workspace, dateRange]);

  // =================== TEAM DATA ===================
  const revenueData = {
    "All Workspaces": {
      "01/01/2023 - 01/31/2023": [
        ["Jan", 8000],
        ["Feb", 9500],
      ],
      "01/01/2023 - 05/31/2023": [
        ["Jan", 8000],
        ["Feb", 9500],
        ["Mar", 11000],
        ["Apr", 12500],
        ["May", 13800],
      ],
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": [
        ["Jan", 6000],
        ["Feb", 7200],
        ["Mar", 8500],
      ],
    },
  };

  const vehicleVisitsData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["EV", 2400],
        ["SUV", 1800],
        ["Sedan", 1500],
        ["Truck", 1200],
      ],
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": [
        ["EV", 3000],
        ["SUV", 2000],
        ["Sedan", 1200],
        ["Truck", 800],
      ],
    },
  };

  const topVehiclesData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["R8 Formula", "34%"],
        ["KT-01 Karting", "26%"],
        ["BL-03 Baja", "22%"],
        ["MT-02 Moto", "18%"],
      ],
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": [
        ["KT-01 Karting", "40%"],
        ["R8 Formula", "30%"],
        ["MT-02 Moto", "20%"],
        ["BL-03 Baja", "10%"],
      ],
    },
  };

  // =================== ADMIN DATA ===================
  const adminRevenueData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["Jan", 10000],
        ["Feb", 12000],
        ["Mar", 13000],
        ["Apr", 14500],
        ["May", 15000],
      ],
    },
  };

  const adminVehicleVisitsData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["EV", 2800],
        ["SUV", 2000],
        ["Sedan", 1800],
        ["Truck", 1400],
      ],
    },
  };

  const adminTopVehiclesData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["R8 Formula", "35%"],
        ["KT-01 Karting", "25%"],
        ["BL-03 Baja", "25%"],
        ["MT-02 Moto", "15%"],
      ],
    },
  };

  // =================== EXPORT FUNCTIONS ===================
  const handleExportCSV = () => {
    const rows = [["Section", "Metric", "Value", "Notes"]];

    if (tab === "Vendor") {
      rows.push(["Metrics", "Active Vendor Views", "9,412", "+5.1%"]);
      rows.push(["Metrics", "Catalog Visits", "6,038", "+4.3%"]);
      rows.push(["Metrics", "Vendor Inquiries", "128", "+3.8%"]);
      rows.push(["Metrics", "Participation", "19", "+2.0%"]);
    } else if (tab === "Admin") {
      rows.push(["Metrics", "Active Admin Views", "14,562", "+6.5%"]);
      rows.push(["Metrics", "Vehicle Page Visits", "9,000", "+5.2%"]);
      rows.push(["Metrics", "Sponsor Interest", "200", "+3.8%"]);
      rows.push(["Metrics", "Event Participation", "30", "+2.5%"]);

      const rev = adminRevenueData[workspace]?.[dateRange] || [];
      rev.forEach(([month, value]) => rows.push(["RevenueChart", month, value, ""]));

      const visits = adminVehicleVisitsData[workspace]?.[dateRange] || [];
      visits.forEach(([name, value]) => rows.push(["VehiclePageVisits", name, value, ""]));

      const top = adminTopVehiclesData[workspace]?.[dateRange] || [];
      top.forEach(([name, pct]) => rows.push(["TopVehicles", name, pct, ""]));
    } else {
      rows.push(["Metrics", "Active Views", "12,847", "+8.2%"]);
      rows.push(["Metrics", "Vehicle Page Visits", "8,234", "+6.1%"]);
      rows.push(["Metrics", "Sponsor Interest", "156", "+4.5%"]);
      rows.push(["Metrics", "Event Participation", "23", "+2.1%"]);

      const rev = revenueData[workspace]?.[dateRange] || [];
      rev.forEach(([month, value]) => rows.push(["RevenueChart", month, value, ""]));

      const visits = vehicleVisitsData[workspace]?.[dateRange] || [];
      visits.forEach(([name, value]) => rows.push(["VehiclePageVisits", name, value, ""]));

      const top = topVehiclesData[workspace]?.[dateRange] || [];
      top.forEach(([name, pct]) => rows.push(["TopVehicles", name, pct, ""]));
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${tab}_${workspace}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-gray-900 bg-white min-h-screen px-6 py-8"
    >
      {/* PAGE TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 text-sm mt-1">
          Workspace: <span className="text-blue-600">{workspace}</span> | Date Range:{" "}
          <span className="text-blue-600">{dateRange}</span>
        </p>
      </motion.div>

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        {/* Filter Box */}
        <div className="bg-gray-100 text-gray-900 px-6 py-4 rounded-xl ring-1 ring-gray-300 shadow w-full max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold">Workspace:</label>
            <select
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className="bg-white text-gray-900 rounded-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Workspaces</option>
              <option>Marketing</option>
              <option>Engineering</option>
              <option>Sales</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white text-gray-900 rounded-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>01/01/2023 - 01/31/2023</option>
              <option>02/01/2023 - 02/28/2023</option>
              <option>03/01/2023 - 03/31/2023</option>
              <option>01/01/2023 - 05/31/2023</option>
            </select>
          </div>
        </div>

        {/* Export Box */}
        <div className="bg-gray-100 text-gray-900 px-6 py-4 rounded-xl ring-1 ring-gray-300 shadow">
          <h3 className="text-sm font-semibold mb-3">Export Data</h3>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="btn-secondary">
              CSV
            </button>
            <button onClick={handleExportPDF} className="btn-primary flex gap-2">
              <Download size={16} /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-300">
        {["Team", "Vendor", "Admin"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 ${
              tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : tab === "Vendor" ? (
          <>
            <MetricCard title="Active Vendor Views" value="9,412" delta="+5.1%" icon={Eye} />
            <MetricCard title="Catalog Visits" value="6,038" delta="+4.3%" icon={Car} />
            <MetricCard title="Vendor Inquiries" value="128" delta="+3.8%" icon={Handshake} />
            <MetricCard title="Participation" value="19" delta="+2.0%" icon={CalendarCheck} />
          </>
        ) : tab === "Admin" ? (
          <>
            <MetricCard title="Active Admin Views" value="14,562" delta="+6.5%" icon={Eye} />
            <MetricCard title="Vehicle Page Visits" value="9,000" delta="+5.2%" icon={Car} />
            <MetricCard title="Sponsor Interest" value="200" delta="+3.8%" icon={Handshake} />
            <MetricCard title="Event Participation" value="30" delta="+2.5%" icon={CalendarCheck} />
          </>
        ) : (
          <>
            <MetricCard title="Active Views" value="12,847" delta="+8.2%" icon={Eye} />
            <MetricCard title="Vehicle Page Visits" value="8,234" delta="+6.1%" icon={Car} />
            <MetricCard title="Sponsor Interest" value="156" delta="+4.5%" icon={Handshake} />
            <MetricCard title="Event Participation" value="23" delta="+2.1%" icon={CalendarCheck} />
          </>
        )}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid xl:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : tab === "Vendor" ? (
          <>
            <VendorRevenueChart workspace={workspace} dateRange={dateRange} />
            <VendorVehicleTypeChart workspace={workspace} dateRange={dateRange} />
          </>
        ) : (
          <>
            <RevenueChart
              workspace={workspace}
              dateRange={dateRange}
              data={tab === "Admin" ? adminRevenueData : revenueData}
            />
            <VehicleTypeChart workspace={workspace} dateRange={dateRange} />
          </>
        )}
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid xl:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : tab === "Vendor" ? (
          <>
            <VendorVehiclePageVisits workspace={workspace} dateRange={dateRange} />
            <VendorTopVehicles workspace={workspace} dateRange={dateRange} />
          </>
        ) : (
          <>
            <VehiclePageVisits
              workspace={workspace}
              dateRange={dateRange}
              data={tab === "Admin" ? adminVehicleVisitsData : vehicleVisitsData}
            />
            <TopVehicles
              workspace={workspace}
              dateRange={dateRange}
              data={tab === "Admin" ? adminTopVehiclesData : topVehiclesData}
            />
          </>
        )}
      </div>

      {/* PANELS */}
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : tab === "Vendor" ? (
        <>
          <VendorSponsorEngagement workspace={workspace} dateRange={dateRange} />
          <VendorEventTrends workspace={workspace} dateRange={dateRange} />
          <VendorInsightsPanel workspace={workspace} dateRange={dateRange} />
        </>
      ) : (
        <>
          <SponsorEngagement workspace={workspace} dateRange={dateRange} />
          <EventTrends workspace={workspace} dateRange={dateRange} />
          <InsightsPanel workspace={workspace} dateRange={dateRange} />
        </>
      )}
    </motion.div>
  );
}
