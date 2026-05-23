
export default function EventViewModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0f141b] border border-gray-800 rounded-xl p-6 w-[400px]">
        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Event Details</h2>
        <div className="space-y-3 text-white">
          <div>
            <span className="text-gray-400 text-sm">Event Name:</span>
            <p className="font-medium">{event.name}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Date:</span>
            <p className="font-medium">{event.date}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Status:</span>
            <p className="font-medium">{event.status}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
