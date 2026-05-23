import { useState, useEffect } from "react";

export default function CreateMemberModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    certifications: "",
    training: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.description) {
      alert("Name, Role, and Description are required.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f1524] p-6 rounded-xl w-full max-w-xl space-y-4 border border-white/10 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-cyan-400">
            {initialData ? "Edit Member" : "Create Member"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 rounded bg-[#11182b] text-white"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#11182b] text-white"
        >
          <option value="">Select Role</option>
          <option>Driver</option>
          <option>Engineer</option>
          <option>Crew</option>
          <option>Designer</option>
          <option>Manager</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full p-2 rounded bg-[#11182b] text-white"
        />

        <input
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
          placeholder="Certifications"
          className="w-full p-2 rounded bg-[#11182b] text-white"
        />

        <input
          name="training"
          value={form.training}
          onChange={handleChange}
          placeholder="Training"
          className="w-full p-2 rounded bg-[#11182b] text-white"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
