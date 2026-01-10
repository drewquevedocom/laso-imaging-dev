import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteForm from "@/components/shared/QuoteForm";

const CTASection = () => {
  return (
    <section className="py-20 bg-hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don't Just Compete. Lead the Market.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Aging equipment slows you down. We evaluate your current systems to help you maximize patient volume.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Free consultation with MRI experts",
                "Custom quotes within 24 hours",
                "Flexible financing options",
                "Comprehensive warranty packages",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button variant="heroOutline" size="xl">
                Request Free Quote
              </Button>
              <Button variant="hero" size="xl" className="bg-accent hover:bg-accent/90">
                <Phone className="h-5 w-5 mr-2" />
                Call 1-800-MRI-LASO
              </Button>
            </div>
          </div>

          {/* Right Content - Quick Quote Form */}
          <div className="shadow-lg">
            <QuoteForm 
              sourcePage="homepage-cta" 
              title="Get a Quick Quote"
              subtitle="Fill out the form and we'll respond within 24 hours."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
