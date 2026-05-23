export default function VendorCard({ title, count, glow }) {
  const glowStyle =
    glow === "cyan"
      ? "border-cyan-400/40 shadow-[0_0_25px_rgba(0,191,255,0.35)]"
      : "border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.35)]";

  return (
    <div className={`bg-[#121720] border rounded-xl p-5 ${glowStyle}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{count} Vendors</p>
    </div>
  );
}
