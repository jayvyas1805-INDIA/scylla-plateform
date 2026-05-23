import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";

const dataSet = [
  { name: "R8 Formula", value: 30 },
  { name: "KT-01 Karting", value: 28 },
  { name: "BL-03 Baja", value: 24 },
  { name: "MT-02 Moto", value: 18 },
];

export default function VendorTopVehicles() {
  const total = dataSet.reduce((sum, d) => sum + d.value, 0);

  // Distinct colors per vehicle type
  const colors = {
    "R8 Formula": "#3b82f6", // blue
    "KT-01 Karting": "#22c55e", // green
    "BL-03 Baja": "#f97316", // orange
    "MT-02 Moto": "#ef4444", // red
  };

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      <h3 className="text-sm font-semibold text-white mb-4">
        Top Performing Vehicles
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={dataSet.map((d, idx) => ({ ...d, rank: `#${idx + 1}` }))}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis type="number" stroke="#9ca3af" />
          <YAxis
            dataKey="name"
            type="category"
             width={120}          // ✅ reserve space
            interval={0} 
            stroke="#9ca3af"
            tickFormatter={(val, idx) => `${idx + 1}. ${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            formatter={(val, name) => [
              `${val} (${((val / total) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 6, 6]}
            barSize={22}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {dataSet.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={colors[entry.name]}
                className="transition-transform duration-300 hover:scale-105"
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(val, props) =>
                `${val} (${((val / total) * 100).toFixed(1)}%)`
              }
              style={{ fill: "#f9fafb", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {Object.entries(colors).map(([name, color], idx) => (
          <div key={name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            ></span>
            <p className="text-xs text-gray-300">
              #{idx + 1} {name}
            </p>
          </div>
        ))}
      </div>

      {/* Total summary card */}
      <div className="mt-5">
        <div className="rounded-lg p-4 text-center bg-violet-900/40 ring-1 ring-violet-700">
          <p className="text-xs text-violet-300">Total Engagement</p>
          <p className="text-xl font-bold text-white">{total}</p>
        </div>
      </div>
    </div>
  );
}
