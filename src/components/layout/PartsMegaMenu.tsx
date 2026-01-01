import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PartsMegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'BY CATEGORY',
    items: [
      { label: 'MRI Coils', href: '/parts/mri-coils' },
      { label: 'Gradient Amplifiers', href: '/parts/gradient-amplifiers' },
      { label: 'RF Amplifiers', href: '/parts/rf-amplifiers' },
      { label: 'Cold Heads', href: '/parts/cold-heads' },
      { label: 'Compressors', href: '/parts/compressors' },
    ],
    viewAll: { label: 'View All Parts', href: '/parts' }
  },
  {
    title: 'BY MANUFACTURER',
    items: [
      { label: 'GE Healthcare', href: '/parts/brand/ge' },
      { label: 'Siemens', href: '/parts/brand/siemens' },
      { label: 'Philips', href: '/parts/brand/philips' },
      { label: 'Toshiba/Canon', href: '/parts/brand/toshiba' },
      { label: 'Hitachi', href: '/parts/brand/hitachi' },
    ],
    viewAll: { label: 'View All Brands', href: '/parts' }
  },
  {
    title: 'COILS & ACCESSORIES',
    items: [
      { label: 'Head Coils', href: '/parts/head-coils' },
      { label: 'Body Coils', href: '/parts/body-coils' },
      { label: 'Knee Coils', href: '/parts/knee-coils' },
      { label: 'Spine Coils', href: '/parts/spine-coils' },
      { label: 'Extremity Coils', href: '/parts/extremity-coils' },
    ],
    viewAll: { label: 'View All Coils', href: '/parts/coils' }
  },
  {
    title: 'SUPPORT',
    items: [
      { label: 'Parts Request', href: '/quote?interest=Parts' },
      { label: 'Technical Support', href: '/support/technical' },
      { label: 'Warranty Info', href: '/support/warranty' },
      { label: 'Returns', href: '/support/returns' },
      { label: 'Documentation', href: '/support/documentation' },
    ],
    viewAll: { label: 'Contact Parts Dept', href: '/contact' }
  }
];

export const PartsMegaMenu = ({ isOpen }: PartsMegaMenuProps) => {
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
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Link 
            to="/parts"
            className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold transition-colors group"
          >
            Browse All Parts
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Need help finding a part?</span>
            <Link to="/quote?interest=Parts" className="text-accent hover:text-primary font-semibold">
              Request Quick Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsMegaMenu;
