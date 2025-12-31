import { CheckCircle2, Shield, Wrench, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import mriSystem from "@/assets/mri-system-1.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

const FeaturedSystems = () => {
  const systems = [
    {
      image: mriSystem,
      badge: "In Stock",
      badgeColor: "bg-success",
      title: "GE 1.5T 23X 16ch Fixed MRI System",
      price: "Contact for Quote",
      description: "1.5T MRI system with 23 channel 16ch configuration located at a fixed site. Premium refurbished with full warranty.",
      features: ["FDA Registered", "Warranty Included", "Installation Available", "24/7 Support"],
    },
    {
      image: ctScanner,
      badge: "Parts Available",
      badgeColor: "bg-accent",
      title: "Toshiba/Canon Aquilion ONE CT Scanner",
      price: "Contact for Quote",
      description: "Premium CT scanner with parts and service available. Industry-leading technology from Canon Medical.",
      features: ["Wide-Area Detector", "Low-Dose Imaging", "AI Reconstruction", "Service Contracts"],
    },
    {
      image: mobileMri,
      badge: "Available Now",
      badgeColor: "bg-success",
      title: "2007 GE 1.5T 23 X 16 Channel Mobile MRI Unit",
      price: "Contact for Quote",
      description: "GE 1.5T Mobile MRI in 07 OSH 102\" Trailer. HPZ-400 Magnet, Excite II system. Fully functional with Coldhead, Compressor, HVAC.",
      features: ["Short-Term Rental", "Lease-to-Own Options", "16-Channel System", "Full Coil Package"],
      specialBadge: "RENTAL / LEASE / SALE",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured MRI Systems</h2>
            <p className="text-muted-foreground mt-1">Premium quality systems for your healthcare facility</p>
          </div>
          <Button variant="outline">View All Systems</Button>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={system.image} 
                  alt={system.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {system.specialBadge && (
                    <span className="bg-warning text-warning-foreground text-xs font-semibold px-2 py-1 rounded">
                      {system.specialBadge}
                    </span>
                  )}
                  <span className={`${system.badgeColor} text-primary-foreground text-xs font-semibold px-2 py-1 rounded`}>
                    {system.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {system.title}
                </h3>
                <p className="text-accent font-semibold mb-3">{system.price}</p>
                <p className="text-muted-foreground text-sm mb-4">{system.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {system.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {i === 0 && <Shield className="h-3 w-3 text-accent" />}
                      {i === 1 && <CheckCircle2 className="h-3 w-3 text-accent" />}
                      {i === 2 && <Wrench className="h-3 w-3 text-accent" />}
                      {i === 3 && <Headphones className="h-3 w-3 text-accent" />}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="cta" className="flex-1">Request Quote</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">View All Systems</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
