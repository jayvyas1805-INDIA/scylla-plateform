import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { useState } from "react";

// Shared dataset
const allData = {
  "All Workspaces": {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 40 },
      { name: "SUV", value: 25 },
      { name: "Sedan", value: 20 },
      { name: "Truck", value: 15 },
    ],
  },
  Marketing: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 50 },
      { name: "SUV", value: 20 },
      { name: "Sedan", value: 15 },
      { name: "Truck", value: 15 },
    ],
  },
  Engineering: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 30 },
      { name: "SUV", value: 30 },
      { name: "Sedan", value: 25 },
      { name: "Truck", value: 15 },
    ],
  },
  Sales: {
    "01/01/2023 - 05/31/2023": [
      { name: "EV", value: 35 },
      { name: "SUV", value: 30 },
      { name: "Sedan", value: 20 },
      { name: "Truck", value: 15 },
    ],
  },
};

// Consistent color palette
const vehicleColors = {
  EV: "#3b82f6",     // Blue
  SUV: "#22c55e",    // Green
  Sedan: "#f97316",  // Orange
  Truck: "#ef4444",  // Red
};

export default function VehicleTypeChart({ workspace, dateRange }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const currentData =
    (allData[workspace] && allData[workspace][dateRange]) ||
    allData["All Workspaces"]["01/01/2023 - 05/31/2023"];

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Vehicle Types ({workspace}, {dateRange})
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={currentData}
            innerRadius={70}
            outerRadius={100}
            activeIndex={activeIndex}
            activeShape={(props) => (
              <g>
                <text
                  x={props.cx}
                  y={props.cy}
                  dy={-10}
                  textAnchor="middle"
                  fill="#fff"
                  className="text-sm"
                >
                  {props.payload.name}
                </text>
                <text
                  x={props.cx}
                  y={props.cy}
                  dy={10}
                  textAnchor="middle"
                  fill="#9CA3AF"
                  className="text-xs"
                >
                  {props.payload.value}%
                </text>
                <Pie
                  data={[props.payload]}
                  cx={props.cx}
                  cy={props.cy}
                  innerRadius={70}
                  outerRadius={110} // expand slice on hover
                  dataKey="value"
                >
                  <Cell fill={props.fill} />
                </Pie>
              </g>
            )}
            dataKey="value"
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {currentData.map((entry, i) => (
              <Cell key={i} fill={vehicleColors[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#D1D5DB" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
