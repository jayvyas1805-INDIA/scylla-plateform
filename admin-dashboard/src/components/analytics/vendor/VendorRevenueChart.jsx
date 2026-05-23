import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const vendorRevenue = {
  "All Workspaces": {
    "01/01/2023 - 05/31/2023": [
      { month: "Jan", value: 5200 },
      { month: "Feb", value: 6100 },
      { month: "Mar", value: 7000 },
      { month: "Apr", value: 7800 },
      { month: "May", value: 8500 },
    ],
  },
};

export default function VendorRevenueChart({ workspace, dateRange }) {
  const [chartType, setChartType] = useState("line"); // toggle state

  const data =
    vendorRevenue[workspace]?.[dateRange] ||
    vendorRevenue["All Workspaces"]["01/01/2023 - 05/31/2023"];

  const start = data[0].value;
  const end = data[data.length - 1].value;
  const growth = (((end - start) / start) * 100).toFixed(1);
  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      {/* Header with growth badge + toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          Vendor Revenue ({workspace})
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setChartType("line")}
            className={`px-2 py-1 text-xs rounded-md ${
              chartType === "line"
                ? "bg-violet-700 text-white"
                : "bg-slate-700 text-gray-300"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-2 py-1 text-xs rounded-md ${
              chartType === "bar"
                ? "bg-violet-700 text-white"
                : "bg-slate-700 text-gray-300"
            }`}
          >
            Bars
          </button>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              growth >= 0
                ? "bg-green-900/40 text-green-400"
                : "bg-red-900/40 text-red-400"
            }`}
          >
            {growth >= 0 ? (
              <TrendingUp size={14} className="text-green-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span>
              {growth >= 0 ? `+${growth}% since Jan` : `${growth}% since Jan`}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        {chartType === "line" ? (
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              formatter={(val) => `$${val.toLocaleString()}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#colorRevenue)"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2, fill: "#111827" }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
              isAnimationActive={true}
              animationDuration={1200}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              formatter={(val) => `$${val.toLocaleString()}`}
            />
            <Bar
              dataKey="value"
              fill="url(#barRevenue)"
              radius={[6, 6, 0, 0]}
              barSize={40}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <defs>
              <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Mini-cards for each month */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
        {data.map((d, idx) => {
          const prev = idx > 0 ? data[idx - 1].value : d.value;
          const change = d.value - prev;
          const isGrowth = change > 0;
          const isDecline = change < 0;
          const contribution = ((d.value / totalRevenue) * 100).toFixed(1);

          return (
            <div
              key={idx}
              className={`rounded-lg p-3 text-center ring-1 transform transition duration-300 hover:scale-105 ${
                isGrowth
                  ? "bg-green-900/40 ring-green-700 hover:shadow-green-500/30"
                  : isDecline
                  ? "bg-red-900/40 ring-red-700 hover:shadow-red-500/30"
                  : "bg-slate-800 ring-slate-700 hover:shadow-slate-500/30"
              }`}
            >
              <p className="text-xs text-slate-400">{d.month}</p>
              <p className="text-lg font-semibold text-white">
                ${d.value.toLocaleString()}
              </p>
              <p
                className={`text-xs font-medium ${
                  isGrowth
                    ? "text-green-400"
                    : isDecline
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              >
                {isGrowth
                  ? `+${change.toLocaleString()}`
                  : isDecline
                  ? `${change.toLocaleString()}`
                  : "0"}
              </p>
              <p className="text-xs text-violet-300 mt-1">
                {contribution}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Cumulative total card */}
      <div className="mt-5">
        <div className="rounded-lg p-4 text-center bg-violet-900/40 ring-1 ring-violet-700">
          <p className="text-xs text-violet-300">Total Revenue</p>
          <p className="text-xl font-bold text-white">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
