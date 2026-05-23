import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";


export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "User Approvals", icon: UserCheck, path: "/approvals" },
    { label: "Content Moderation", icon: ShieldCheck, path: "/content-moderation" },
    { label: "Category Management", icon: ClipboardCheck, path: "/category" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Manage Events", icon: CalendarDays, path: "/events" },
    { label: "Payments", icon: Wallet, path: "/payments" },
  ];

  const activeClasses =
    "bg-[#1f6feb]/20 text-[#58a6ff] shadow-[0_0_14px_rgba(88,166,255,0.35)]";

  // const handleLogout = () => {
  //   // 1️⃣ Remove token
  //   localStorage.removeItem("adminToken");

  //   // 2️⃣ Optional: clear any other admin data
  //   // localStorage.removeItem("adminProfile");

  //   // 3️⃣ Show success message
  //   toast.success("Logged out successfully");

  //   // 4️⃣ Redirect to login page
  //    window.location.href = "/admin/login";
  // };


  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-[#0e1117] border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        {/* ================= BRAND / PROFILE ================= */}
         <div className="pt-10 h-[160px] sm:h-[160px] flex items-center gap-2 px-4 sm:px-6 border-b border-gray-800">
<hr className="border-gray-800 my-4 sm:my-6" />
          <img
            src="/Capture.PNG"
            alt="Admin"
            className="w-10 h-10 rounded-full border border-white/20 object-cover"
          />
          <div>
            <h2 className="text-white font-semibold leading-none">Admin</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Control Panel
            </p>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {items.map(({ label, icon: Icon, path }) => {
            const active =
              location.pathname === path ||
              location.pathname.startsWith(`${path}/`);

            return (
              <button
                key={label}
                onClick={() => {
                  navigate(path);
                  onClose?.();
                }}
                className={`
                  w-full flex items-center gap-4
                  px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? activeClasses
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={18} strokeWidth={1.7} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* ================= LOGOUT (STICKY BOTTOM) ================= */}
        <div className="px-4 pb-6 mt-auto">
          <div className="border-t border-white/10 mb-4" />

          <button
            onClick={() => {
                  // handleNavClick();
                  // Frontend logout
                  localStorage.removeItem("adminToken");
                  navigate("/admin/login");
                }}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              text-red-400 text-sm font-medium
              border border-red-500/40
              hover:bg-red-500/10 hover:border-red-500/60
              transition-all
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
