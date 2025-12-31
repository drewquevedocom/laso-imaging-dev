import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Upgrade Your Imaging Capabilities?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Let our team of MRI specialists help you find the perfect solution for your facility's needs and budget.
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
          <div className="bg-card rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-foreground mb-6">Get a Quick Quote</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Interested In...
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option>MRI Systems</option>
                  <option>System Rentals</option>
                  <option>Parts & Accessories</option>
                  <option>Training Programs</option>
                  <option>Service & Support</option>
                </select>
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <Button variant="cta" className="w-full" size="lg">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
