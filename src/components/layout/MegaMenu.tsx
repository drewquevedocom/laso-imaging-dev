import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'BY FIELD STRENGTH',
    items: [
      { label: '1.5T MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems"' },
      { label: '3.0T MRI Systems', href: '/products?query=product_type:"3.0T MRI Systems"' },
      { label: 'Mobile MRI Systems', href: '/products?query=product_type:"Mobile MRI Systems"' },
      { label: 'All MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"' },
    ],
    viewAll: { label: 'View All MRI', href: '/products?query=product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"' }
  },
  {
    title: 'CT SCANNERS',
    items: [
      { label: '8-Slice CT Scanners', href: '/products?query=product_type:"8-Slice CT"' },
      { label: '16-Slice CT Scanners', href: '/products?query=product_type:"16-Slice CT"' },
      { label: '64-Slice CT Scanners', href: '/products?query=product_type:"64-Slice CT"' },
      { label: 'Portable C-Arms', href: '/products?query=product_type:"Portable C-Arm"' },
    ],
    viewAll: { label: 'View All CT', href: '/products?query=product_type:"8-Slice CT" OR product_type:"16-Slice CT" OR product_type:"64-Slice CT"' }
  },
  {
    title: 'MOBILE SOLUTIONS',
    items: [
      { label: 'Mobile MRI Rental', href: '/services/mobile-mri-rental' },
      { label: 'Mobile MRI Systems', href: '/products?query=product_type:"Mobile MRI Systems"' },
      { label: 'Interim Projects', href: '/services/interim-projects' },
      { label: 'Nationwide Coverage', href: '/services/nationwide-coverage' },
    ],
    viewAll: { label: 'View All Mobile', href: '/products?query=product_type:"Mobile MRI Systems"' }
  },
  {
    title: 'BY BRAND',
    items: [
      { label: 'GE Healthcare', href: '/products?query=vendor:"GE Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems")' },
      { label: 'Siemens Healthineers', href: '/products?query=vendor:"Siemens Healthineers" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
      { label: 'Philips Healthcare', href: '/products?query=vendor:"Philips Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
      { label: 'Canon Medical (Toshiba)', href: '/products?query=vendor:"Canon Medical Systems" (product_type:"1.5T MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
    ],
    viewAll: { label: 'View All Brands', href: '/products?query=product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"' }
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

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Link 
            to="/products?category=imaging-systems"
            className="
              inline-flex items-center gap-2 text-sm font-semibold 
              text-accent hover:text-accent/80 transition-colors
              group
            "
          >
            Browse All Imaging Systems
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Need Help? Call <strong className="text-foreground">1-800-MRI-LASO</strong></span>
            <span>•</span>
            <Link to="/quote" className="hover:text-accent transition-colors">Request a Quote</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
