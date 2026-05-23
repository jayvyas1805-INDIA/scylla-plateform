import { PanelLeft } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
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
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "User Approvals", icon: UserCheck, path: "/approvals" },
    { label: "Content Moderation", icon: ShieldCheck, path: "/content-moderation" },
    { label: "Category Management", icon: ClipboardCheck, path: "/category" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Manage Events", icon: CalendarDays, path: "/events" },
    { label: "View Payments", icon: Wallet, path: "/payments" },


  ];

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
 useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#2f2f2f] flex items-center justify-between px-6 text-white z-50 shadow-md">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={22} />
        </button>

        {/* Logo + Title (clickable) */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition"
          aria-label="Go to dashboard"
        >
          <img
            src="/Copilot_20251222_095020.png"
            alt="Scylla Racing Logo"
            className="w-14 h-14 rounded-full border border-gray-400 object-cover"
          />
          <div className="text-left">
            <p className="font-bold text-lg leading-none text-white tracking-wide">
              SCYLLA RACING
            </p>
            <span className="text-xs text-cyan-400 font-medium tracking-wide">
              Admin Dashboard
            </span>
          </div>
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 relative">
        <div className="edit-bt">

        <button
          onClick={() => navigate("/edit")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none transition"
          aria-label="Go to dashboard"
          >Edit Profile</button>
          </div>

        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/Capture.PNG"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border border-gray-700 object-cover"
          />
          <span className="text-sm font-medium">Admin</span>
          <FaChevronDown size={14} className="text-white/70" />
        </button>

        {open && (
          <div
            ref={menuRef}
            className="absolute top-[60px] right-6 w-[300px] bg-[#0e1117] border border-gray-800 rounded-2xl shadow-2xl z-50"
          >
            {/* Dropdown content */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
              <img
                src="/Capture.PNG"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border border-gray-700 object-cover"
              />
              <h1 className="text-lg font-semibold text-white">Admin</h1>
            </div>

            <div className="py-2">
              {items.map(({ label, icon: Icon, path }) => (
                <button
                  key={label}
                  onClick={() => {
                    navigate(path);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-6 py-3 text-left rounded-xl text-gray-300 text-base font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon size={22} strokeWidth={1.6} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-800 px-6 py-3">
              <button
               onClick={() => {
                  // handleNavClick();
                  // Frontend logout
                  localStorage.removeItem("token");
                  navigate("/admin/login");
                }}
                className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-red-400 text-base font-medium hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={22} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
