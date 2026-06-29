import { HeroSection } from "../components/features/home/HeroSection";
import HowItWorks from "../components/features/home/HowItWorks";
import { TrustLayer } from "../components/features/home/TrustLayer";
import FeaturedProperties from "../components/features/home/FeaturedProperties";
import { LifestyleMatching } from "../components/features/home/LifestyleMatching";
import { Seo } from "../components/Seo";

export default function Home() {
  return (
    <>
      <Seo 
        title="Home" 
        description="Find verified homes in Nairobi with safety scores, noise ratings, and commute data." 
      />
      <HeroSection />
      <HowItWorks />
      <TrustLayer />
      <FeaturedProperties />
      <LifestyleMatching />
    </>
  );
}
