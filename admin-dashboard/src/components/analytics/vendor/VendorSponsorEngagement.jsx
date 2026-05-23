import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Line,
  LabelList,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

const data = [
  { name: "Profile Clicks", value: 280, growth: 12 },
  { name: "Inquiries", value: 130, growth: -5 },
  { name: "Downloads", value: 70, growth: 8 },
];

export default function VendorSponsorEngagement() {
  const colors = ["#3b82f6", "#22c55e", "#facc15"];

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-green-400" />
        <h3 className="text-sm font-semibold text-white">
          Sponsor Interest & Engagement
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            formatter={(val, name, props) => [
              `${val} (${props.payload.growth > 0 ? "+" : ""}${props.payload.growth}%)`,
              name,
            ]}
          />
          <Bar
            dataKey="value"
            barSize={40}
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                className="transition-transform duration-300 hover:scale-105"
              />
            ))}
            {/* Raw value inside bar */}
            <LabelList
              dataKey="value"
              position="insideTop"
              offset={10}
              style={{
                fill: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                textShadow: "0 0 2px rgba(0,0,0,0.6)",
              }}
            />
            {/* Growth percentage above bar */}
            <LabelList
              dataKey="growth"
              position="top"
              offset={20}
              formatter={(val) => `${val > 0 ? "+" : ""}${val}%`}
              style={{
                fill: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                textShadow: "0 0 3px rgba(0,0,0,0.8)",
              }}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 4, fill: "#f97316" }}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mt-5 text-center">
        {data.map((d, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-3 ring-1 flex flex-col items-center transform transition duration-300 hover:scale-105 ${
              d.growth >= 0
                ? "bg-green-900/40 ring-green-700 hover:shadow-green-500/30"
                : "bg-red-900/40 ring-red-700 hover:shadow-red-500/30"
            }`}
          >
            <p className="text-xs text-slate-400">{d.name}</p>
            <p className="text-lg font-semibold text-white">{d.value}</p>
            <div className="flex items-center gap-1 text-xs mt-1">
              {d.growth >= 0 ? (
                <TrendingUp size={14} className="text-green-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span
                className={`font-medium ${
                  d.growth >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {d.growth >= 0 ? `+${d.growth}%` : `${d.growth}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
