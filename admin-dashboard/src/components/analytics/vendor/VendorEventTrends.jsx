import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

const data = [
  { month: "Jan", events: 6 },
  { month: "Feb", events: 8 },
  { month: "Mar", events: 10 },
  { month: "Apr", events: 12 },
  { month: "May", events: 14 },
];

export default function VendorEventTrends() {
  const start = data[0].events;
  const end = data[data.length - 1].events;
  const growth = (((end - start) / start) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      {/* Header with growth badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-white">
            Event Performance Trends
          </h3>
        </div>
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
          <span>{growth >= 0 ? `+${growth}% since Jan` : `${growth}% since Jan`}</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
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
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Area
            type="monotone"
            dataKey="events"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorEvents)"
            dot={{ r: 4, stroke: "#8b5cf6", strokeWidth: 2, fill: "#1f2937" }}
            activeDot={{ r: 6, fill: "#8b5cf6" }}
            isAnimationActive={true}
            animationDuration={1200}
            animationBegin={200}
          />
          <defs>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>

      {/* Color-coded mini-cards with hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
        {data.map((d, idx) => {
          const prev = idx > 0 ? data[idx - 1].events : d.events;
          const change = d.events - prev;
          const isGrowth = change > 0;
          const isDecline = change < 0;

          return (
            <div
              key={idx}
              className={`rounded-lg p-3 text-center ring-1 transform transition duration-300 hover:scale-105 hover:shadow-lg ${
                isGrowth
                  ? "bg-green-900/40 ring-green-700 hover:shadow-green-500/30"
                  : isDecline
                  ? "bg-red-900/40 ring-red-700 hover:shadow-red-500/30"
                  : "bg-slate-800 ring-slate-700 hover:shadow-slate-500/30"
              }`}
            >
              <p className="text-xs text-slate-400">{d.month}</p>
              <p className="text-lg font-semibold text-white">{d.events}</p>
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
                  ? `+${change}`
                  : isDecline
                  ? `${change}`
                  : "0"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
