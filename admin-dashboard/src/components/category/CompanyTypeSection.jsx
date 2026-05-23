import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddVendorModal from './AddVendorModal';
import toast from 'react-hot-toast';

const initialCompanies = [
  { id: 1, title: 'Private Limited (Pvt Ltd)', description: 'Registered private limited company', count: 36, status: 'Active' },
  { id: 2, title: 'Limited (Ltd)', description: 'Public limited company structure', count: 25, status: 'Active' },
  { id: 3, title: 'LLP', description: 'Limited liability partnership', count: 18, status: 'Active' },
  { id: 4, title: 'Proprietorship', description: 'Sole proprietor business', count: 10, status: 'Active' },
  { id: 5, title: 'Individual / Freelancer', description: 'Independent service provider', count: 9, status: 'Active' },
];

const statusStyles = {
  Active: 'bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]',
  Disabled: 'bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
  Draft: 'bg-yellow-500/10 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
};

const CompanyTypeSection = () => {
  const [items, setItems] = useState(initialCompanies);
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
            ? 'Disabled'
            : i.status === 'Disabled'
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
        <h2 className="text-sm font-semibold text-white">Company Type</h2>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
        >
          <Plus size={14} />
          Add Company Type
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Company Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Active Vendors</th>
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

export default CompanyTypeSection;
