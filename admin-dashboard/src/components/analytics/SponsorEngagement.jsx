import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine
} from "recharts";
import { useState } from "react";

export default function SponsorEngagement({ workspace, dateRange }) {
  // Example datasets
  const data = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": {
        views: 12847,
        clicks: 342,
        inquiries: 156,
        downloads: 89,
        messages: [
          "We’re interested in partnership opportunities.",
          "Can you share more details about sponsorship tiers?",
          "Looking forward to collaborating on Q2 events."
        ]
      },
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": {
        views: 12847,
        clicks: 200,
        inquiries: 80,
        downloads: 40,
        messages: [
          "Marketing team wants to discuss campaign sponsorship.",
          "Request for ad placement details."
        ]
      },
    },
    Engineering: {
      "01/01/2023 - 05/31/2023": {
        views: 12847,
        clicks: 150,
        inquiries: 60,
        downloads: 30,
        messages: [
          "Engineering group asked about technical sponsorship.",
          "Inquiry about developer tool integration."
        ]
      },
    },
    Sales: {
      "01/01/2023 - 05/31/2023": {
        views: 12847,
        clicks: 250,
        inquiries: 100,
        downloads: 50,
        messages: [
          "Sales team requested sponsorship pricing.",
          "Follow-up on lead generation opportunities."
        ]
      },
    },
  };

  const current =
    (data[workspace] && data[workspace][dateRange]) ||
    data["All Workspaces"]["01/01/2023 - 05/31/2023"];

  // Diverging chart data: positive values go right, negative values go left
  const funnelData = [
    { name: "Site Views", value: current.views },
    { name: "Profile Clicks", value: -current.clicks },
    { name: "Inquiries", value: current.inquiries },
    { name: "Downloads", value: -current.downloads },
  ];

  const colors = ["#64748b", "#3b82f6", "#22c55e", "#facc15"];

  // Modal state
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full bg-slate-900 text-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Sponsor Interest & Engagement ({workspace}, {dateRange})
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          View Sponsor Messages
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 text-center gap-6 mb-6">
        <div>
          <p className="text-2xl font-bold text-slate-400">{current.views.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Site Views</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">{current.clicks}</p>
          <p className="text-sm text-gray-400">Profile Clicks</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">{current.inquiries}</p>
          <p className="text-sm text-gray-400">Inquiries</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-400">{current.downloads}</p>
          <p className="text-sm text-gray-400">Downloads</p>
        </div>
      </div>

      {/* Diverging Funnel Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={funnelData}
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
          <Tooltip
            formatter={(val) => Math.abs(val)}
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Legend />
          {/* Middle reference line */}
          <ReferenceLine x={0} stroke="#9CA3AF" />
          <Bar dataKey="value" barSize={20}>
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Sponsor Messages</h2>
            <div className="space-y-3 text-sm text-slate-300 max-h-64 overflow-y-auto">
              {current.messages.map((msg, idx) => (
                <p key={idx}>📩 {msg}</p>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
