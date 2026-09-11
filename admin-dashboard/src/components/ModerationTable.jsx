
export default function ModerationTable({ members, onEdit, onDelete }) {
  if (members.length === 0) {
    return (
      <div className="bg-admin-surface-raised text-gray-300 p-6 rounded-xl border border-white/10 col-span-full">
        <h3 className="text-xl font-bold text-admin-accent">No members found</h3>
        <p className="mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map(member => (
        <div
          key={member.id}
          className="bg-admin-surface-raised p-4 rounded-xl shadow-lg border border-white/10 hover:ring-2 hover:ring-admin-accent transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-admin-accent">{member.name}</h3>
              <p className="text-sm text-admin-accent">{member.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(member)}
                className="text-admin-accent hover:text-white"
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={() => onDelete(member.id)}
                className="text-red-400 hover:text-white"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>

          <p className="mt-2 text-gray-300 text-sm">{member.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-200">
            <div>
              <strong className="text-admin-accent block">CERTIFICATIONS</strong>
              {member.certifications || "—"}
            </div>
            <div>
              <strong className="text-admin-accent block">TRAINING</strong>
              {member.training || "—"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
