import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const sitemapSections = [
  {
    title: 'Equipment',
    links: [
      { label: 'All Equipment', href: '/products' },
      { label: '1.5T MRI Systems', href: '/equipment/1-5t-systems' },
      { label: '3.0T MRI Systems', href: '/equipment/3t-systems' },
      { label: 'Open MRI Systems', href: '/equipment/open-mri-systems' },
      { label: 'Mobile MRI Systems', href: '/equipment/mobile-mri-systems' },
      { label: 'CT Scanners', href: '/equipment/ct-scanners' },
      { label: 'X-Ray Units', href: '/equipment/xray-units' },
      { label: 'GE Healthcare', href: '/equipment/brand/ge' },
      { label: 'Siemens Healthineers', href: '/equipment/brand/siemens' },
      { label: 'Philips Healthcare', href: '/equipment/brand/philips' },
      { label: 'Canon Medical', href: '/equipment/brand/canon' },
    ]
  },
  {
    title: 'Parts',
    links: [
      { label: 'All Parts', href: '/parts' },
      { label: 'MRI Coils', href: '/parts/mri-coils' },
      { label: 'Gradient Amplifiers', href: '/parts/gradient-amplifiers' },
      { label: 'RF Amplifiers', href: '/parts/rf-amplifiers' },
      { label: 'Cold Heads', href: '/parts/cold-heads' },
      { label: 'GE Parts', href: '/parts/brand/ge' },
      { label: 'Siemens Parts', href: '/parts/brand/siemens' },
      { label: 'Philips Parts', href: '/parts/brand/philips' },
    ]
  },
  {
    title: 'Installation Services',
    links: [
      { label: 'MRI Installation', href: '/services/mri-installation' },
      { label: 'CT Installation', href: '/services/ct-installation' },
      { label: 'Equipment Relocation', href: '/services/relocation' },
      { label: 'Site Planning', href: '/services/site-planning' },
    ]
  },
  {
    title: 'Maintenance Services',
    links: [
      { label: 'Preventive Maintenance', href: '/services/maintenance' },
      { label: 'Emergency Repairs', href: '/services/repairs' },
      { label: 'Parts Replacement', href: '/services/parts-replacement' },
      { label: 'System Upgrades', href: '/services/upgrades' },
    ]
  },
  {
    title: 'Cryogenic Services',
    links: [
      { label: 'Helium Management', href: '/services/helium' },
      { label: 'Cold Head Service', href: '/services/cold-head' },
      { label: 'Magnet Services', href: '/services/magnet-services' },
      { label: 'Decommissioning', href: '/services/decommissioning' },
    ]
  },
  {
    title: 'Training Services',
    links: [
      { label: 'Operator Training', href: '/services/operator-training' },
      { label: 'Service Training', href: '/services/service-training' },
      { label: 'Safety Training', href: '/services/safety-training' },
      { label: 'Application Training', href: '/services/application-training' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog & Articles', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'FAQs', href: '/faqs' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request a Quote', href: '/quote' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Customer Portal', href: '/portal' },
    ]
  },
];

const Sitemap = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap | LASO Imaging Solutions</title>
        <meta name="description" content="Navigate all pages on LASO Imaging Solutions website. Find MRI systems, CT scanners, parts, services, and resources." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">Sitemap</h1>
            <p className="text-muted-foreground mb-10">
              Quick access to all pages on our website
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitemapSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Sitemap;
