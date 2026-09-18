import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  Eye,
  FileWarning,
  History,
  Loader2,
  Search,
  X,
  XCircle,
} from "lucide-react";
import {
  approveModerationItem,
  fetchModerationItem,
  fetchModerationQueue,
  rejectModerationItem,
  requestModerationChanges,
} from "../../api/admin.api";

const typeOptions = [
  ["ALL", "All"],
  ["EVENT", "Events"],
  ["TEAM", "Teams"],
  ["VENDOR", "Vendors"],
  ["DRIVER", "Drivers"],
  ["ACTIVITY", "Activities"],
  ["MEDIA", "Media"],
];

const statusOptions = [
  ["ALL", "All statuses"],
  ["PENDING_REVIEW", "Pending Review"],
  ["AI_FLAGGED", "AI Flagged"],
  ["APPROVED", "Approved"],
  ["REJECTED", "Rejected"],
  ["CHANGES_REQUESTED", "Changes Requested"],
];

const statusStyles = {
  PENDING_REVIEW: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  AI_FLAGGED: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  APPROVED: "bg-green-500/15 text-green-300 border-green-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/30",
  CHANGES_REQUESTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

const labelForStatus = (status) => statusOptions.find(([value]) => value === status)?.[1] || status;
const formatDate = (date) => date ? new Date(date).toLocaleString() : "Not available";

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status] || "border-white/10 bg-white/5 text-white/70"}`}>
      {labelForStatus(status)}
    </span>
  );
}

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-admin-surface-raised p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${color}`}>{value}</p>
      </div>
      <Icon className={color} size={22} />
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="border-b border-white/10 py-3 last:border-0">
      <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
      <div className="mt-1 break-words text-sm text-white/85">{children || "Not available"}</div>
    </div>
  );
}

export default function ModerationQueuePanel() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ pendingReview: 0, aiFlagged: 0, approvedToday: 0, rejectedToday: 0 });
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadQueue = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchModerationQueue({ type, status, search: search.trim() || undefined });
      setItems(response.data.items || []);
      setSummary(response.data.summary || {});
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to load the moderation queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [type, status]);

  const openItem = async (item) => {
    setDetailLoading(true);
    try {
      const response = await fetchModerationItem(item.contentType, item.contentId);
      setSelected(response.data);
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Unable to load this submission.");
    } finally {
      setDetailLoading(false);
    }
  };

  const runDecision = async () => {
    if (!selected?.item || !decision) return;
    const text = reason.trim();
    if (!text) {
      toast.error(decision === "reject" ? "A rejection reason is required." : "Feedback is required.");
      return;
    }
    if (decision === "reject" && !window.confirm("Reject this submission?")) return;

    setActionLoading(true);
    try {
      if (decision === "reject") {
        await rejectModerationItem(selected.item.contentType, selected.item.contentId, text);
      } else {
        await requestModerationChanges(selected.item.contentType, selected.item.contentId, text);
      }
      toast.success(decision === "reject" ? "Submission rejected." : "Changes requested.");
      setDecision(null);
      setReason("");
      setSelected(null);
      await loadQueue();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "The moderation action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const approve = async (item) => {
    if (!window.confirm("Approve and publish this submission?")) return;
    setActionLoading(true);
    try {
      await approveModerationItem(item.contentType, item.contentId);
      toast.success("Submission approved and published.");
      setSelected(null);
      await loadQueue();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || "Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const entity = selected?.item?.entity;

  return (
    <div className="min-h-screen bg-admin-bg px-4 py-5 text-white sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-admin-accent">Scylla Motorsport</p>
          <h1 className="mt-1 text-2xl font-semibold">Event & Community Moderation</h1>
          <p className="mt-1 text-sm text-white/55">Review submitted events and community profiles before they go public.</p>
        </div>
        <button onClick={loadQueue} className="w-fit rounded-lg border border-white/10 px-3 py-2 text-sm text-white/75 hover:bg-white/5">
          Refresh queue
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Pending Review" value={summary.pendingReview || 0} icon={Clock3} color="text-yellow-300" />
        <SummaryCard label="AI Flagged" value={summary.aiFlagged || 0} icon={AlertTriangle} color="text-orange-300" />
        <SummaryCard label="Approved Today" value={summary.approvedToday || 0} icon={CheckCircle} color="text-green-300" />
        <SummaryCard label="Rejected Today" value={summary.rejectedToday || 0} icon={XCircle} color="text-red-300" />
      </div>

      <section className="rounded-xl border border-white/10 bg-admin-surface p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(([value, label]) => (
              <button key={value} onClick={() => setType(value)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${type === value ? "bg-admin-accent text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-2.5 text-white/40" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadQueue()} placeholder="Search title, team, vendor, ID..." className="w-full rounded-lg border border-white/10 bg-admin-bg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-admin-accent" />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-xs text-white/50" htmlFor="moderation-status">Status</label>
          <select id="moderation-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-white/10 bg-admin-bg px-3 py-2 text-sm text-white outline-none">
            {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <span className="text-xs text-white/45">{items.length} result{items.length === 1 ? "" : "s"}</span>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center text-white/50"><Loader2 className="mr-2 animate-spin" size={18} /> Loading moderation queue...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : items.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center text-center text-white/50"><FileWarning size={26} /><p className="mt-2">No submissions match these filters.</p></div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.contentType}-${item.contentId}`} className="grid gap-3 rounded-lg border border-white/10 bg-admin-bg p-4 lg:grid-cols-[100px_minmax(0,1fr)_150px_180px] lg:items-center">
                <span className="w-fit rounded-md bg-white/5 px-2 py-1 text-xs font-semibold text-admin-accent">{item.contentType}</span>
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-white">{item.title}</h2>
                  <p className="mt-1 truncate text-xs text-white/50">Submitted by {item.submittedBy?.name || "Unknown"} {item.submittedBy?.email ? `(${item.submittedBy.email})` : ""}</p>
                  <p className="mt-1 text-xs text-white/40">ID: {item.contentId} | {formatDate(item.createdAt)}</p>
                </div>
                <div className="flex flex-col items-start gap-1 lg:items-end"><StatusBadge status={item.status} /><span className="text-xs text-white/45">AI: {item.aiRisk === "UNKNOWN" ? "Unavailable" : item.aiRisk}</span></div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button onClick={() => openItem(item)} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/5"><Eye size={14} /> View</button>
                  <button onClick={() => approve(item)} disabled={actionLoading} className="rounded-md bg-green-500/15 px-2.5 py-1.5 text-xs text-green-300 hover:bg-green-500/25 disabled:opacity-50">Approve</button>
                  <button onClick={() => { setSelected({ item }); setDecision("reject"); }} className="rounded-md bg-red-500/15 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/25">Reject</button>
                  {item.contentType === "EVENT" && <button onClick={() => { setSelected({ item }); setDecision("changes"); }} className="rounded-md bg-blue-500/15 px-2.5 py-1.5 text-xs text-blue-300 hover:bg-blue-500/25">Request Changes</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {detailLoading && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"><Loader2 className="animate-spin text-admin-accent" /></div>}

      {selected?.item && !decision && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setSelected(null)}>
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-admin-surface p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-admin-accent">{selected.item.contentType}</p><h2 className="mt-1 text-xl font-semibold">{selected.item.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Close review panel" className="rounded-md p-1 text-white/50 hover:bg-white/5 hover:text-white"><X size={20} /></button></div>
            {entity?.posterUrl && <img src={entity.posterUrl} alt="Event poster" className="mb-5 max-h-56 w-full rounded-lg object-cover" />}
            <div className="mb-5 rounded-lg border border-white/10 bg-admin-bg p-3"><StatusBadge status={selected.item.status} /><p className="mt-2 text-xs text-white/50">AI risk: {selected.item.aiRisk === "UNKNOWN" ? "Unavailable" : `${selected.item.aiRisk} (${selected.item.aiConfidence ?? "-"}%)`}</p>{selected.item.aiIssues?.length > 0 && <p className="mt-1 text-xs text-orange-200">{selected.item.aiIssues.join(", ")}</p>}</div>
            <DetailRow label="Content ID">{selected.item.contentId}</DetailRow>
            <DetailRow label="Description">{selected.item.description}</DetailRow>
            <DetailRow label="Submitted by">{selected.item.submittedBy?.name} {selected.item.submittedBy?.email && `(${selected.item.submittedBy.email})`}</DetailRow>
            <DetailRow label="Event date">{entity?.date ? formatDate(entity.date) : null}</DetailRow>
            <DetailRow label="Location">{entity?.location || entity?.venue}</DetailRow>
            <DetailRow label="Organizer">{entity?.organizer || entity?.businessName || entity?.name}</DetailRow>
            <DetailRow label="Created">{formatDate(selected.item.createdAt)}</DetailRow>
            <DetailRow label="Updated">{formatDate(selected.item.updatedAt)}</DetailRow>
            <div className="mt-6 flex flex-wrap gap-2"><button onClick={() => approve(selected.item)} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium hover:bg-green-500">Approve & Publish</button><button onClick={() => setDecision("reject")} className="rounded-lg bg-red-600/80 px-3 py-2 text-sm font-medium hover:bg-red-500">Reject</button>{selected.item.contentType === "EVENT" && <button onClick={() => setDecision("changes")} className="rounded-lg bg-blue-600/80 px-3 py-2 text-sm font-medium hover:bg-blue-500">Request Changes</button>}</div>
            <div className="mt-7"><h3 className="mb-2 flex items-center gap-2 font-medium"><History size={16} /> Moderation history</h3>{selected.history?.length ? <div className="space-y-2">{selected.history.map((entry) => <div key={entry._id} className="rounded-lg border border-white/10 bg-admin-bg p-3 text-xs"><p className="font-medium text-white">{entry.action.replaceAll("_", " ")} by {entry.adminName}</p><p className="mt-1 text-white/50">{formatDate(entry.createdAt)}</p>{(entry.reason || entry.feedback) && <p className="mt-1 text-white/70">{entry.reason || entry.feedback}</p>}</div>)}</div> : <p className="text-sm text-white/45">No moderation actions recorded yet.</p>}</div>
          </aside>
        </div>
      )}

      {decision && selected?.item && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-lg rounded-xl border border-white/10 bg-admin-surface p-5 shadow-2xl"><h2 className="text-lg font-semibold">{decision === "reject" ? "Reject submission" : "Request changes"}</h2><p className="mt-1 text-sm text-white/55">{decision === "reject" ? "Explain why this submission cannot be approved." : "Tell the submitter what must be updated before resubmission."}</p><textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} placeholder={decision === "reject" ? "Rejection reason..." : "Requested changes..."} className="mt-4 min-h-28 w-full resize-y rounded-lg border border-white/10 bg-admin-bg p-3 text-sm text-white outline-none focus:border-admin-accent" /><div className="mt-4 flex justify-end gap-2"><button onClick={() => { setDecision(null); setReason(""); }} className="rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5">Cancel</button><button onClick={runDecision} disabled={actionLoading} className={`rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-50 ${decision === "reject" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}`}>{actionLoading ? "Saving..." : decision === "reject" ? "Reject" : "Request Changes"}</button></div></div></div>
      )}
    </div>
  );
}
