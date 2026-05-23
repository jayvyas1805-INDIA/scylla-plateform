import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  Legend
} from "recharts";
import { useState } from "react";

const allData = {
  "All Workspaces": [
    { month: "Q1", formula: 8, baja: 2, karting: 5, moto: 4 },
    { month: "Q2", formula: 6, baja: 4, karting: 3, moto: 4 },
    { month: "Q3", formula: 5, baja: 4, karting: 3, moto: 4 },
    { month: "Q4", formula: 4, baja: 2, karting: 3, moto: 4 },
  ],
  Marketing: [
    { month: "Q1", formula: 10, baja: 3, karting: 7, moto: 3 },
    { month: "Q2", formula: 6, baja: 5, karting: 8, moto: 5 },
    { month: "Q3", formula: 7, baja: 5, karting: 6, moto: 4 },
    { month: "Q4", formula: 5, baja: 3, karting: 7, moto: 4 },
  ],
  Engineering: [
    { month: "Q1", formula: 6, baja: 2, karting: 5, moto: 2 },
    { month: "Q2", formula: 4, baja: 3, karting: 6, moto: 3 },
    { month: "Q3", formula: 5, baja: 3, karting: 5, moto: 3 },
    { month: "Q4", formula: 3, baja: 2, karting: 4, moto: 2 },
  ],
  Sales: [
    { month: "Q1", formula: 7, baja: 4, karting: 8, moto: 6 },
    { month: "Q2", formula: 6, baja: 5, karting: 7, moto: 5 },
    { month: "Q3", formula: 8, baja: 5, karting: 9, moto: 7 },
    { month: "Q4", formula: 7, baja: 4, karting: 8, moto: 6 },
  ],
};

function filterByDateRange(data, dateRange) {
  if (dateRange.includes("01/01/2023 - 01/31/2023")) {
    return data.filter(d => d.month === "Q1");
  }
  if (dateRange.includes("02/01/2023 - 02/28/2023")) {
    return data.filter(d => d.month === "Q1");
  }
  if (dateRange.includes("03/01/2023 - 03/31/2023")) {
    return data.filter(d => d.month === "Q1");
  }
  if (dateRange.includes("01/01/2023 - 05/31/2023")) {
    return data.filter(d => ["Q1", "Q2"].includes(d.month));
  }
  return data;
}

export default function EventTrends({ workspace, dateRange }) {
  const baseData = allData[workspace] || allData["All Workspaces"];
  const data = filterByDateRange(baseData, dateRange);

  // Totals
  const totals = data.reduce(
    (acc, d) => ({
      formula: acc.formula + d.formula,
      baja: acc.baja + d.baja,
      karting: acc.karting + d.karting,
      moto: acc.moto + d.moto,
    }),
    { formula: 0, baja: 0, karting: 0, moto: 0 }
  );

  // Toggle state
  const [visible, setVisible] = useState({
    formula: true,
    baja: true,
    karting: true,
    moto: true,
  });

  const toggleLine = (key) => {
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Event Participation Trends ({workspace}, {dateRange})
      </h3>

      {/* Summary Boxes with Toggles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => toggleLine("formula")}
          className={`rounded-xl p-3 ring-1 ring-slate-700 text-left ${
            visible.formula ? "bg-slate-800" : "bg-slate-700 opacity-50"
          }`}
        >
          <div className="text-sm text-slate-400">Formula Events</div>
          <div className="text-xl font-semibold text-blue-400">{totals.formula}</div>
        </button>
        <button
          onClick={() => toggleLine("baja")}
          className={`rounded-xl p-3 ring-1 ring-slate-700 text-left ${
            visible.baja ? "bg-slate-800" : "bg-slate-700 opacity-50"
          }`}
        >
          <div className="text-sm text-slate-400">BAJA Events</div>
          <div className="text-xl font-semibold text-cyan-400">{totals.baja}</div>
        </button>
        <button
          onClick={() => toggleLine("karting")}
          className={`rounded-xl p-3 ring-1 ring-slate-700 text-left ${
            visible.karting ? "bg-slate-800" : "bg-slate-700 opacity-50"
          }`}
        >
          <div className="text-sm text-slate-400">Karting Events</div>
          <div className="text-xl font-semibold text-purple-400">{totals.karting}</div>
        </button>
        <button
          onClick={() => toggleLine("moto")}
          className={`rounded-xl p-3 ring-1 ring-slate-700 text-left ${
            visible.moto ? "bg-slate-800" : "bg-slate-700 opacity-50"
          }`}
        >
          <div className="text-sm text-slate-400">Moto Events</div>
          <div className="text-xl font-semibold text-orange-400">{totals.moto}</div>
        </button>
      </div>

      {/* Line Chart */}
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
          {visible.formula && (
            <Line type="monotone" dataKey="formula" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          )}
          {visible.baja && (
            <Line type="monotone" dataKey="baja" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
          )}
          {visible.karting && (
            <Line type="monotone" dataKey="karting" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} />
          )}
          {visible.moto && (
            <Line type="monotone" dataKey="moto" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
