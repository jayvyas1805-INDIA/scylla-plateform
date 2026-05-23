import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddVendorModal from './AddVendorModal';
import toast from 'react-hot-toast';

const initialVendorTypes = [
  { id: 1, title: 'Tyre Supplier', description: 'Racing tyres and wheel gun hardware', count: 13, status: 'Active' },
  { id: 2, title: 'Fabrication Workshop', description: 'Custom chassis and frame construction', count: 10, status: 'Active' },
  { id: 3, title: 'CAD / Design Service', description: '3D modeling and engineering design', count: 8, status: 'Active' },
  { id: 4, title: 'Telemetry Provider', description: 'Data acquisition and analysis services', count: 6, status: 'Inactive' },
  { id: 5, title: 'Safety Equipment Supplier', description: 'Racing suits, helmets, and safety gear', count: 21, status: 'Active' },
];

const statusStyles = {
  Active: 'bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]',
  Inactive: 'bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
  Draft: 'bg-yellow-500/10 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
};

const VendorTypeSection = () => {
  const [items, setItems] = useState(initialVendorTypes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const handleSave = (data) => {
    if (editing) {
      setItems(prev => prev.map(i => (i.id === editing.id ? { ...data, id: editing.id } : i)));
    } else {
      setItems(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggleStatus = (id) => {
    setItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        const next =
          i.status === 'Active'
            ? 'Inactive'
            : i.status === 'Inactive'
            ? 'Draft'
            : 'Active';
        toast.success(`Status changed to ${next}`);
        return { ...i, status: next };
      })
    );
  };

  return (
    <section className="bg-[#0c1016] border border-white/10 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.6)]">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Vendor Type</h2>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
        >
          <Plus size={14} />
          Add Vendor Type
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Vendors</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-medium text-white">{item.title}</td>
                <td className="px-4 py-3 text-gray-400">{item.description}</td>
                <td className="px-4 py-3 text-center text-cyan-400 font-semibold">{item.count}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusStyles[item.status]} hover:brightness-125`}
                  >
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => { setEditing(item); setModalOpen(true); }}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <AddVendorModal
          initialData={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

export default VendorTypeSection;
