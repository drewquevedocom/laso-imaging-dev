import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'BY FIELD STRENGTH',
    items: [
      { label: '1.5T MRI Systems', href: '/products?category=mri-systems&filter=1.5T' },
      { label: '3.0T MRI Systems', href: '/products?category=mri-systems&filter=3.0T' },
      { label: 'Open MRI Systems', href: '/products?category=mri-systems&filter=Open' },
      { label: 'Extremity MRI', href: '/products?category=mri-systems&filter=Extremity' },
    ],
    viewAll: { label: 'View All Systems', href: '/products?category=mri-systems' }
  },
  {
    title: 'BY CONDITION',
    items: [
      { label: 'Refurbished MRI', href: '/products?category=mri-systems&filter=Refurbished' },
      { label: 'Used MRI Systems', href: '/products?category=mri-systems&filter=Used' },
      { label: 'Certified Pre-Owned', href: '/products?category=mri-systems&filter=Certified' },
      { label: 'New Equipment', href: '/products?category=mri-systems&filter=New' },
    ],
    viewAll: { label: 'View All Conditions', href: '/products?category=mri-systems' }
  },
  {
    title: 'MOBILE SOLUTIONS',
    items: [
      { label: 'Mobile MRI Rental', href: '/services/mobile-mri-rental' },
      { label: 'Mobile MRI Systems', href: '/products?category=mobile-mri' },
      { label: 'Interim Projects', href: '/services/interim-projects' },
      { label: 'Nationwide Coverage', href: '/services/nationwide-coverage' },
    ],
    viewAll: { label: 'View All Mobile', href: '/products?category=mobile-mri' }
  },
  {
    title: 'BY BRAND',
    items: [
      { label: 'GE Healthcare', href: '/products?category=mri-systems&vendor=GE' },
      { label: 'Siemens Healthineers', href: '/products?category=mri-systems&vendor=Siemens' },
      { label: 'Philips Healthcare', href: '/products?category=mri-systems&vendor=Philips' },
      { label: 'Toshiba / Canon Medical', href: '/products?category=mri-systems&vendor=Toshiba' },
    ],
    viewAll: { label: 'View All Brands', href: '/products?category=mri-systems' }
  }
];

export const MegaMenu = ({ isOpen }: MegaMenuProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="
        absolute top-full left-0 w-full bg-card border-t border-border
        shadow-2xl z-50 overflow-hidden
        animate-mega-menu-open
      "
    >
      <div className="container mx-auto px-6 py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-8">
          {menuColumns.map((column, colIndex) => (
            <div 
              key={column.title}
              className="mega-menu-column"
              style={{ animationDelay: `${colIndex * 50}ms` }}
            >
              {/* Column Title */}
              <h3 className="text-xs font-bold text-accent tracking-wider mb-4 pb-2 border-b border-border">
                {column.title}
              </h3>
              
              {/* Menu Items */}
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="
                        group flex items-center text-sm text-foreground/80 
                        hover:text-accent transition-colors duration-200
                        py-1.5
                      "
                    >
                      <span className="relative">
                        {item.label}
                        <span className="
                          absolute bottom-0 left-0 w-0 h-0.5 bg-accent
                          group-hover:w-full transition-all duration-300
                        " />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* View All Link */}
              <Link 
                to={column.viewAll.href}
                className="
                  inline-flex items-center gap-1 mt-4 text-xs font-semibold 
                  text-primary hover:text-accent transition-colors duration-200
                  group
                "
              >
                {column.viewAll.label}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Link 
            to="/products?category=mri-systems"
            className="
              inline-flex items-center gap-2 text-sm font-semibold 
              text-accent hover:text-accent/80 transition-colors
              group
            "
          >
            Browse All MRI Systems
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Need Help? Call <strong className="text-foreground">(844) 511-5276</strong></span>
            <span>•</span>
            <Link to="/quote" className="hover:text-accent transition-colors">Request a Quote</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
