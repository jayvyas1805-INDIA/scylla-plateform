import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";

const colors = {
  EV: "#3b82f6",    // blue
  SUV: "#22c55e",   // green
  Sedan: "#f97316", // orange
  Truck: "#ef4444", // red
};

const dataSet = {
  "All Workspaces": {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 32 },
      { name: "SUV", value: 28 },
      { name: "Sedan", value: 25 },
      { name: "Truck", value: 15 },
    ],
  },
};

export default function VendorVehicleTypeChart({ workspace, dateRange }) {
  const data =
    dataSet[workspace]?.[dateRange] ||
    dataSet["All Workspaces"]["01/01/2023 - 05/31/2023"];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      <h3 className="text-sm font-semibold text-white mb-4">
        Vehicle Types ({workspace})
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data.map((d, idx) => ({ ...d, rank: `#${idx + 1}` }))}
            dataKey="value"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={colors[d.name]} />
            ))}
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox;
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-sm font-semibold"
                  >
                    Total {total}
                  </text>
                );
              }}
            />
          </Pie>
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
          <Legend
            verticalAlign="bottom"
            align="center"
            iconSize={10}
            formatter={(value, entry, idx) => (
              <span className="text-xs text-gray-300">
                #{idx + 1} {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Total summary card */}
      <div className="mt-5">
        <div className="rounded-lg p-4 text-center bg-violet-900/40 ring-1 ring-violet-700">
          <p className="text-xs text-violet-300">Total Vehicles</p>
          <p className="text-xl font-bold text-white">{total}</p>
        </div>
      </div>
    </div>
  );
}
