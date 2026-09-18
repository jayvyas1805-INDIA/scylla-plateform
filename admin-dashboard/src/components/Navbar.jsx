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
  Pencil,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    { label: "Edit Profile", icon: Pencil, path: "/edit" },
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

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-admin-surface flex items-center justify-between px-3 sm:px-6 text-white z-50 shadow-md">
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="shrink-0 rounded p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-admin-accent"
          aria-label="Toggle sidebar"
          title="Open navigation sidebar"
        >
          <PanelLeft size={22} />
        </button>

        {/* Logo + Title (clickable) */}
        <button
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-2 focus:outline-none hover:opacity-90 transition"
          aria-label="Go to dashboard"
        >
          <img
            src="/Copilot_20251222_095020.png"
            alt="Scylla Racing Logo"
            className="h-9 w-9 shrink-0 rounded-full border border-gray-400 object-cover sm:h-11 sm:w-11"
          />
          <div className="hidden text-left sm:block">
            <p className="font-bold text-base leading-none text-white tracking-wide lg:text-lg">
              SCYLLA RACING
            </p>
            <span className="text-xs text-admin-accent font-medium tracking-wide">
              Admin Dashboard
            </span>
          </div>
        </button>

      </div>

      {/* RIGHT */}
      <div ref={menuRef} className="relative flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate("/edit")}
          className="hidden rounded-md bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600 focus:outline-none transition sm:block"
          aria-label="Edit profile"
        >
          Edit Profile
        </button>

        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 rounded-md p-1.5 cursor-pointer hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-admin-accent"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Open admin navigation"
        >
          <img
            src="/Capture.PNG"
            alt="Admin Avatar"
            className="h-9 w-9 rounded-full border border-gray-700 object-cover sm:h-10 sm:w-10"
          />
          <span className="hidden text-sm font-medium sm:inline">Admin</span>
          <FaChevronDown size={14} className="text-white/70" />
        </button>

        {open && (
          <div
            className="absolute right-0 top-16 z-50 w-[calc(100vw-1.5rem)] max-w-[320px] overflow-hidden rounded-xl border border-gray-800 bg-admin-surface shadow-2xl"
            role="menu"
          >
            {/* Dropdown content */}
            <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3 sm:px-5">
              <img
                src="/Capture.PNG"
                alt="Admin Avatar"
                className="h-9 w-9 rounded-full border border-gray-700 object-cover"
              />
              <h1 className="text-lg font-semibold text-white">Admin</h1>
            </div>

            <div className="grid gap-1 p-2 sm:py-2">
              {items.map(({ label, icon: Icon, path }) => (
                <button
                  key={label}
                  onClick={() => handleNavigate(path)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                    location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`))
                      ? "bg-admin-accent/20 text-admin-accent"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.6} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-800 p-2">
              <button
               onClick={() => {
                  // handleNavClick();
                  // Frontend logout
                  localStorage.removeItem("adminToken");
                  setOpen(false);
                  navigate("/admin/login");
                }}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
