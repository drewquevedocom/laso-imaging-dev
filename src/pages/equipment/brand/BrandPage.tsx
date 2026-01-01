import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/shared/QuoteForm";
import { CheckCircle2, Shield, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentFilters, { FilterState } from "@/components/equipment/EquipmentFilters";
import mriSystem1 from "@/assets/mri-system-1.jpg";
import heroMri from "@/assets/hero-mri.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

// Image mapping for brand systems
const systemImages = [mriSystem1, heroMri, ctScanner, mobileMri];

interface BrandInfo {
  name: string;
  fullName: string;
  description: string;
  color: string;
  systems: Array<{
    name: string;
    type: string;
    features: string[];
    status: string;
  }>;
}

const brandData: Record<string, BrandInfo> = {
  ge: {
    name: "GE",
    fullName: "GE Healthcare",
    description: "GE Healthcare has been a leader in medical imaging for over a century. Their MRI systems are known for reliability, advanced technology, and exceptional image quality.",
    color: "from-blue-600 to-blue-800",
    systems: [
      { name: "GE SIGNA Premier 3.0T", type: "3T", features: ["AIR Technology", "128 Channel"], status: "In Stock" },
      { name: "GE Signa HDxt 1.5T", type: "1.5T", features: ["16 Channel", "Optix RF"], status: "In Stock" },
      { name: "GE Discovery MR750 3.0T", type: "3T", features: ["32 Channel", "PROPELLER 3.0"], status: "In Stock" },
      { name: "GE Optima MR450w 1.5T", type: "1.5T", features: ["Wide Bore 70cm", "OpTix RF"], status: "Available Soon" },
    ],
  },
  siemens: {
    name: "Siemens",
    fullName: "Siemens Healthineers",
    description: "Siemens Healthineers pioneers breakthrough innovations in diagnostic and therapeutic imaging. Their MRI systems feature cutting-edge technology like BioMatrix and Tim 4G.",
    color: "from-teal-600 to-teal-800",
    systems: [
      { name: "Siemens MAGNETOM Vida 3T", type: "3T", features: ["BioMatrix", "128 Channel"], status: "In Stock" },
      { name: "Siemens MAGNETOM Aera 1.5T", type: "1.5T", features: ["Tim 4G", "Dot Engine"], status: "In Stock" },
      { name: "Siemens MAGNETOM Skyra 3T", type: "3T", features: ["70cm Bore", "Tim 4G"], status: "In Stock" },
      { name: "Siemens MAGNETOM Essenza 1.5T", type: "1.5T", features: ["Compact Design", "Tim"], status: "Available Soon" },
    ],
  },
  philips: {
    name: "Philips",
    fullName: "Philips Healthcare",
    description: "Philips Healthcare is known for innovative patient-centric design and advanced imaging technologies. Their Ingenia and Achieva platforms set industry standards.",
    color: "from-blue-500 to-indigo-700",
    systems: [
      { name: "Philips Ingenia Elition 3.0T", type: "3T", features: ["Compressed SENSE", "SmartSpeed"], status: "In Stock" },
      { name: "Philips Ingenia 1.5T", type: "1.5T", features: ["dStream", "Ambient Experience"], status: "In Stock" },
      { name: "Philips Achieva 3.0T TX", type: "3T", features: ["MultiTransmit", "32 Channel"], status: "Available Soon" },
      { name: "Philips Achieva 1.5T", type: "1.5T", features: ["Quasar Dual Gradient", "SENSE"], status: "In Stock" },
    ],
  },
  canon: {
    name: "Canon",
    fullName: "Canon Medical Systems",
    description: "Canon Medical Systems (formerly Toshiba Medical) delivers innovative imaging solutions with technologies like Pianissimo for ultra-quiet MRI scanning.",
    color: "from-red-600 to-red-800",
    systems: [
      { name: "Canon Vantage Orian 1.5T", type: "1.5T", features: ["Pianissimo", "Saturn Gradient"], status: "In Stock" },
      { name: "Canon Vantage Titan 3T", type: "3T", features: ["SPEEDER", "M-Power"], status: "Available Soon" },
      { name: "Canon Vantage Elan 1.5T", type: "1.5T", features: ["Compact Footprint", "Pianissimo"], status: "In Stock" },
    ],
  },
  hitachi: {
    name: "Hitachi",
    fullName: "Hitachi Healthcare",
    description: "Hitachi Healthcare specializes in open MRI systems that provide exceptional patient comfort while maintaining high image quality for diagnostic excellence.",
    color: "from-gray-700 to-gray-900",
    systems: [
      { name: "Hitachi OASIS 1.2T Open", type: "Open", features: ["Open Design", "Zenith RF"], status: "In Stock" },
      { name: "Hitachi ECHELON Oval 1.5T", type: "1.5T", features: ["Oval Bore", "WIT Technology"], status: "In Stock" },
      { name: "Hitachi AIRIS Elite 0.3T", type: "Open", features: ["Open Design", "Compact"], status: "Available Soon" },
    ],
  },
};

const BrandPage = () => {
  const { brand } = useParams<{ brand: string }>();
  const brandInfo = brand ? brandData[brand.toLowerCase()] : null;

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "All",
    fieldStrength: "All",
    availability: "All",
  });

  const filteredSystems = useMemo(() => {
    if (!brandInfo) return [];
    return brandInfo.systems.filter((system) => {
      const matchesSearch = system.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesFieldStrength =
        filters.fieldStrength === "All" || system.type === filters.fieldStrength;
      const matchesAvailability =
        filters.availability === "All" ||
        system.status === filters.availability;

      return matchesSearch && matchesFieldStrength && matchesAvailability;
    });
  }, [filters, brandInfo]);

  if (!brandInfo) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Brand Not Found</h1>
            <p className="text-muted-foreground">The brand you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{brandInfo.fullName} MRI Systems | LASO Imaging</title>
        <meta
          name="description"
          content={`Browse our selection of ${brandInfo.fullName} MRI systems. Refurbished and certified with 12-month warranty. FDA registered.`}
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${brandInfo.color} py-16 md:py-24`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                {brandInfo.name.toUpperCase()} MRI SYSTEMS
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {brandInfo.fullName}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                {brandInfo.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="h-5 w-5" />
                  <span>FDA Registered</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="h-5 w-5" />
                  <span>12-Month Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Truck className="h-5 w-5" />
                  <span>Installation Included</span>
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
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Available {brandInfo.name} Systems
                </h2>

                {/* Filters */}
                <EquipmentFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  showBrand={false}
                  showFieldStrength={true}
                  totalCount={brandInfo.systems.length}
                  filteredCount={filteredSystems.length}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSystems.map((system, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={systemImages[index % systemImages.length]}
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
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                          {system.type}
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

                  {filteredSystems.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-muted rounded-xl">
                      <p className="text-muted-foreground">
                        No systems match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Quote Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <QuoteForm
                    sourcePage={`${brandInfo.name} Brand Page`}
                    prefilledInterest="1.5T Systems"
                    variant="sidebar"
                    title={`Get a ${brandInfo.name} Quote`}
                    subtitle={`Interested in ${brandInfo.fullName} equipment? Let us help.`}
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

export default BrandPage;
