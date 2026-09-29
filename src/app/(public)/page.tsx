import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { SearchBar } from "@/components/sections/SearchBar";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { WhyInvest } from "@/components/sections/WhyInvest";
import { Communities } from "@/components/sections/Communities";
import { RegisterInterest } from "@/components/sections/RegisterInterest";

export const metadata: Metadata = {
  title: "Jay Real Estate | Luxury Property in Dubai",
  description:
    "Exclusive ready homes and off-plan investments across Dubai Marina, Downtown, Palm Jumeirah, Business Bay and Dubai Hills. Independent advice, curated shortlists, discreet service.",
  alternates: { canonical: "/" },
  openGraph: { title: "Live Where Luxury Meets the Skyline", url: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedProperties />
      <FeaturedProjects />
      <WhyInvest />
      <Communities />
      <RegisterInterest />
    </>
  );
}
