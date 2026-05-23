import {
  TrendingUp,
  Car,
  Handshake
} from "lucide-react";
import { useState } from "react";

export default function InsightsPanel({ workspace, dateRange }) {
  const insights = {
    "All Workspaces": {
      "01/01/2023 - 01/31/2023": [
        {
          icon: TrendingUp,
          category: "Formula",
          title: "Profile views increased by 18% after the last Formula event",
          detail: "Consider participating in more Formula events to boost visibility",
        },
        {
          icon: Car,
          category: "Vehicle",
          title: "Vehicle 'RX-01' generated the highest interest this month",
          detail: "34.6% of all vehicle page visits - showcase more technical details",
        },
        {
          icon: Handshake,
          category: "Sponsor",
          title: "Sponsor interactions peaked during Formula events",
          detail: "24.6% increase in sponsor inquiries - optimize sponsorship packages",
        },
      ],
      "01/01/2023 - 05/31/2023": [
        {
          icon: TrendingUp,
          category: "Formula",
          title: "Traffic grew steadily across Q1–Q2",
          detail: "Formula and Karting events drove consistent engagement",
        },
        {
          icon: Car,
          category: "Vehicle",
          title: "Karting generated highest sponsor interest",
          detail: "Highlight karting performance and vehicle specs",
        },
        {
          icon: Handshake,
          category: "Sponsor",
          title: "Volunteer engagement rose in Karting events",
          detail: "Consider expanding karting outreach programs",
        },
      ],
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": [
        {
          icon: TrendingUp,
          category: "Formula",
          title: "Marketing campaigns boosted Formula event visibility",
          detail: "Formula content received 18% more impressions",
        },
        {
          icon: Handshake,
          category: "Sponsor",
          title: "Karting ads drove sponsor interest",
          detail: "Optimize ad placement for karting segments",
        },
      ],
    },
    Engineering: {
      "01/01/2023 - 05/31/2023": [
        {
          icon: Car,
          category: "Vehicle",
          title: "Engineering team contributed to EV sponsor growth",
          detail: "EV prototypes gained traction in Q2",
        },
        {
          icon: TrendingUp,
          category: "Formula",
          title: "Formula prototypes drew technical interest",
          detail: "Highlight engineering specs in future showcases",
        },
      ],
    },
    Sales: {
      "01/01/2023 - 05/31/2023": [
        {
          icon: Handshake,
          category: "Sponsor",
          title: "Sales outreach increased event participation",
          detail: "Formula and Karting events saw 22% more signups",
        },
        {
          icon: Car,
          category: "Vehicle",
          title: "Karting demos converted sponsor leads",
          detail: "Follow up with karting sponsors post-event",
        },
      ],
    },
  };

  const currentInsights =
    (insights[workspace] && insights[workspace][dateRange]) ||
    insights["All Workspaces"]["01/01/2023 - 01/31/2023"];

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? currentInsights
    : currentInsights.filter(i => i.category === activeCategory);

  const categories = ["All", "Formula", "Vehicle", "Sponsor"];

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Smart Insights & Highlights ({workspace}, {dateRange})
      </h3>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full ring-1 ${
              activeCategory === cat
                ? "bg-blue-600 text-white ring-blue-400"
                : "bg-slate-800 text-slate-300 ring-slate-700 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-800 rounded-xl p-4 ring-1 ring-slate-700 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            <div className="text-xs text-slate-400">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
