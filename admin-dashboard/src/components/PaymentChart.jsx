import { useEffect, useRef, useState } from "react"
import { Line } from "react-chartjs-2"

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler)

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseFloat(target)
    if (isNaN(end)) return
    const stepTime = 16
    const increment = end / (duration / stepTime)

    function step() {
      start += increment
      if (start < end) {
        setCount(Math.floor(start))
        requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    requestAnimationFrame(step)
  }, [target])
  return count
}

export default function PaymentChart() {
  const chartRef = useRef(null)
  const [range, setRange] = useState("Monthly")

  const collected = useCountUp(2400000)
  const pending = useCountUp(180000)
  const refunded = useCountUp(45000)

  // Base datasets
  const monthly = [120000,150000,180000,200000,220000,260000,280000,300000,320000,340000,360000,400000]
  const quarterly = [450000,600000,750000,900000]
  const yearly = [2400000]

  const labels = range === "Monthly"
    ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    : range === "Quarterly"
    ? ["Q1","Q2","Q3","Q4"]
    : ["2025"]

  const fullValues = range === "Monthly" ? monthly : range === "Quarterly" ? quarterly : yearly

  // Progressive reveal state
  const [visibleIndex, setVisibleIndex] = useState(0)
  const stepMs = 220

  useEffect(() => {
    // Reset progress on range change or reload
    setVisibleIndex(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setVisibleIndex(prev => {
        const next = Math.min(prev + 1, fullValues.length - 1)
        if (next >= fullValues.length - 1) {
          clearInterval(timer)
        }
        return next
      })
    }, stepMs)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range])

  // Build progressive data: reveal up to visibleIndex, keep future points null
  const progressiveValues = fullValues.map((v, idx) => (idx <= visibleIndex ? v : null))

  // Dynamic trend calculation (based on full dataset, not progressive)
  const calcTrend = (arr) => {
    if (arr.length < 2) return "No data"
    const last = arr[arr.length - 1]
    const prev = arr[arr.length - 2]
    const diff = last - prev
    const percent = ((diff / prev) * 100).toFixed(1)
    return `${diff >= 0 ? "+" : ""}${percent}% vs last ${range === "Monthly" ? "month" : range === "Quarterly" ? "quarter" : "year"}`
  }

  const trends = {
    collected: calcTrend(fullValues),
    pending: "-5% vs last period",   // replace with real pending dataset if available
    refunded: "+2% vs last period",  // replace with real refunded dataset if available
  }

  // Gradient line stroke
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
    gradient.addColorStop(0, "#06b6d4")
    gradient.addColorStop(0.5, "#3b82f6")
    gradient.addColorStop(1, "#8b5cf6")
    return gradient
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Payments Collected",
        data: progressiveValues,
        borderColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: canvasCtx, chartArea } = chart
          if (!chartArea) return "#3b82f6"
          return getGradient(canvasCtx, chartArea)
        },
        backgroundColor: "rgba(59,130,246,0.18)",
        tension: 0.4,
        fill: true,
        spanGaps: false,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#3b82f6",
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 280, // small per-step animation to smooth the reveal
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.85)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (context) => `₹${(context.parsed.y / 1000).toFixed(0)}K`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#cbd5e1",
          callback: (value) => `₹${value / 1000}K`,
        },
        grid: { color: "#334155" },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155" },
      },
    },
    elements: { line: { borderWidth: 2 } },
    // Only show pointer cursor when hovering the revealed points
    onHover: (event, chartElement) => {
      const target = event.native?.target
      if (target) {
        target.style.cursor = chartElement.length ? "pointer" : "default"
      }
    },
  }

  const handleExport = () => {
    const chart = chartRef.current
    if (chart) {
      const link = document.createElement("a")
      link.href = chart.toBase64Image()
      link.download = "payments-chart.png"
      link.click()
    }
  }

  return (
  <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(0,255,255,0.4)]">
    <div className="bg-[#0b0f14] rounded-[0.95rem] p-4 sm:p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-white text-base sm:text-lg font-semibold">
          Payments Overview
        </h2>

        <div className="flex flex-wrap gap-2">
          {["Monthly", "Quarterly", "Yearly"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                range === r
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={handleExport}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-500"
          >
            Export
          </button>
        </div>
      </div>

      {/* ---------- STAT CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Collected */}
        <div className="bg-[#10151c] border border-green-500/30 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-green-400 mb-1">
            Total Collected
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            ₹{(collected / 1_000_000).toFixed(1)}M
          </h2>
          <p className="text-[11px] sm:text-xs text-green-400 mt-1">
            {trends.collected}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-[#10151c] border border-yellow-500/30 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-yellow-400 mb-1">
            Pending Payments
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            ₹{(pending / 1000).toFixed(0)}K
          </h2>
          <p className="text-[11px] sm:text-xs text-yellow-400 mt-1">
            {trends.pending}
          </p>
        </div>

        {/* Refunded */}
        <div className="bg-[#10151c] border border-red-500/30 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-400 mb-1">
            Refunded
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            ₹{(refunded / 1000).toFixed(0)}K
          </h2>
          <p className="text-[11px] sm:text-xs text-red-400 mt-1">
            {trends.refunded}
          </p>
        </div>
      </div>

      {/* ---------- CHART ---------- */}
      <div className="h-[240px] sm:h-[300px] md:h-[360px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>

      {/* ---------- INSIGHTS ---------- */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end">
        <div className="w-full sm:w-fit bg-[#10151c] border border-cyan-500/30 rounded-md px-3 py-2">
          <h3 className="text-xs font-semibold text-cyan-400 mb-1">
            Key Insights
          </h3>
          <ul className="text-[11px] sm:text-xs text-white/70 list-disc list-inside space-y-0.5">
            <li>
              Highest in {labels[fullValues.indexOf(Math.max(...fullValues))]}:
              ₹{Math.max(...fullValues) / 1000}K
            </li>
            <li>
              Lowest in {labels[fullValues.indexOf(Math.min(...fullValues))]}:
              ₹{Math.min(...fullValues) / 1000}K
            </li>
            <li>
              Growth: +
              {(
                ((fullValues.at(-1) - fullValues[0]) / fullValues[0]) *
                100
              ).toFixed(1)}
              %
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
)

}
