export default function CategorySection({ title, children }) {
  return (
    <div className="bg-[#121720] rounded-xl border border-white/10
      shadow-[0_0_18px_rgba(0,0,0,0.6)]">

      <div className="px-6 py-4 border-b border-white/10 font-semibold">
        {title}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
