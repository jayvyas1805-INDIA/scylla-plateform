import ActionButton from "./ActionButton";
import toast from "react-hot-toast";

export default function CategoryTable({ data, onDelete }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-white/5 text-gray-400">
        <tr>
          <th className="px-4 py-3 text-left">Type Name</th>
          <th className="px-4 py-3 text-center">Vendors</th>
          <th className="px-4 py-3 text-center">Status</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map(item => (
          <tr key={item.id} className="border-t border-white/5 hover:bg-white/5">
            <td className="px-4 py-3 font-medium">{item.name}</td>

            <td className="px-4 py-3 text-center text-cyan-400 font-semibold">
              {item.vendors}
            </td>

            <td className="px-4 py-3 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs
                ${item.status === "Active"
                  ? "bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {item.status}
              </span>
            </td>

            <td className="px-4 py-3">
              <div className="flex justify-center gap-4">
                <ActionButton type="view" onClick={() => toast.success(`Viewing ${item.name}`)} />
                <ActionButton type="edit" onClick={() => toast(`Editing ${item.name}`, { icon: "✏️" })} />
                <ActionButton
                  type="delete"
                  onClick={() => onDelete?.(item.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
