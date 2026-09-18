import { useState } from "react";
import { createAdminTeam, createAdminVendor } from "../api/admin.api";

const emptyForm = { name: "", businessName: "", email: "" };

export default function AdminAccountCreateModal({ type, onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isTeam = type === "team";

  const update = (field) => (event) => {
    const value = event.target.type === "file" ? event.target.files?.[0] || null : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData();
    const fields = isTeam ? ["name", "email"] : ["businessName", "email"];
    fields.forEach((field) => data.append(field, form[field]));
    data.append("status", "approved");

    try {
      await (isTeam ? createAdminTeam(data) : createAdminVendor(data));
      onCreated();
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Account creation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center overflow-y-auto p-4 pt-[76px]">
      <div className={`admin-account-create-modal admin-account-create-modal--${type} w-[min(720px,100%)] max-h-[calc(100vh-92px)] overflow-y-auto rounded-xl border border-admin-border bg-admin-surface-raised p-6 text-admin-text`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-admin-accent">Send {isTeam ? "Team" : "Vendor"} Invitation</h2>
            <p className="text-xs text-admin-muted mt-1">Only an invitation will be sent. No account is created until the recipient completes registration.</p>
          </div>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">Close</button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <input className="admin-account-create-input" value={form[isTeam ? "name" : "businessName"]} onChange={update(isTeam ? "name" : "businessName")} placeholder={isTeam ? "Team name" : "Business name"} required />
          <input className="admin-account-create-input" value={form.email} onChange={update("email")} type="email" placeholder="Account email" required />
          <p className="text-xs text-admin-muted">A temporary password and default profile values will be generated automatically and sent to this email.</p>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-admin-accent text-black font-semibold disabled:opacity-60">{saving ? "Sending..." : `Send ${isTeam ? "Team" : "Vendor"} Invitation`}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
