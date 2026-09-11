import { Outlet } from "react-router-dom";
import TeamNavbar from "../components/team/TeamNavbar";
import "./TeamLayout.css";


function TeamLayout() {
  return (
    <>
      <TeamNavbar />
      <main className="team-layout-content">
        <Outlet />
      </main>
    </>
  );
}

export default TeamLayout;
