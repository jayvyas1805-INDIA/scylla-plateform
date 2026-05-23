import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ControlPanelLayout({ title, children, isSidebarOpen }) {
  const navigate = useNavigate()
   useEffect(() => {
      const token = localStorage.getItem("adminToken");
      if (!token) navigate("/admin/login");
    }, [navigate]);
  return (
    // ✅ Page background WHITE (sidebar stays dark)
    <div className="min-h-screen bg-white relative">
      
      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 
        transform transition-all duration-500 ease-in-out 
        ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-64 opacity-0"}`}
      >
        <Sidebar />
      </div>

      {/* ================= BACKDROP (MOBILE) ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
          onClick={() => {
            document.dispatchEvent(new CustomEvent("closeSidebar"));
          }}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div
        className={`transition-all duration-300 px-8 py-6 pt-[80px] ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {title && (
          <h1 className="text-2xl font-semibold text-white mb-6">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
}
