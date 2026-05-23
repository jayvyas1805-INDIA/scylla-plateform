
export default function ModerationTable({ members, onEdit, onDelete }) {
  if (members.length === 0) {
    return (
      <div className="bg-[#11182b] text-gray-300 p-6 rounded-xl border border-white/10 col-span-full">
        <h3 className="text-xl font-bold text-cyan-400">No members found</h3>
        <p className="mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map(member => (
        <div
          key={member.id}
          className="bg-[#11182b] p-4 rounded-xl shadow-lg border border-white/10 hover:ring-2 hover:ring-cyan-500 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-cyan-300">{member.name}</h3>
              <p className="text-sm text-cyan-500">{member.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(member)}
                className="text-cyan-400 hover:text-white"
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
              <strong className="text-cyan-400 block">CERTIFICATIONS</strong>
              {member.certifications || "—"}
            </div>
            <div>
              <strong className="text-cyan-400 block">TRAINING</strong>
              {member.training || "—"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
