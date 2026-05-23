import { Eye, Edit, Trash2 } from "lucide-react";

const icons = {
  view: Eye,
  edit: Edit,
  delete: Trash2,
};

export default function ActionButton({ type, onClick }) {
  const Icon = icons[type];

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition
        ${type === "delete"
          ? "text-red-400 hover:bg-red-500/10"
          : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10"
        }`}
    >
      <Icon size={16} />
    </button>
  );
}
