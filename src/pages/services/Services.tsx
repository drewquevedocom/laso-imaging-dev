import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { ArrowRight, Wrench, Truck, Thermometer, GraduationCap } from 'lucide-react';

const serviceCategories = [
  {
    title: 'Installation Services',
    description: 'Complete MRI and CT scanner installation, relocation, and site planning services.',
    icon: Truck,
    services: [
      { name: 'New System Install', href: '/services/mri-installation' },
      { name: 'Relocation Services', href: '/services/relocation' },
      { name: 'Site Planning', href: '/services/site-planning' },
      { name: 'De-installation', href: '/services/deinstallation' },
    ]
  },
  {
    title: 'Maintenance & Repair',
    description: 'Preventive maintenance, emergency repairs, and software updates for all major brands.',
    icon: Wrench,
    services: [
      { name: 'Preventive Maintenance', href: '/services/preventive-maintenance' },
      { name: 'Emergency Repairs', href: '/services/emergency-repairs' },
      { name: 'Software Updates', href: '/services/software-updates' },
      { name: 'Remote Diagnostics', href: '/services/remote-diagnostics' },
    ]
  },
  {
    title: 'Cryogenic Services',
    description: 'Expert helium refills, cold head service, and compressor maintenance.',
    icon: Thermometer,
    services: [
      { name: 'Helium Refills', href: '/services/helium-refills' },
      { name: 'Cold Head Service', href: '/services/cold-head-service' },
      { name: 'Compressor Service', href: '/services/compressor-service' },
      { name: 'System Recovery', href: '/services/system-recovery' },
    ]
  },
  {
    title: 'Training Programs',
    description: 'Comprehensive operator training and safety certification courses.',
    icon: GraduationCap,
    services: [
      { name: 'Operator Training', href: '/services/operator-training' },
      { name: 'Safety Certification', href: '/services/safety-certification' },
      { name: 'Technical Courses', href: '/services/technical-courses' },
      { name: 'On-site Training', href: '/services/onsite-training' },
    ]
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Medical Imaging Services"
        description="Comprehensive MRI and CT scanner services including installation, maintenance, cryogenic services, and operator training. Nationwide coverage with 24/7 emergency support."
        keywords={['MRI service', 'CT scanner maintenance', 'medical imaging installation', 'helium refill', 'MRI training']}
        canonical="/services"
        type="service"
      />
      <LocalBusinessSchema />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Medical Imaging Services
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Complete lifecycle support for your MRI, CT, and X-Ray equipment with nationwide coverage
            </p>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {serviceCategories.map((category) => (
                <div key={category.title} className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">{category.description}</p>
                  <ul className="space-y-3">
                    {category.services.map((service) => (
                      <li key={service.name}>
                        <Link 
                          to={service.href}
                          className="group flex items-center justify-between text-foreground hover:text-accent transition-colors"
                        >
                          <span>{service.name}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
