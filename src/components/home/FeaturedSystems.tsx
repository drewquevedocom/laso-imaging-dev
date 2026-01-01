import { CheckCircle2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mriSystem1 from "@/assets/mri-system-1.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

const fallbackSystems = [
  {
    id: 1,
    image: mriSystem1,
    title: "GE Signa HDxt 1.5T MRI",
    price: "$89,000",
    description: "Complete system with 16 channels, cardiac and neuro packages included.",
    features: ["16 Channel", "Cardiac Ready", "1-Year Warranty"]
  },
  {
    id: 2,
    image: ctScanner,
    title: "Toshiba Aquilion 64 CT",
    price: "$125,000",
    description: "High-speed 64-slice CT scanner, ideal for cardiac and vascular imaging.",
    features: ["64 Slice", "Sub-second Rotation", "Low Dose"]
  },
  {
    id: 3,
    image: mobileMri,
    title: "Mobile MRI Trailer - Siemens",
    price: "Contact for Pricing",
    description: "Turnkey mobile MRI solution with Siemens Espree 1.5T system.",
    features: ["Turnkey Solution", "DOT Certified", "Site Ready"]
  }
];

const FeaturedSystems = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured MRI Systems</h2>
            <p className="text-muted-foreground">Pre-owned imaging equipment with full warranty</p>
          </div>
          <Link to="/products">
            <Button variant="outline">View All Systems</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackSystems.map((system) => (
            <div
              key={system.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={system.image}
                  alt={system.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                  FEATURED
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1">{system.title}</h3>
                <p className="text-accent font-bold text-xl mb-3">{system.price}</p>
                <p className="text-muted-foreground text-sm mb-4">{system.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {system.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                    >
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-1" />
                    Request Quote
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
