import { Car, Rocket, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VendorInsightsPanel() {
  const insights = [
    {
      icon: Car,
      title: "EV listings generate the highest vendor engagement.",
      detail: "Electric vehicles consistently outperform other categories in vendor interest.",
      color: "from-blue-500 to-blue-700",
      pulse: "animate-[pulse-blue_2s_ease-in-out_infinite]",
    },
    {
      icon: Rocket,
      title: "Product launches significantly boost inquiries.",
      detail: "Launch weeks show a 2x spike in vendor inquiries across all categories.",
      color: "from-pink-500 to-pink-700",
      pulse: "animate-[pulse-pink_2s_ease-in-out_infinite]",
    },
    {
      icon: BarChart3,
      title: "SUV demand is strong in Marketing workspace.",
      detail: "SUV listings received 34% more views than other vehicle types.",
      color: "from-yellow-500 to-yellow-700",
      pulse: "animate-[pulse-yellow_2s_ease-in-out_infinite]",
    },
  ];

  const [visible, setVisible] = useState([]);

  useEffect(() => {
    insights.forEach((_, idx) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, idx]);
      }, idx * 300); // staggered fade-in
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-gray-800 rounded-xl p-5 text-gray-200">
      <h3 className="text-sm font-semibold text-white mb-4">Smart Insights</h3>
      <div className="space-y-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 ring-1 ring-slate-700 transform transition duration-500 ${
              visible.includes(idx)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            {/* Icon with gradient background + color-adaptive pulse */}
            <div
              className={`p-2 rounded-md bg-gradient-to-br ${item.color} flex items-center justify-center ${item.pulse}`}
            >
              <item.icon size={18} className="text-white" />
            </div>
            {/* Text content */}
            <div>
              <p className="text-sm font-semibold text-gray-100">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
