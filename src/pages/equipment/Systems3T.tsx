import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/shared/QuoteForm";
import { CheckCircle2, Shield, Award, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const systems = [
  {
    name: "GE SIGNA Premier 3.0T",
    image: "/placeholder.svg",
    features: ["AIR Technology", "128 Channel", "SIGNA Works"],
    status: "In Stock",
  },
  {
    name: "Siemens MAGNETOM Vida 3T",
    image: "/placeholder.svg",
    features: ["BioMatrix Technology", "128 Channel", "syngo MR XA"],
    status: "In Stock",
  },
  {
    name: "Philips Ingenia Elition 3.0T",
    image: "/placeholder.svg",
    features: ["Compressed SENSE", "32 Channel", "SmartSpeed"],
    status: "Available Soon",
  },
  {
    name: "GE Discovery MR750 3.0T",
    image: "/placeholder.svg",
    features: ["32 Channel", "PROPELLER 3.0", "DV26 Software"],
    status: "In Stock",
  },
  {
    name: "Siemens MAGNETOM Skyra 3T",
    image: "/placeholder.svg",
    features: ["Tim 4G", "70cm Bore", "Dot Engine"],
    status: "In Stock",
  },
  {
    name: "Philips Achieva 3.0T TX",
    image: "/placeholder.svg",
    features: ["MultiTransmit", "32 Channel", "dStream"],
    status: "Available Soon",
  },
];

const Systems3T = () => {
  return (
    <>
      <Helmet>
        <title>3.0T MRI Systems | LASO Imaging</title>
        <meta
          name="description"
          content="Premium 3.0T MRI systems from GE, Siemens, and Philips. High-field imaging for advanced diagnostics. FDA registered with full warranty."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-accent py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                <Zap className="h-3 w-3" />
                PREMIUM HIGH-FIELD
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                3.0T MRI Systems
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Experience superior imaging quality with our premium 3.0T MRI systems.
                Ideal for neurological, musculoskeletal, and advanced research applications.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Shield className="h-5 w-5 text-accent" />
                  <span>FDA Registered</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Award className="h-5 w-5 text-accent" />
                  <span>12-Month Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Truck className="h-5 w-5 text-accent" />
                  <span>Full Installation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Systems Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {systems.map((system, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={system.image}
                          alt={system.name}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded ${
                            system.status === "In Stock"
                              ? "bg-success text-success-foreground"
                              : "bg-warning text-warning-foreground"
                          }`}
                        >
                          {system.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">
                          {system.name}
                        </h3>
                        <ul className="space-y-1 mb-4">
                          {system.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full">
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Quote Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <QuoteForm
                    sourcePage="3T Systems"
                    prefilledInterest="3T Systems"
                    variant="sidebar"
                    title="Get a Quote"
                    subtitle="Looking for a 3.0T system? Tell us about your imaging needs."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Systems3T;
