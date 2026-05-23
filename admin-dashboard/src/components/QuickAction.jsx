import { CheckCircle, ShieldCheck, CalendarDays, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickAdminActions() {
  return (
    <div className="w-full px-1">
      <div className="w-full bg-black rounded-2xl shadow-2xl p-6">
        <h3 className="text-white text-base mb-6">Quick Admin Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Approve Teams */}
          <Link to="/approvals" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-600 text-white py-4 text-base font-semibold transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5">
              <CheckCircle size={16} />
              Approve Teams
            </button>
          </Link>

          {/* Verify Vendors */}
          <Link to="/approvals" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500 text-blue-400 py-4 text-base font-semibold transition-all duration-300 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:-translate-y-0.5">
              <ShieldCheck size={16} />
              Verify Vendors
            </button>
          </Link>

          {/* Manage Events */}
          <Link to="/events" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500 text-blue-400 py-4 text-base font-semibold transition-all duration-300 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:-translate-y-0.5">
              <CalendarDays size={16} />
              Manage Events
            </button>
          </Link>

          {/* View Payments */}
          <Link to="/payments" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500 text-blue-400 py-4 text-base font-semibold transition-all duration-300 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:-translate-y-0.5">
              <CreditCard size={16} />
              View Payments
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
