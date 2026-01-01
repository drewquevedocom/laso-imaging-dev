import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

const serviceData: Record<string, { title: string; description: string; metaDescription: string; keywords: string[] }> = {
  'mri-installation': {
    title: 'MRI Installation Services',
    description: 'Professional MRI system installation with comprehensive site planning and project management.',
    metaDescription: 'Expert MRI installation services including site planning, rigging, and commissioning. FDA registered with nationwide coverage.',
    keywords: ['MRI installation', 'MRI system setup', 'medical imaging installation']
  },
  'relocation': {
    title: 'Equipment Relocation Services',
    description: 'Safe and efficient relocation of MRI, CT, and X-Ray equipment to new facilities.',
    metaDescription: 'Professional medical imaging equipment relocation services. Safe transport, de-installation, and re-installation nationwide.',
    keywords: ['MRI relocation', 'CT scanner moving', 'medical equipment transport']
  },
  'site-planning': {
    title: 'Site Planning Services',
    description: 'Comprehensive site planning and preparation for medical imaging equipment installation.',
    metaDescription: 'Expert site planning for MRI and CT installation. RF shielding, structural analysis, and facility preparation services.',
    keywords: ['MRI site planning', 'imaging suite design', 'RF shielding']
  },
  'deinstallation': {
    title: 'De-installation Services',
    description: 'Professional de-installation and removal of medical imaging equipment.',
    metaDescription: 'Safe MRI and CT scanner de-installation services. Equipment removal, decommissioning, and disposal services.',
    keywords: ['MRI deinstallation', 'equipment removal', 'medical imaging decommissioning']
  },
  'preventive-maintenance': {
    title: 'Preventive Maintenance',
    description: 'Scheduled maintenance programs to maximize uptime and extend equipment life.',
    metaDescription: 'Preventive maintenance programs for MRI and CT scanners. Reduce downtime and extend equipment lifespan.',
    keywords: ['MRI maintenance', 'CT preventive maintenance', 'medical imaging service']
  },
  'emergency-repairs': {
    title: 'Emergency Repair Services',
    description: '24/7 emergency repair services for critical medical imaging equipment failures.',
    metaDescription: '24/7 emergency MRI and CT repair services. Fast response times with nationwide coverage.',
    keywords: ['MRI repair', 'emergency CT service', 'medical imaging repair']
  },
  'software-updates': {
    title: 'Software Updates',
    description: 'Keep your imaging systems current with the latest software updates and features.',
    metaDescription: 'Medical imaging software updates and upgrades. Improve performance and add new features to your MRI and CT systems.',
    keywords: ['MRI software update', 'CT scanner upgrade', 'imaging software']
  },
  'remote-diagnostics': {
    title: 'Remote Diagnostics',
    description: 'Advanced remote monitoring and diagnostics to identify issues before they cause downtime.',
    metaDescription: 'Remote diagnostics for MRI and CT scanners. Proactive monitoring to prevent equipment failures.',
    keywords: ['remote diagnostics', 'MRI monitoring', 'predictive maintenance']
  },
  'helium-refills': {
    title: 'Helium Refill Services',
    description: 'Expert helium refill and management services for superconducting MRI systems.',
    metaDescription: 'MRI helium refill services. Maintain optimal helium levels and prevent costly magnet quenches.',
    keywords: ['MRI helium refill', 'cryogenic service', 'helium management']
  },
  'cold-head-service': {
    title: 'Cold Head Service',
    description: 'Professional cold head maintenance, repair, and replacement services.',
    metaDescription: 'MRI cold head service and replacement. Expert cryogenic system maintenance nationwide.',
    keywords: ['cold head service', 'MRI cryocooler', 'cold head replacement']
  },
  'compressor-service': {
    title: 'Compressor Service',
    description: 'Comprehensive helium compressor maintenance and repair services.',
    metaDescription: 'MRI compressor service and maintenance. Keep your cryogenic system running efficiently.',
    keywords: ['MRI compressor service', 'helium compressor', 'cryogenic maintenance']
  },
  'system-recovery': {
    title: 'System Recovery',
    description: 'Emergency cryogenic system recovery and magnet quench remediation.',
    metaDescription: 'MRI system recovery after magnet quench. Fast helium recovery and system restoration services.',
    keywords: ['magnet quench recovery', 'MRI system recovery', 'cryogenic emergency']
  },
  'operator-training': {
    title: 'Operator Training',
    description: 'Comprehensive training programs for MRI and CT system operators.',
    metaDescription: 'MRI and CT operator training programs. Hands-on training to maximize equipment utilization.',
    keywords: ['MRI operator training', 'CT training', 'radiology training']
  },
  'safety-certification': {
    title: 'Safety Certification',
    description: 'MRI safety training and certification programs for healthcare professionals.',
    metaDescription: 'MRI safety certification and training. Ensure staff compliance with safety protocols.',
    keywords: ['MRI safety training', 'MRI certification', 'radiology safety']
  },
  'technical-courses': {
    title: 'Technical Courses',
    description: 'Advanced technical training for biomedical engineers and service technicians.',
    metaDescription: 'Technical training courses for MRI and CT service. Advanced troubleshooting and repair training.',
    keywords: ['MRI technical training', 'biomedical training', 'imaging service courses']
  },
  'onsite-training': {
    title: 'On-site Training',
    description: 'Customized on-site training programs at your facility.',
    metaDescription: 'On-site MRI and CT training at your facility. Customized training programs for your team.',
    keywords: ['onsite training', 'facility training', 'custom MRI training']
  },
  'mobile-mri-rental': {
    title: 'Mobile MRI Rental',
    description: 'Flexible mobile MRI rental solutions for interim capacity needs.',
    metaDescription: 'Mobile MRI rental services. Flexible terms for facility renovations, demand surges, and interim projects.',
    keywords: ['mobile MRI rental', 'temporary MRI', 'interim imaging']
  },
  'interim-projects': {
    title: 'Interim Projects',
    description: 'Temporary imaging solutions during facility renovations or equipment upgrades.',
    metaDescription: 'Interim MRI solutions for facility renovations. Maintain imaging capacity during upgrades.',
    keywords: ['interim MRI', 'temporary imaging', 'facility renovation']
  },
  'nationwide-coverage': {
    title: 'Nationwide Coverage',
    description: 'Comprehensive service coverage across the United States.',
    metaDescription: 'Nationwide MRI and CT service coverage. Local expertise with national reach.',
    keywords: ['nationwide MRI service', 'US imaging coverage', 'medical imaging service']
  },
};

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
            <Link to="/services" className="text-accent hover:underline">
              View All Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.title}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={`/services/${slug}`}
        type="service"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {service.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {service.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-secondary rounded-lg p-12 mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
                <p className="text-muted-foreground mb-6">
                  Detailed information about our {service.title.toLowerCase()} is being prepared.
                </p>
                <Link to="/quote?interest=Service">
                  <Button variant="default" size="lg">
                    Request a Quote
                  </Button>
                </Link>
              </div>
              <Link to="/services" className="text-accent hover:underline">
                ← Back to All Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
