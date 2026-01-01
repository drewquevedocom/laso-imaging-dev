import { ArrowRight } from 'lucide-react';

interface ServicesMegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'INSTALLATION',
    items: ['New System Install', 'Relocation Services', 'Site Planning', 'De-installation'],
    viewAll: 'View All Install'
  },
  {
    title: 'MAINTENANCE',
    items: ['Preventive Maintenance', 'Emergency Repairs', 'Software Updates', 'Remote Diagnostics'],
    viewAll: 'View All Maintenance'
  },
  {
    title: 'CRYOGENIC SERVICES',
    items: ['Helium Refills', 'Cold Head Service', 'Compressor Service', 'System Recovery'],
    viewAll: 'View All Cryo'
  },
  {
    title: 'TRAINING',
    items: ['Operator Training', 'Safety Certification', 'Technical Courses', 'On-site Training'],
    viewAll: 'View All Training'
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
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
              <a 
                href="#" 
                className="inline-flex items-center gap-1 mt-4 text-accent hover:text-primary text-sm font-semibold group"
              >
                {column.viewAll}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold transition-colors group"
          >
            Explore All Services
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Need a custom service plan?</span>
            <a href="#" className="text-accent hover:text-primary font-semibold">
              Request Service Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
