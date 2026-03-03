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
import SEOHead from "@/components/seo/SEOHead";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Used MRI & Medical Imaging Equipment"
        description="LASO Imaging is your trusted partner for used and refurbished MRI, CT, and medical imaging equipment. FDA registered dealer with nationwide service and competitive pricing."
        keywords={['used MRI machines for sale', 'refurbished CT scanners', 'medical imaging equipment', 'MRI machine cost', 'mobile MRI rental', 'used Siemens MRI', 'used GE CT scanner']}
        canonical="/"
        type="website"
      />
      <LocalBusinessSchema 
        pageType="MedicalBusiness" 
        includeOrganization={true} 
        includeWebSite={true} 
      />
      <Header />
      <main id="main-content" className="flex-1">
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
