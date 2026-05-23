import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

// Example datasets for different workspaces
const allData = {
  "All Workspaces": [
    { month: "Jan", value: 8000 },
    { month: "Feb", value: 9500 },
    { month: "Mar", value: 11000 },
    { month: "Apr", value: 12500 },
    { month: "May", value: 13800 },
    { month: "Jun", value: 15000 },
  ],
  Marketing: [
    { month: "Jan", value: 6000 },
    { month: "Feb", value: 7200 },
    { month: "Mar", value: 8500 },
    { month: "Apr", value: 9700 },
    { month: "May", value: 11000 },
    { month: "Jun", value: 12000 },
  ],
  Engineering: [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 5000 },
    { month: "Mar", value: 6200 },
    { month: "Apr", value: 7000 },
    { month: "May", value: 7800 },
    { month: "Jun", value: 8500 },
  ],
  Sales: [
    { month: "Jan", value: 7000 },
    { month: "Feb", value: 8200 },
    { month: "Mar", value: 9500 },
    { month: "Apr", value: 10800 },
    { month: "May", value: 12000 },
    { month: "Jun", value: 13500 },
  ],
};

// Helper: filter data by dateRange
function filterByDateRange(data, dateRange) {
  if (dateRange.includes("01/01/2023 - 01/31/2023")) {
    return data.filter(d => d.month === "Jan");
  }
  if (dateRange.includes("02/01/2023 - 02/28/2023")) {
    return data.filter(d => d.month === "Feb");
  }
  if (dateRange.includes("03/01/2023 - 03/31/2023")) {
    return data.filter(d => d.month === "Mar");
  }
  if (dateRange.includes("01/01/2023 - 05/31/2023")) {
    return data.filter(d => ["Jan", "Feb", "Mar", "Apr", "May"].includes(d.month));
  }
  return data;
}

export default function RevenueChart({ workspace, dateRange }) {
  const baseData = allData[workspace] || allData["All Workspaces"];
  const data = filterByDateRange(baseData, dateRange);

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Profile Views Over Time ({workspace}, {dateRange})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
