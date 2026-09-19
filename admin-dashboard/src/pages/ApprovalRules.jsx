import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Trash2, Plus } from "lucide-react";
import {
  getApprovalRules,
  createApprovalRule,
  updateApprovalRule,
  deleteApprovalRule,
} from "../api/admin.api";

// Lets an admin author the checklist that the AI document review checks
// team/vendor verificationDocs against (see backend/utils/aiDocumentReview.js
// and ai-service/app/document_review/). Editing rules here does NOT
// re-run any existing AI verdicts — it only changes what future
// uploads/re-uploads get checked against, in keeping with "the model
// runs once per document, never on read".
export default function ApprovalRules() {
  const [docType, setDocType] = useState("team");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRuleText, setNewRuleText] = useState("");
  const [newRuleMandatory, setNewRuleMandatory] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRules = async (type) => {
    setLoading(true);
    try {
      const res = await getApprovalRules(type);
      setRules(res.data.rules || []);
    } catch (err) {
      console.error("Failed to load approval rules", err);
      toast.error("Could not load checklist rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules(docType);
  }, [docType]);

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    setSaving(true);
    try {
      await createApprovalRule({
        docType,
        ruleText: newRuleText.trim(),
        mandatory: newRuleMandatory,
      });
      setNewRuleText("");
      setNewRuleMandatory(true);
      await loadRules(docType);
      toast.success("Rule added.");
    } catch (err) {
      console.error("Failed to create rule", err);
      toast.error("Could not add rule.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      await updateApprovalRule(rule._id, { active: !rule.active });
      setRules((prev) =>
        prev.map((r) => (r._id === rule._id ? { ...r, active: !r.active } : r))
      );
    } catch (err) {
      console.error("Failed to update rule", err);
      toast.error("Could not update rule.");
    }
  };

  const handleToggleMandatory = async (rule) => {
    try {
      await updateApprovalRule(rule._id, { mandatory: !rule.mandatory });
      setRules((prev) =>
        prev.map((r) => (r._id === rule._id ? { ...r, mandatory: !r.mandatory } : r))
      );
    } catch (err) {
      console.error("Failed to update rule", err);
      toast.error("Could not update rule.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rule?")) return;
    try {
      await deleteApprovalRule(id);
      setRules((prev) => prev.filter((r) => r._id !== id));
      toast.success("Rule deleted.");
    } catch (err) {
      console.error("Failed to delete rule", err);
      toast.error("Could not delete rule.");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-admin-accent" size={22} />
        <div>
          <h1 className="text-xl font-semibold text-white">Approval Checklist</h1>
          <p className="text-white/60 text-sm">
            Rules the AI reviewer checks verification documents against before
            suggesting approve/reject on the Approvals page.
          </p>
        </div>
      </div>

      {/* doc type tabs */}
      <div className="flex gap-2">
        {["team", "vendor"].map((type) => (
          <button
            key={type}
            onClick={() => setDocType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              docType === type
                ? "bg-admin-accent text-black"
                : "bg-admin-surface-raised text-white/70 hover:text-white"
            }`}
          >
            {type} rules
          </button>
        ))}
      </div>

      {/* add rule form */}
      <form
        onSubmit={handleAddRule}
        className="bg-admin-bg border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          value={newRuleText}
          onChange={(e) => setNewRuleText(e.target.value)}
          placeholder={`e.g. "Document must clearly show a valid ${
            docType === "team" ? "university ID number" : "GST number"
          }"`}
          className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-3 py-2 outline-none"
        />
        <label className="flex items-center gap-2 text-white/70 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={newRuleMandatory}
            onChange={(e) => setNewRuleMandatory(e.target.checked)}
          />
          Mandatory
        </label>
        <button
          type="submit"
          disabled={saving || !newRuleText.trim()}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-admin-accent text-black font-semibold text-sm disabled:opacity-50"
        >
          <Plus size={16} /> Add rule
        </button>
      </form>

      {/* rules list */}
      <div className="bg-admin-bg border border-gray-800 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-admin-surface-raised border-b border-gray-800 text-sm text-admin-accent/90 font-medium">
          <div className="col-span-6">Rule</div>
          <div className="col-span-2">Mandatory</div>
          <div className="col-span-2">Active</div>
          <div className="col-span-2">Actions</div>
        </div>

        {loading ? (
          <div className="px-6 py-6 text-white/60 text-center">Loading…</div>
        ) : rules.length === 0 ? (
          <div className="px-6 py-6 text-white/60 text-center">
            No rules yet for {docType} documents — add one above.
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule._id}
              className="grid md:grid-cols-12 gap-y-2 items-center px-6 py-4 border-t border-gray-800"
            >
              <div className="md:col-span-6 text-white text-sm">{rule.ruleText}</div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-white/70 text-sm">
                  <input
                    type="checkbox"
                    checked={rule.mandatory}
                    onChange={() => handleToggleMandatory(rule)}
                  />
                  Mandatory
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-white/70 text-sm">
                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => handleToggleActive(rule)}
                  />
                  Active
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
