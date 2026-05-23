import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Package,
  Activity,
  Shield,
  Hammer,
  PenTool,
  HelpCircle,
} from "lucide-react";
import AddVendorModal from "./AddVendorModal";
import toast from "react-hot-toast";

// Helper: pick icon based on title keywords
const getIconForNature = (title) => {
  const lower = title.toLowerCase();

  if (lower.includes("service")) return Briefcase;
  if (lower.includes("product")) return Package;
  if (lower.includes("telemetry")) return Activity;
  if (lower.includes("safety")) return Shield;
  if (lower.includes("fabrication") || lower.includes("workshop")) return Hammer;
  if (lower.includes("design") || lower.includes("cad")) return PenTool;

  return HelpCircle; // fallback icon
};

const initialNature = [
  {
    id: 1,
    title: "Service-Based Vendor",
    description:
      "Vendors offering professional services such as design, fabrication, and telemetry analysis.",
    count: 54,
    status: true,
  },
  {
    id: 2,
    title: "Product-Based Vendor",
    description: "Physical goods and equipment suppliers",
    count: 39,
    status: false,
  },
  {
    id: 3,
    title: "Telemetry Provider",
    description: "Data acquisition and analysis systems",
    count: 12,
    status: true,
  },
  {
    id: 4,
    title: "Safety Equipment Supplier",
    description: "Racing suits, helmets, and safety gear",
    count: 31,
    status: true,
  },
  {
    id: 5,
    title: "Fabrication Workshop",
    description: "Custom chassis and frame fabrication",
    count: 18,
    status: true,
  },
  {
    id: 6,
    title: "CAD / Design Service",
    description: "3D modeling and engineering design",
    count: 8,
    status: true,
  },
];

export default function VendorNatureSection() {
  const [items, setItems] = useState(initialNature);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = (data) => {
    const Icon = getIconForNature(data.title);
    if (editing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editing.id ? { ...data, id: editing.id, icon: Icon } : i
        )
      );
      toast.success("Vendor Nature updated");
    } else {
      setItems((prev) => [
        ...prev,
        { ...data, id: Date.now(), status: true, icon: Icon },
      ]);
      toast.success("Vendor Nature added");
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.error("Vendor Nature deleted");
  };

  const toggleStatus = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: !i.status } : i
      )
    );
    toast.success("Status toggled");
  };

  return (
    <section className="bg-[#0c1016] border border-white/10 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)]">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Vendor Nature</h2>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
        >
          <Plus size={14} />
          Add Vendor Nature
        </button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {items.map((item) => {
          const Icon = item.icon || getIconForNature(item.title);
          return (
            <div
              key={item.id}
              className={`rounded-lg p-4 border border-white/10 transition shadow-md ${
                item.status ? "bg-[#11161e]" : "bg-[#1a1f27] opacity-60"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`w-10 h-5 rounded-full flex items-center ${
                    item.status ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transform transition ${
                      item.status ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-2">{item.description}</p>
              <p className="text-xs text-cyan-400 font-semibold">
                Active Vendors: {item.count}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditing(item);
                    setModalOpen(true);
                  }}
                  className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:bg-red-500/10 p-1.5 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <AddVendorModal
          initialData={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
