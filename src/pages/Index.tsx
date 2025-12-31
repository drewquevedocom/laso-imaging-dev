import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import LiveTicker from "@/components/home/LiveTicker";
import BrandLogos from "@/components/home/BrandLogos";
import FeaturedSystems from "@/components/home/FeaturedSystems";
import EquipmentCategories from "@/components/home/EquipmentCategories";
import ServicesSection from "@/components/home/ServicesSection";
import CTASection from "@/components/home/CTASection";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <LiveTicker />
        <BrandLogos />
        <FeaturedSystems />
        <EquipmentCategories />
        <ServicesSection />
        <CTASection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
