import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Award, Truck, ChevronLeft, ChevronRight, Zap, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";
import promoInstall from "@/assets/promo-install.jpg";
import promoService from "@/assets/promo-service.jpg";
import promoCryo from "@/assets/promo-cryo.jpg";
import promoTraining from "@/assets/promo-training.jpg";

interface SlideContent {
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  primaryCta: string;
  secondaryCta: string;
  image: string;
}

const slides: SlideContent[] = [
  {
    badge: "TRUSTED PARTNER",
    badgeIcon: <Shield className="h-3 w-3" />,
    title: "Trusted MRI - CT & X-Ray Solutions",
    subtitle: "for Healthcare Providers",
    description: "From sales and rentals to full-service maintenance, LASO delivers reliable MRI systems nationwide.",
    features: [
      "FDA Registered & ISO Certified",
      "12-Month Parts & Labor Warranty",
      "Installation & Training Included"
    ],
    primaryCta: "Request a Quote",
    secondaryCta: "Browse MRI Machines",
    image: heroSlide1
  },
  {
    badge: "FAST DELIVERY",
    badgeIcon: <Zap className="h-3 w-3" />,
    title: "Parts & Components You Can Rely On",
    subtitle: "for Every Major OEM Brand",
    description: "Quality replacement parts with fast shipping and expert support for your imaging equipment.",
    features: [
      "OEM & Aftermarket Options",
      "Same-Day Shipping Available",
      "90-Day Warranty on All Parts"
    ],
    primaryCta: "Request Quote",
    secondaryCta: "Shop Parts",
    image: heroSlide2
  },
  {
    badge: "QUALITY SYSTEMS",
    badgeIcon: <Package className="h-3 w-3" />,
    title: "Mobile & Refurbished MRI Systems",
    subtitle: "Premium Equipment, Better Value",
    description: "Fully inspected and certified pre-owned systems that deliver exceptional imaging at reduced costs.",
    features: [
      "Save 40-60% vs New Equipment",
      "Fully Inspected & Certified",
      "Flexible Financing Available"
    ],
    primaryCta: "Get a Quote",
    secondaryCta: "Explore Systems",
    image: heroSlide3
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = slides[currentSlide];

  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:h-[540px]">
          {/* Main Hero Slider */}
          <div 
            className="lg:col-span-3 relative rounded-xl overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Images with Crossfade */}
            {slides.map((s, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
                style={{ transitionDuration: '800ms' }}
              >
                <img 
                  src={s.image} 
                  alt={s.title}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    index === currentSlide ? 'animate-subtle-zoom' : ''
                  }`}
                />
              </div>
            ))}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent z-10" />
            
            {/* Content with Fade Animation */}
            <div 
              className="relative z-20 p-8 md:p-12 flex flex-col justify-center h-full max-w-2xl"
              key={currentSlide}
            >
              <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded mb-4 w-fit animate-fade-in-up stagger-1">
                {slide.badgeIcon}
                {slide.badge}
              </span>
              
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2 animate-fade-in-up stagger-2">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6 animate-fade-in-up stagger-2">
                {slide.subtitle}
              </p>
              
              <p className="text-primary-foreground/80 mb-8 text-lg animate-fade-in-up stagger-3">
                {slide.description}
              </p>

              {/* Trust Points */}
              <div className="space-y-2 mb-8 animate-fade-in-up stagger-3">
                {slide.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-primary-foreground/90">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-4">
                <Button variant="heroOutline" size="lg">
                  {slide.primaryCta}
                </Button>
                <Button variant="hero" size="lg" className="bg-accent hover:bg-accent/90">
                  {slide.secondaryCta}
                </Button>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center gap-8 mt-8 pt-6 border-t border-primary-foreground/20 animate-fade-in-up stagger-4">
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
            <div className="absolute right-4 bottom-4 flex gap-2 z-30">
              <button 
                onClick={prevSlide}
                disabled={isTransitioning}
                className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 text-primary-foreground" />
              </button>
              <button 
                onClick={nextSlide}
                disabled={isTransitioning}
                className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 bg-accent' 
                      : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side Promo Cards - Flex to fill and align with slider */}
          <div className="flex flex-col gap-2 lg:h-full">
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
    className="relative rounded-lg overflow-hidden group flex-1 min-h-[100px]"
  >
    <img 
      src={image} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-card-overlay group-hover:bg-primary/60 transition-colors duration-300" />
    <div className="relative z-10 p-4 flex flex-col justify-end h-full">
      <span className="text-xs text-accent font-semibold">{label}</span>
      <h3 className="text-sm font-semibold text-primary-foreground">{title}</h3>
      <span className="text-xs text-primary-foreground/80 flex items-center gap-1 mt-1 group-hover:text-accent transition-colors">
        Learn More <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </a>
);

export default HeroSection;
