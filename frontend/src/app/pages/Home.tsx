import { HeroSection } from "../components/features/home/HeroSection";
import FeaturedProperties from "../components/features/home/FeaturedProperties";
import { Seo } from "../components/Seo";

export default function Home() {
  return (
    <>
      <Seo
        title="Home"
        description="Find verified homes in Nairobi with safety scores, noise ratings, and commute data."
      />
      <HeroSection />
      <FeaturedProperties />
    </>
  );
}
