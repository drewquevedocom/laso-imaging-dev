import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const sitemapSections = [
  {
    title: 'MRI Systems',
    links: [
      { label: 'All MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"' },
      { label: '1.5T MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems"' },
      { label: '3.0T MRI Systems', href: '/products?query=product_type:"3.0T MRI Systems"' },
      { label: 'Mobile MRI Systems', href: '/products?query=product_type:"Mobile MRI Systems"' },
      { label: 'GE Healthcare MRI', href: '/products?query=vendor:"GE Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems")' },
      { label: 'Siemens Healthineers MRI', href: '/products?query=vendor:"Siemens Healthineers" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems")' },
      { label: 'Philips Healthcare MRI', href: '/products?query=vendor:"Philips Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems")' },
      { label: 'Canon Medical MRI', href: '/products?query=vendor:"Canon Medical Systems" product_type:"1.5T MRI Systems"' },
    ]
  },
  {
    title: 'CT Scanners',
    links: [
      { label: 'All CT Scanners', href: '/products?query=product_type:"8-Slice CT" OR product_type:"16-Slice CT" OR product_type:"64-Slice CT"' },
      { label: '8-Slice CT Scanners', href: '/products?query=product_type:"8-Slice CT"' },
      { label: '16-Slice CT Scanners', href: '/products?query=product_type:"16-Slice CT"' },
      { label: '64-Slice CT Scanners', href: '/products?query=product_type:"64-Slice CT"' },
      { label: 'Portable C-Arms', href: '/products?query=product_type:"Portable C-Arm"' },
    ]
  },
  {
    title: 'Parts & Components',
    links: [
      { label: 'All Parts', href: '/products?query=product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies"' },
      { label: 'RF Coils', href: '/products?query=product_type:"RF Coils"' },
      { label: 'MRI Parts', href: '/products?query=product_type:"MRI Parts"' },
      { label: 'Power Supplies', href: '/products?query=product_type:"Power Supplies"' },
      { label: 'Head Coils', href: '/products?query=product_type:"RF Coils" Head' },
      { label: 'Body Coils', href: '/products?query=product_type:"RF Coils" Body' },
      { label: 'Spine Coils', href: '/products?query=product_type:"RF Coils" Spine' },
      { label: 'Cold Heads', href: '/products?query=product_type:"Power Supplies" Coldhead' },
      { label: 'Compressors', href: '/products?query=product_type:"Power Supplies" Compressor' },
    ]
  },
  {
    title: 'Parts by Manufacturer',
    links: [
      { label: 'GE Parts', href: '/products?query=vendor:"GE Healthcare" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Siemens Parts', href: '/products?query=vendor:"Siemens Healthineers" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Philips Parts', href: '/products?query=vendor:"Philips Healthcare" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Canon Medical Parts', href: '/products?query=vendor:"Canon Medical Systems" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
    ]
  },
  {
    title: 'Installation Services',
    links: [
      { label: 'MRI Installation', href: '/services/mri-installation' },
      { label: 'Equipment Relocation', href: '/services/relocation' },
      { label: 'Site Planning', href: '/services/site-planning' },
      { label: 'Deinstallation', href: '/services/deinstallation' },
    ]
  },
  {
    title: 'Maintenance Services',
    links: [
      { label: 'Preventive Maintenance', href: '/services/preventive-maintenance' },
      { label: 'Emergency Repairs', href: '/services/emergency-repairs' },
      { label: 'Software Updates', href: '/services/software-updates' },
      { label: 'Remote Diagnostics', href: '/services/remote-diagnostics' },
    ]
  },
  {
    title: 'Cryogenic Services',
    links: [
      { label: 'Helium Refills', href: '/services/helium-refills' },
      { label: 'Cold Head Service', href: '/services/cold-head-service' },
      { label: 'Compressor Service', href: '/services/compressor-service' },
      { label: 'System Recovery', href: '/services/system-recovery' },
    ]
  },
  {
    title: 'Training & Support',
    links: [
      { label: 'Operator Training', href: '/services/operator-training' },
      { label: 'Technical Training', href: '/services/technical-courses' },
      { label: 'Safety Certification', href: '/services/safety-certification' },
      { label: 'On-site Training', href: '/services/onsite-training' },
    ]
  },
  {
    title: 'Mobile & Rental',
    links: [
      { label: 'Mobile MRI Rental', href: '/services/mobile-mri-rental' },
      { label: 'Interim Projects', href: '/services/interim-projects' },
      { label: 'Nationwide Coverage', href: '/services/nationwide-coverage' },
    ]
  },
  {
    title: 'Consulting & Financing',
    links: [
      { label: 'Consulting Services', href: '/services/consulting' },
      { label: 'Equipment Financing', href: '/services/financing' },
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Technical Support', href: '/support/technical' },
      { label: 'Warranty Information', href: '/support/warranty' },
      { label: 'Returns', href: '/support/returns' },
      { label: 'Documentation', href: '/support/documentation' },
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
      { label: 'Buy & Sell Equipment', href: '/buy-sell' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Customer Login', href: '/auth/customer' },
      { label: 'Customer Portal', href: '/portal' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
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
