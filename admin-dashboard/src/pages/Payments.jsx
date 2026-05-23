import PaymentChart from "../components/PaymentChart";

export default function Payments() {
  return (
    <div className="max-w-6xl mx-auto">

      {/* Black card */}
      <div className="bg-black rounded-xl p-6 shadow-md">

        {/* ✅ FIXED HERE */}
        <h1 className="text-2xl font-semibold text-white mb-6">
          Payments
        </h1>

        <PaymentChart />

      </div>
    </div>
  );
}
