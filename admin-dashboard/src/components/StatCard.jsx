import { useEffect, useState } from "react";

export default function StatCard({ icon: Icon, title, value, bar, iconBg, titleColor, hoverGlow }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Handle numbers with decimals or currency symbols
    const numericValue = parseFloat((value ?? "").toString().replace(/[^0-9.]/g, ""));
    const end = isNaN(numericValue) ? 0 : numericValue;

    const duration = 1500; // ms
    const stepTime = 16;   // ~60fps
    const increment = end / (duration / stepTime);

    function step() {
      start += increment;
      if (start < end) {
        setCount(end % 1 !== 0 ? parseFloat(start.toFixed(1)) : Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(step);
  }, [value]);

  // Preserve original formatting (e.g. ₹2.4M)
  const formattedValue = value?.toString().includes("₹")
    ? `₹${count}${value.replace(/[^A-Za-z]/g, "")}`
    : count;

  return (
    <div
      className={`bg-black rounded-xl p-5 shadow-glow relative h-[130px] 
                  transition-transform duration-300 hover:scale-105 ${hoverGlow}`}
    >
      {/* Icon top-left */}
      <div className={`${iconBg} p-2 rounded-lg w-fit`}>
        <Icon className="text-white" size={16} />
      </div>

      {/* Value and Title top-right */}
      <div className="absolute top-6 right-5 text-right">
        <p className="text-xl font-semibold text-white">{formattedValue}</p>
        <p className={`text-xs mt-1 ${titleColor}`}>{title}</p>
      </div>

      {/* Progress bar bottom */}
      <div className="absolute bottom-2 left-5 right-5 h-[3px] bg-gray-800 rounded-full">
        <div className={`${bar} h-[3px] rounded-full w-3/4`} />
      </div>
    </div>
  );
}
