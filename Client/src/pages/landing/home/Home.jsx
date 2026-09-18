import Navbar from "../../../components/navbar/Navbar";
import HeroSection from "../../../components/navbar/HeroSection";
import UpcomingEvents from "../../../components/navbar/UpcomingEvents";
import FeaturedTeams from "../../../components/navbar/FeaturedTeams";
import MarketplaceHighlights from "../../../components/navbar/MarketplaceHighlights";
import CTAFooter from "../../../components/navbar/CTAFooter";

function Home() {
  return (
    <div className="home-page lp-page">
      <Navbar />
      <HeroSection />
      <UpcomingEvents />
      <FeaturedTeams />
      <MarketplaceHighlights />
      <CTAFooter />
    </div>
  );
}

export default Home;
