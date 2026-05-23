import { useState, useEffect } from "react";
import ModerationTable from "./ModerationTable";
import CreateMemberModal from "./CreateMemberModal";

const defaultMembers = [
  // 🧑‍🔧 Engineers
  {
    id: crypto.randomUUID(),
    name: "Parav Mehta",
    role: "Engineer",
    description: "3 years in Formula Student India, specialization in suspension tuning, racecar strategy. Multiple podium finishes.",
    certifications: "Chassis Design Level 2",
    training: "Suspension Tuning"
  },
  {
    id: crypto.randomUUID(),
    name: "Rujya Singh",
    role: "Engineer",
    description: "Team operations manager overseeing logistics, spares, and race coordination. Known for high team morale.",
    certifications: "Operations Management",
    training: "Race Coordination"
  },
  {
    id: crypto.randomUUID(),
    name: "Ishaan Verma",
    role: "Engineer",
    description: "Electrical systems lead with expertise in CAN bus and ECU integration.",
    certifications: "Electrical Systems Level 2",
    training: "ECU Mapping"
  },

  // 🏎️ Drivers
  {
    id: crypto.randomUUID(),
    name: "Kabir Nair",
    role: "Driver",
    description: "F1 driver with competitive timings in all categories. Known for mechanical adjustments. 4 years race experience.",
    certifications: "Pitstop Strategy",
    training: "Driver Endurance Training"
  },
  {
    id: crypto.randomUUID(),
    name: "Dev Patel",
    role: "Driver",
    description: "Renowned driver with track record of winning races. Works well with exceptionally quick pitstops.",
    certifications: "Pitstop Strategy",
    training: "Driver Endurance Training"
  },
  {
    id: crypto.randomUUID(),
    name: "Mehul Joshi",
    role: "Driver",
    description: "Karting champion turned Formula Student rookie. Strong reflexes and telemetry feedback.",
    certifications: "Driver Fundamentals",
    training: "Simulator Training"
  },

  // 🔧 Crew
  {
    id: crypto.randomUUID(),
    name: "Neha Sharma",
    role: "Crew",
    description: "Handles electrical diagnostics, telemetry integration, and data acquisition. Expert in race execution systems.",
    certifications: "Electrical Systems Level 3",
    training: "Telemetry Integration"
  },
  {
    id: crypto.randomUUID(),
    name: "Arjun Desai",
    role: "Crew",
    description: "Pit crew lead with expertise in tire changes and refueling under pressure.",
    certifications: "Pit Operations",
    training: "Rapid Tire Change"
  },

  // 🎨 Designers
  {
    id: crypto.randomUUID(),
    name: "Ruja Iyer",
    role: "Designer",
    description: "Lead Aerodynamics designer specializing in CFD simulations and wind tunnel testing for optimal downforce.",
    certifications: "Aero Design Level 3",
    training: "Wind Tunnel Testing"
  },
  {
    id: crypto.randomUUID(),
    name: "Sanya Reddy",
    role: "Designer",
    description: "Proven record in designing high-efficiency aero packages. Known for CFD and efficiency simulations.",
    certifications: "Aero Design Level 2",
    training: "CFD Simulations"
  },
  {
    id: crypto.randomUUID(),
    name: "Tanvi Bhatt",
    role: "Designer",
    description: "Specializes in ergonomic cockpit layouts and driver comfort optimization.",
    certifications: "Ergonomics Design",
    training: "Cockpit Simulation"
  },

  // 👔 Managers
  {
    id: crypto.randomUUID(),
    name: "Manav Kapoor",
    role: "Manager",
    description: "Chief mechanical manager for vehicle setup, maintenance, and race-day troubleshooting.",
    certifications: "Chassis Design Level 3",
    training: "Vehicle Maintenance"
  },
  {
    id: crypto.randomUUID(),
    name: "Ananya Rao",
    role: "Manager",
    description: "Logistics and finance coordinator ensuring smooth operations across departments.",
    certifications: "Team Management",
    training: "Budget Planning"
  }
];

export default function ModerationFrame() {
  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem("fs_members");
    return stored ? JSON.parse(stored) : defaultMembers;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    localStorage.setItem("fs_members", JSON.stringify(members));
  }, [members]);

  const filtered = members.filter(m => {
    const matchRole = filter === "All" || m.role === filter;
    const matchSearch = [m.name, m.role, m.description, m.certifications, m.training]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSave = (data) => {
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
    } else {
      setMembers([...members, { id: crypto.randomUUID(), ...data }]);
    }
    setModalOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this member?")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm("Reset all members to defaults?")) {
      localStorage.removeItem("fs_members");
      setMembers(defaultMembers);
    }
  };

 return (
  <div className="p-6 bg-black rounded-xl shadow-lg">
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-white">
        Content Moderation for home
      </h1>

      <div className="flex flex-wrap gap-4 mt-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#11182b] text-white px-4 py-2 rounded-md w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setModalOpen(true);
            setEditingMember(null);
          }}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-md text-white"
        >
          + Create Member
        </button>

        <button
          onClick={handleReset}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white"
        >
          Reset Members
        </button>
      </div>

      <nav className="flex gap-2 mt-4 flex-wrap">
        {["All", "Driver", "Engineer", "Crew", "Designer", "Manager"].map(
          (role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-3 py-1 rounded-full ${
                filter === role
                  ? "bg-cyan-500 text-white"
                  : "bg-[#0c1323] text-gray-300"
              }`}
            >
              {role}
            </button>
          )
        )}
      </nav>
    </header>
 


      <ModerationTable
        members={filtered}
        onEdit={(m) => { setEditingMember(m); setModalOpen(true); }}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <CreateMemberModal
          initialData={editingMember}
          onClose={() => { setModalOpen(false); setEditingMember(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
