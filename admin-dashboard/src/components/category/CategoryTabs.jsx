import React from "react";
import { Layers, Car, Flag } from "lucide-react";

const tabs = [
  { id: "vendor-categories", label: "Vendor Categories", icon: Layers },
  { id: "vehicle-classes", label: "Vehicle Classes", icon: Car },
  { id: "motorsport-disciplines", label: "Motorsport Disciplines", icon: Flag },
];

const CategoryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-[#0c1016] border border-white/10 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)] p-4 flex flex-wrap gap-2 mb-6">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition
              ${
                activeTab === t.id
                  ? "bg-cyan-400 text-black font-semibold"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Icon size={16} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
