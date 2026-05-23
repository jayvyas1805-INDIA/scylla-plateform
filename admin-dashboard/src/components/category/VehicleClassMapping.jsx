import React from "react";

const defaultMappings = {
  "Go-Kart": { discipline: "Karting", subtype: "Sprint Racing" },
  mBAJA: { discipline: "Off-Road", subtype: "Endurance Racing" },
  eBAJA: { discipline: "Off-Road", subtype: "Endurance Racing" },
  aBAJA: { discipline: "Off-Road", subtype: "Autonomous Challenge" },
  Formula: { discipline: "Circuit Racing", subtype: "Formula Racing" },
  SUPRA: { discipline: "GT Racing", subtype: "Circuit Racing" },
};

export default function VehicleClassMapping({ classes }) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xs font-semibold text-white mb-3">
        Vehicle Class — Motorsport Mapping
      </h3>

      <div className="grid md:grid-cols-2 gap-3">
        {classes.map((c) => {
          const map = defaultMappings[c.name] || {
            discipline: c.type,
            subtype: c.type,
          };
          return (
            <div
              key={c.id}
              className="flex items-center justify-between bg-[#0f141b] border border-white/10 rounded-md px-4 py-2"
            >
              <div className="text-xs">
                <div className="text-white font-medium">{c.name}</div>
                <div className="text-gray-400">{c.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10">
                  {map.discipline}
                </span>
                <span className="text-[11px] px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10">
                  {map.subtype}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
