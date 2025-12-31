import { CheckCircle2, Award, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroMri from "@/assets/hero-mri.jpg";
import promoInstall from "@/assets/promo-install.jpg";
import promoService from "@/assets/promo-service.jpg";
import promoCryo from "@/assets/promo-cryo.jpg";
import promoTraining from "@/assets/promo-training.jpg";

const HeroSection = () => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Hero */}
          <div className="lg:col-span-3 relative rounded-xl overflow-hidden min-h-[500px]">
            <img 
              src={heroMri} 
              alt="Advanced MRI Machine" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full max-w-2xl">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded mb-4 w-fit">
                TRUSTED PARTNER
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
                Trusted MRI - CT & X-Ray Solutions
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6">
                for Healthcare Providers
              </p>
              
              <p className="text-primary-foreground/80 mb-8 text-lg">
                From sales and rentals to full-service maintenance, LASO delivers reliable MRI systems nationwide.
              </p>

              {/* Trust Points */}
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>FDA Registered & ISO Certified</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>12-Month Parts & Labor Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>Installation & Training Included</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button variant="heroOutline" size="lg">
                  Request a Quote
                </Button>
                <Button variant="hero" size="lg" className="bg-accent hover:bg-accent/90">
                  Browse MRI Machines
                </Button>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center gap-8 mt-8 pt-6 border-t border-primary-foreground/20">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Award className="h-5 w-5 text-accent" />
                  <span className="font-semibold">18+ Years</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-semibold">FDA Registered</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Truck className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Same-Day Shipping</span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-4 bottom-4 flex gap-2 z-20">
              <button className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <ChevronLeft className="h-5 w-5 text-primary-foreground" />
              </button>
              <button className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                <ChevronRight className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Side Promo Cards */}
          <div className="flex flex-col gap-4">
            <PromoCard 
              image={promoInstall}
              label="EQUIPMENT INSTALL & DE-INSTALL"
              title="Expert Relocation Services"
            />
            <PromoCard 
              image={promoService}
              label="SERVICE AGREEMENTS"
              title="Preventative Maintenance"
            />
            <PromoCard 
              image={promoCryo}
              label="CRYO & COLDHEAD"
              title="Helium Service & Repair"
            />
            <PromoCard 
              image={promoTraining}
              label="TRAINING & SUPPORT"
              title="Applications Training & Remote Scanning"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const PromoCard = ({ image, label, title }: { image: string; label: string; title: string }) => (
  <a 
    href="#" 
    className="relative rounded-lg overflow-hidden group h-28 flex-shrink-0"
  >
    <img 
      src={image} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-card-overlay" />
    <div className="relative z-10 p-4 flex flex-col justify-end h-full">
      <span className="text-xs text-accent font-semibold">{label}</span>
      <h3 className="text-sm font-semibold text-primary-foreground">{title}</h3>
      <span className="text-xs text-primary-foreground/80 flex items-center gap-1 mt-1">
        Learn More <ChevronRight className="h-3 w-3" />
      </span>
    </div>
  </a>
);

export default HeroSection;
