export default function TopVehicles({ workspace, dateRange }) {
  // Example datasets for different workspaces
  const vehiclesData = {
    "All Workspaces": {
      "01/01/2023 - 05/31/2023": [
        ["R8 Formula", "34%"],
        ["KT-01 Karting", "26%"],
        ["BL-03 Baja", "22%"],
        ["MT-02 Moto", "18%"],
      ],
    },
    Marketing: {
      "01/01/2023 - 05/31/2023": [
        ["KT-01 Karting", "40%"],
        ["R8 Formula", "30%"],
        ["MT-02 Moto", "20%"],
        ["BL-03 Baja", "10%"],
      ],
    },
    Engineering: {
      "01/01/2023 - 05/31/2023": [
        ["BL-03 Baja", "35%"],
        ["R8 Formula", "25%"],
        ["KT-01 Karting", "25%"],
        ["MT-02 Moto", "15%"],
      ],
    },
    Sales: {
      "01/01/2023 - 05/31/2023": [
        ["R8 Formula", "38%"],
        ["KT-01 Karting", "28%"],
        ["MT-02 Moto", "20%"],
        ["BL-03 Baja", "14%"],
      ],
    },
  };

  // Pick dataset based on workspace and dateRange
  const currentVehicles =
    (vehiclesData[workspace] && vehiclesData[workspace][dateRange]) ||
    vehiclesData["All Workspaces"]["01/01/2023 - 05/31/2023"];

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Top Performing Vehicles ({workspace}, {dateRange})
      </h3>
      <div className="space-y-2">
        {currentVehicles.map(([name, pct]) => (
          <div
            key={name}
            className="flex justify-between py-2 border-b border-slate-700 last:border-none"
          >
            <span className="text-gray-300">{name}</span>
            <span className="text-blue-400 font-medium">{pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
