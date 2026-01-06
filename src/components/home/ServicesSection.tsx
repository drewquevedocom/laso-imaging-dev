import { Link } from "react-router-dom";
import { Monitor, Truck, Package, GraduationCap, Wrench, Users, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Monitor,
      title: "Imaging Systems",
      description: "New and certified pre-owned imaging systems from leading manufacturers. Complete installation and commissioning.",
      link: "/equipment/1-5t-mri-systems",
    },
    {
      icon: Truck,
      title: "System Rentals",
      description: "Flexible rental programs for temporary needs, system replacements, or expanding capacity during peak demand.",
      link: "/services/mobile-rental",
    },
    {
      icon: Package,
      title: "Parts Catalog",
      description: "Over 400,000 MRI parts in stock. Coils, gradients, cryogenics, electronics - all tested and certified.",
      link: "/parts",
    },
    {
      icon: GraduationCap,
      title: "Training Programs",
      description: "Comprehensive operator and service engineer training. On-site and virtual options available.",
      link: "/services/training",
    },
    {
      icon: Wrench,
      title: "Service & Support",
      description: "Preventive maintenance, repairs, and system upgrades by factory-trained engineers.",
      link: "/services/maintenance",
    },
    {
      icon: Users,
      title: "Consulting",
      description: "Expert guidance on system selection, site planning, and regulatory compliance.",
      link: "/services/consulting",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-muted-foreground text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl font-bold text-foreground mt-2">Complete MRI Solutions</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            From acquisition to training and ongoing support, we provide everything your facility needs for diagnostic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="group p-6 bg-card rounded-xl border border-border hover:border-accent/50 hover:shadow-card transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <service.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
              <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
