import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";

const allData = {
  "All Workspaces": {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 2400 },
      { name: "SUV", value: 1800 },
      { name: "Sedan", value: 1500 },
      { name: "Truck", value: 1200 },
    ],
  },
  Marketing: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 3000 },
      { name: "SUV", value: 2000 },
      { name: "Sedan", value: 1200 },
      { name: "Truck", value: 800 },
    ],
  },
  Engineering: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 1800 },
      { name: "SUV", value: 1600 },
      { name: "Sedan", value: 1400 },
      { name: "Truck", value: 1000 },
    ],
  },
  Sales: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 2600 },
      { name: "SUV", value: 2200 },
      { name: "Sedan", value: 1700 },
      { name: "Truck", value: 1300 },
    ],
  },
};

// Shared color palette
const vehicleColors = {
  EV: "#3b82f6",     // Blue
  SUV: "#22c55e",    // Green
  Sedan: "#f97316",  // Orange
  Truck: "#ef4444",  // Red
};

export default function VehiclePageVisits({ workspace, dateRange }) {
  const currentData =
    (allData[workspace] && allData[workspace][dateRange]) ||
    allData["All Workspaces"]["01/01/2023 - 05/31/2023"];

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Vehicle Page Visits ({workspace}, {dateRange})
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Legend />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {currentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={vehicleColors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
