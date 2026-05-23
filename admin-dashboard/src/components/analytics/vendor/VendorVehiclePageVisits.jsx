import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

const colors = {
  EV: "#3b82f6",    // blue
  SUV: "#22c55e",   // green
  Sedan: "#f97316", // orange
  Truck: "#ef4444", // red
};

const visits = {
  "All Workspaces": {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 2100 },
      { name: "SUV", value: 1900 },
      { name: "Sedan", value: 1600 },
      { name: "Truck", value: 1200 },
    ],
  },
};

export default function VendorVehiclePageVisits({ workspace, dateRange }) {
  const data =
    visits[workspace]?.[dateRange] ||
    visits["All Workspaces"]["01/01/2023 - 05/31/2023"];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      <h3 className="text-sm font-semibold text-white mb-4">
        Vehicle Page Visits
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
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
            radius={[6, 6, 0, 0]}
            barSize={30}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={colors[d.name]} // distinct color per bar
                className="transition-transform duration-300 hover:scale-105"
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val) => `${val} (${((val / total) * 100).toFixed(1)}%)`}
              style={{ fill: "#f9fafb", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend with ranks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {data.map((d, idx) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: colors[d.name] }}
            ></span>
            <p className="text-xs text-gray-300">
              #{idx + 1} {d.name}
            </p>
          </div>
        ))}
      </div>

      {/* Total summary card */}
      <div className="mt-5">
        <div className="rounded-lg p-4 text-center bg-violet-900/40 ring-1 ring-violet-700">
          <p className="text-xs text-violet-300">Total Visits</p>
          <p className="text-xl font-bold text-white">{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
