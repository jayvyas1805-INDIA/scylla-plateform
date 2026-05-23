export default function HeaderBar() {
  return (
    <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(0,255,255,0.4)] mb-6">
      <div className="bg-[#0b0f14] rounded-[0.95rem] px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-lg shadow-[0_0_6px_rgba(0,255,255,0.6)]">
            S
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-cyan-400 drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]">
            Scylla Racing — Manage Events
          </h1>
        </div>

        {/* Right: Create Button */}
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
        >
          + Create Event
        </button>
      </div>
    </div>
  );
}
