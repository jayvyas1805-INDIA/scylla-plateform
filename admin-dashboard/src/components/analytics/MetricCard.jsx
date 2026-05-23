import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MetricCard({ title, value, delta, icon: Icon }) {
  // Decide delta color and icon based on whether it's positive or negative
  const isPositive = delta?.includes("+");
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-slate-900 rounded-2xl p-6
                 border border-slate-700
                 shadow-[0_0_25px_rgba(59,130,246,0.25)]
                 transition-transform duration-200 flex flex-col gap-2"
    >
      {/* Title + Metric Icon */}
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
        <p className="text-gray-400 text-sm">{title}</p>
      </div>

      {/* Value */}
      <h2 className="text-2xl font-bold mt-1 text-white">{value}</h2>

      {/* Delta */}
      <div
        className={`flex items-center gap-1 mt-1 text-sm font-medium ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        <DeltaIcon size={16} />
        <span>{delta}</span>
      </div>
    </motion.div>
  );
}
