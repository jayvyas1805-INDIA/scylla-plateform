import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Edit, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../api/admin.api";

const tabs = [
  { id: "vendor-categories", label: "Vendor Categories" },
  { id: "vehicle-classes", label: "Vehicle Classes" },
  { id: "motorsport-disciplines", label: "Motorsport Disciplines" },
];

const kindOptions = {
  "vendor-categories": [
    ["vendor-type", "Vendor Type"],
    ["company-type", "Company Type"],
    ["vendor-nature", "Vendor Nature"],
  ],
  "vehicle-classes": [["vehicle-class", "Vehicle Class"]],
  "motorsport-disciplines": [["motorsport-discipline", "Motorsport Discipline"]],
};

const kindLabel = (kind) => kindOptions["vendor-categories"].concat(
  kindOptions["vehicle-classes"],
  kindOptions["motorsport-disciplines"]
).find(([value]) => value === kind)?.[1] || kind;

const emptyForm = { name: "", description: "", kind: "vendor-type", status: "ACTIVE" };

function CategoryModal({ category, group, onClose, onSave }) {
  const [form, setForm] = useState(category ? {
    name: category.name,
    description: category.description || "",
    kind: category.kind,
    status: category.status,
  } : { ...emptyForm, kind: kindOptions[group][0][0] });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, group, name: form.name.trim(), description: form.description.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-white/10 bg-admin-surface-raised p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-white">{category ? "Edit Category" : "Add Category"}</h2><button type="button" onClick={onClose} aria-label="Close category dialog" className="text-white/50 hover:text-white"><X size={18} /></button></div>
        <div className="space-y-3">
          {!category && <label className="block text-sm text-white/70">Category type<select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-admin-bg px-3 py-2 text-white outline-none">{kindOptions[group].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
          <label className="block text-sm text-white/70">Name<input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-admin-bg px-3 py-2 text-white outline-none focus:border-admin-accent" required /></label>
          <label className="block text-sm text-white/70">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-24 w-full resize-y rounded-lg border border-white/10 bg-admin-bg px-3 py-2 text-white outline-none focus:border-admin-accent" /></label>
          <label className="block text-sm text-white/70">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-admin-bg px-3 py-2 text-white outline-none"><option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option></select></label>
        </div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin" />}Save</button></div>
      </form>
    </div>
  );
}

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState("vendor-categories");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCategories(activeTab);
      setCategories(response.data.categories || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) => `${category.name} ${category.description} ${kindLabel(category.kind)}`.toLowerCase().includes(query));
  }, [categories, search]);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const saveCategory = async (data) => {
    try {
      if (editing) {
        await updateCategory(editing._id, { name: data.name, description: data.description, status: data.status });
        toast.success("Category updated");
      } else {
        await createCategory(data);
        toast.success("Category created");
      }
      closeModal();
      await loadCategories();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Unable to save category");
      throw requestError;
    }
  };

  const toggleStatus = async (category) => {
    try {
      await updateCategory(category._id, { status: category.status === "ACTIVE" ? "DISABLED" : "ACTIVE" });
      toast.success(`Category ${category.status === "ACTIVE" ? "disabled" : "activated"}`);
      await loadCategories();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Unable to change category status");
    }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try {
      await deleteCategory(category._id);
      toast.success("Category deleted");
      await loadCategories();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Unable to delete category");
    }
  };

  return (
    <div className="space-y-6 px-4 py-4 md:px-6 lg:px-8">
      <div className="rounded-xl border border-white/10 bg-admin-surface p-6 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold text-white">Category Management</h1><p className="mt-1 text-sm text-white/50">Manage persisted platform classifications used by Scylla Motorsport.</p></div><button onClick={() => { setEditing(null); setModalOpen(true); }} className="inline-flex w-fit items-center gap-2 rounded-lg bg-admin-accent px-3 py-2 text-sm font-medium text-white hover:bg-admin-accent-dark"><Plus size={16} /> Add Category</button></div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-admin-surface p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(""); }} className={`rounded-lg px-3 py-2 text-sm ${activeTab === tab.id ? "bg-admin-accent text-black font-semibold" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>{tab.label}</button>)}</div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-2.5 text-white/40" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." className="w-full rounded-lg border border-white/10 bg-admin-bg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-admin-accent" /></div></div>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-admin-surface shadow-[0_0_25px_rgba(0,0,0,0.6)]">
        {loading ? <div className="flex min-h-48 items-center justify-center text-white/50"><Loader2 className="mr-2 animate-spin" size={18} /> Loading categories...</div> : error ? <div className="p-6 text-sm text-red-300">{error}</div> : visibleCategories.length === 0 ? <div className="p-8 text-center text-sm text-white/50">No categories found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-black/30 text-xs uppercase tracking-wide text-white/45"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Description</th><th className="px-4 py-3 text-center">Used</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 text-center">Actions</th></tr></thead><tbody>{visibleCategories.map((category) => <tr key={category._id} className="border-t border-white/10 hover:bg-white/[0.03]"><td className="px-4 py-3 font-medium text-white">{category.name}</td><td className="px-4 py-3 text-xs text-admin-accent">{kindLabel(category.kind)}</td><td className="max-w-sm px-4 py-3 text-white/55">{category.description || "No description"}</td><td className="px-4 py-3 text-center text-white/70">{category.usageCount}</td><td className="px-4 py-3 text-center"><button onClick={() => toggleStatus(category)} className={`rounded-full px-2.5 py-1 text-xs ${category.status === "ACTIVE" ? "bg-green-500/15 text-green-300" : "bg-white/10 text-white/45"}`}>{category.status === "ACTIVE" ? "Active" : "Disabled"}</button></td><td className="px-4 py-3"><div className="flex justify-center gap-2"><button onClick={() => { setEditing(category); setModalOpen(true); }} aria-label={`Edit ${category.name}`} className="rounded-md p-2 text-admin-accent hover:bg-admin-accent/10"><Edit size={15} /></button><button onClick={() => removeCategory(category)} aria-label={`Delete ${category.name}`} className="rounded-md p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>}
      </section>

      {modalOpen && <CategoryModal category={editing} group={activeTab} onClose={closeModal} onSave={saveCategory} />}
    </div>
  );
}
