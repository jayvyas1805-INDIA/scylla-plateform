import UpcomingEvents from "../../../components/navbar/UpcomingEvents";
import Navbar from "../../../components/navbar/Navbar";

export default function Events() {
  return (
    <div className="lp-page">
      <Navbar />
      <UpcomingEvents showOrganizer />
    </div>
  );
}