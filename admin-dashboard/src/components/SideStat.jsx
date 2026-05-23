import { useEffect, useState } from "react";

export default function SideStat({ value, labelTop, labelBottom, icon: Icon, color, iconColor, glowColor }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10); // final value
    if (isNaN(end)) return;

    const duration = 1500; // animation duration in ms
    const stepTime = 16;   // ~60fps
    const increment = end / (duration / stepTime);

    function step() {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(step);
  }, [value]);

  return (
    <div
      className={`bg-black p-4 rounded-xl shadow-glow flex justify-between items-center transition duration-200 transform hover:scale-[1.02] hover:animate-pulse-glow`}
      style={{ '--glow-color': glowColor }}
    >
      {/* Value and two-line label */}
      <div className="flex flex-col items-start">
        <span className="text-2xl font-bold text-white">{count}</span>
        <div className="text-xs leading-tight">
          <div className={`${iconColor} font-medium`}>{labelTop}</div>
          <div className="text-white/60">{labelBottom}</div>
        </div>
      </div>

      {/* Icon box with pulse glow */}
      <div
        className={`p-2 rounded-lg transition-transform hover:scale-110 ${color} hover:animate-pulse-glow`}
        style={{ '--glow-color': glowColor }}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  );
}
