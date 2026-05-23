import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Layers,
  Car,
  Flag,
  Box,
  Disc,
  Wrench,
  Shield,
} from "lucide-react";

/* ---------- STATUS TEXT ---------- */
function StatusText({ status }) {
  const styles = {
    "edit or delete": "text-emerald-400",
    Active: "text-emerald-400",
    Disabled: "text-gray-500",
  };

  return <span className={`text-sm font-medium ${styles[status]}`}>{status}</span>;
}

export default function CategoryManagement() {
  const tabs = [
    { name: "Vendor Categories", icon: Layers, active: true },
    { name: "Vehicle Classes", icon: Car },
    { name: "Motorsport Disciplines", icon: Flag },
    { name: "Product Categories", icon: Box },
  ];

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([
    {
      icon: Disc,
      iconBg: "bg-blue-500/15 text-blue-400",
      category: "Tyres",
      description: "Racing tyres and wheel components",
      vendors: "24 vendors",
      status: "edit or delete",
      updated: "2 days ago",
    },
    {
      icon: Wrench,
      iconBg: "bg-purple-500/15 text-purple-400",
      category: "Fabrication",
      description: "Custom fabrication and manufacturing",
      vendors: "18 vendors",
      status: "Active",
      updated: "5 days ago",
    },
    {
      icon: Shield,
      iconBg: "bg-green-500/15 text-green-400",
      category: "Safety Equipment",
      description: "Racing safety gear and equipment",
      vendors: "32 vendors",
      status: "Disabled",
      updated: "1 week ago",
    },
  ]);

  /* ---------- MODAL STATE ---------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  /* ---------- ADD CATEGORY ---------- */
  const handleAdd = () => {
    setNewCategory({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newCategory.name) return;

    setRows([
      ...rows,
      {
        icon: Layers,
        iconBg: "bg-cyan-500/15 text-cyan-400",
        category: newCategory.name,
        description: newCategory.description || "No description",
        vendors: "0 vendors",
        status: "Active",
        updated: "Just now",
      },
    ]);
    setIsModalOpen(false);
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (index) => {
    const name = prompt("Edit category:", rows[index].category);
    if (!name) return;

    const updated = [...rows];
    updated[index].category = name;
    updated[index].updated = "Just now";
    setRows(updated);
  };

  /* ---------- DELETE ---------- */
  const handleDelete = (index) => {
    if (!confirm("Delete this category?")) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  /* ---------- SEARCH ---------- */
  const filteredRows = rows.filter((row) =>
    row.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Category Management</h1>
          <p className="text-sm text-gray-400">Manage platform classifications</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add New Category
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#0b1220] p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 mb-3 text-white focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 mb-4 text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap border
              ${
                tab.active
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-[#0b1220] border-[#1e2a45] text-gray-300"
              }`}
          >
            <tab.icon size={14} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full bg-[#0b1220] border border-[#1e2a45] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-gradient-to-b from-[#0b1220] to-[#060b16] border border-[#1e2a45] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a] text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Vendors</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => (
              <tr key={i} className="border-t border-[#1e2a45]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 font-medium">
                    <span className={`p-2 rounded-md ${row.iconBg}`}>
                      <row.icon size={14} />
                    </span>
                    {row.category}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{row.description}</td>
                <td className="px-4 py-3">{row.vendors}</td>
                <td className="px-4 py-3">
                  <StatusText status={row.status} />
                </td>
                <td className="px-4 py-3 text-gray-400">{row.updated}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="p-2 rounded-md text-blue-400 hover:bg-blue-500/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="p-2 rounded-md text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {filteredRows.map((row, i) => (
          <div key={i} className="border border-[#1e2a45] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`p-2 rounded-md ${row.iconBg}`}>
                <row.icon size={14} />
              </span>
              <h3 className="font-medium">{row.category}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">{row.description}</p>
            <div className="flex justify-between text-sm mb-2">
              <span>{row.vendors}</span>
              <StatusText status={row.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{row.updated}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="p-2 text-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="p-2 text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
