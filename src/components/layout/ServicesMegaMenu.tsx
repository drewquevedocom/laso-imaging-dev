import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServicesMegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'INSTALLATION',
    items: [
      { label: 'New System Install', href: '/services/mri-installation' },
      { label: 'Relocation Services', href: '/services/relocation' },
      { label: 'Site Planning', href: '/services/site-planning' },
      { label: 'De-installation', href: '/services/deinstallation' },
    ],
    viewAll: { label: 'View All Install', href: '/services' }
  },
  {
    title: 'MAINTENANCE',
    items: [
      { label: 'Preventive Maintenance', href: '/services/preventive-maintenance' },
      { label: 'Emergency Repairs', href: '/services/emergency-repairs' },
      { label: 'Software Updates', href: '/services/software-updates' },
      { label: 'Remote Diagnostics', href: '/services/remote-diagnostics' },
    ],
    viewAll: { label: 'View All Maintenance', href: '/services' }
  },
  {
    title: 'CRYOGENIC SERVICES',
    items: [
      { label: 'Helium Refills', href: '/services/helium-refills' },
      { label: 'Cold Head Service', href: '/services/cold-head-service' },
      { label: 'Compressor Service', href: '/services/compressor-service' },
      { label: 'System Recovery', href: '/services/system-recovery' },
    ],
    viewAll: { label: 'View All Cryo', href: '/services' }
  },
  {
    title: 'TRAINING & MOBILE',
    items: [
      { label: 'Operator Training', href: '/services/operator-training' },
      { label: 'Safety Certification', href: '/services/safety-certification' },
      { label: 'Mobile MRI Rental', href: '/services/mobile-mri-rental' },
      { label: 'Nationwide Coverage', href: '/services/nationwide-coverage' },
    ],
    viewAll: { label: 'View All Services', href: '/services' }
  }
];

export const ServicesMegaMenu = ({ isOpen }: ServicesMegaMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-background shadow-xl border-t border-border animate-mega-menu-open">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {menuColumns.map((column, colIndex) => (
            <div 
              key={column.title} 
              className={`mega-menu-column stagger-${colIndex + 1}`}
            >
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium relative group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link 
                to={column.viewAll.href}
                className="inline-flex items-center gap-1 mt-4 text-accent hover:text-primary text-sm font-semibold group"
              >
                {column.viewAll.label}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/services"
              className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold transition-colors group"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/resources/safety" className="text-foreground hover:text-accent transition-colors font-medium">
                Safety Resources
              </Link>
              <span>Need a custom service plan?</span>
              <Link to="/quote?interest=Service" className="text-accent hover:text-primary font-semibold">
                Request Service Quote
              </Link>
            </div>
          </div>
          {/* Service Areas */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground font-medium">Service Areas:</span>
            <Link to="/service-areas/california" className="text-foreground hover:text-accent transition-colors">California</Link>
            <Link to="/service-areas/west-coast" className="text-foreground hover:text-accent transition-colors">West Coast</Link>
            <Link to="/service-areas/nationwide" className="text-foreground hover:text-accent transition-colors">Nationwide</Link>
            <Link to="/service-areas" className="text-accent hover:text-primary font-medium">View All →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
