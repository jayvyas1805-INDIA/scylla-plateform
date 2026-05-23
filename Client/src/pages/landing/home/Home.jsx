import Navbar from "../../../components/navbar/Navbar";
import HeroSection from "../../../components/navbar/HeroSection";
import UpcomingEvents from "../../../components/navbar/UpcomingEvents";
import TopRiders from "../../../components/navbar/TopRiders";
import FeaturedTeams from "../../../components/navbar/FeaturedTeams";
import EventsNotification from "../../../components/navbar/EventsNotification";
import MarketplaceHighlights from "../../../components/navbar/MarketplaceHighlights";
import CTAFooter from "../../../components/navbar/CTAFooter";

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      {/* <UpcomingEvents /> */}
      <TopRiders />
      <FeaturedTeams />
      <EventsNotification />
      <MarketplaceHighlights />
      <CTAFooter />
    </div>
  );
}

export default Home;
