import { useState } from "react";

import GroupModerationSidebar from "./GroupModerationSidebar";
import GroupModerationMain from "./GroupModerationMain";
import ModerationReportsPanel from "./ModerationReportsPanel";

export default function GroupModerationPanel() {
  const [selectedTeam, setSelectedTeam] = useState("Thunder Racing Team");

  return (
    <div className="mt-6 text-white px-4 sm:px-0">
      {/* Responsive Layout Grid */}
      <div
        className="
          grid gap-6
          grid-cols-1
          md:grid-cols-[260px_1fr]
          xl:grid-cols-[260px_1fr_340px]
        "
      >
        {/* LEFT SIDEBAR */}
        <div className="order-1 md:order-1">
          <GroupModerationSidebar
            onSelectTeam={(team) => setSelectedTeam(team.name)}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="order-2 md:order-2">
          <GroupModerationMain selectedTeam={selectedTeam} />
        </div>

        {/* RIGHT PANEL */}
        <div className="order-3 xl:order-3">
          <ModerationReportsPanel />
        </div>
      </div>
    </div>
  );
}
