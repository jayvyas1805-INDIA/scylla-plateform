import clsx from "clsx";
import { useEffect, useState } from "react";

export default function ProfileRow({
  index,
  name,
  type,
  views,
  color,
  icon: Icon,
  iconColor,
  glowColor,
}) {
  const [count, setCount] = useState(0);
  const viewValue = views ?? 0;
  const viewText = String(viewValue);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(viewText.replace(/[^0-9.]/g, ""));
    if (isNaN(end)) return;

    const duration = 1500;
    const stepTime = 16;
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
  }, [viewText]);

  const formattedViews = viewText.includes("K")
    ? `${count}${viewText.replace(/[^A-Za-z]/g, "")}`
    : count.toLocaleString();

  const hoverBgMap = {
    "bg-admin-accent/10": "hover:bg-admin-accent/20",
    "bg-pink-500/10": "hover:bg-pink-500/20",
    "bg-green-500/10": "hover:bg-green-500/20",
    "bg-yellow-500/10": "hover:bg-yellow-500/20",
  };

  const hoverMap = {
    "text-admin-accent": "group-hover:text-admin-accent",
    "text-pink-400": "group-hover:text-pink-400",
    "text-green-400": "group-hover:text-green-400",
    "text-yellow-400": "group-hover:text-yellow-400",
  };

  const hoverBg = hoverBgMap[color];
  const hoverColor = hoverMap[iconColor];

  return (
    <div
      style={{ "--tw-neon": glowColor }}
      className={clsx(
  "relative group flex items-start justify-between gap-3 p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]",
  color,
  hoverBg
)}

    >
      {/* Aura glow only visible on hover */}
      <div
        className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-50 pointer-events-none group-hover:animate-neonPulse transition-opacity duration-300"
        style={{ backgroundColor: glowColor }}
      ></div>

      {/* Foreground content */}
      <div className="relative z-10 flex min-w-0 flex-1 items-start gap-3">
        {/* Number box */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
          <span
            className={clsx(
              "font-bold text-sm transition-colors duration-300",
              iconColor,
              hoverColor
            )}
          >
            {index}
          </span>
        </div>

        {/* Icon box */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
          <Icon
            className={clsx(
              "w-5 h-5 transition-colors duration-300",
              iconColor,
              hoverColor
            )}
          />
        </div>

        {/* Name + type */}
        <div className="min-w-0 flex-1">
          <div
            className={clsx(
              "break-words text-white font-semibold transition-colors duration-300",
              hoverColor
            )}
          >
            {name}
          </div>
          <div className="text-xs text-white/70">{type}</div>
        </div>
      </div>

      {/* Views */}
      <div className="relative z-10 shrink-0 pt-1 text-right">
        <span
          className={clsx(
            "font-semibold text-sm transition-colors duration-300",
            iconColor,
            hoverColor
          )}
        >
          {formattedViews}
        </span>
        <span className="text-xs text-white/60">views</span>
      </div>
    </div>
  );
}
