import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
}

const menuColumns = [
  {
    title: 'BY FIELD STRENGTH',
    items: [
      '1.5T MRI Systems',
      '3.0T MRI Systems',
      'Open MRI Systems',
      'Extremity MRI',
    ],
    viewAll: 'View All Systems'
  },
  {
    title: 'BY CONDITION',
    items: [
      'Refurbished MRI',
      'Used MRI Systems',
      'Certified Pre-Owned',
      'New Equipment',
    ],
    viewAll: 'View All Conditions'
  },
  {
    title: 'MOBILE SOLUTIONS',
    items: [
      'Mobile MRI Rental',
      'Mobile MRI Systems',
      'Interim Projects',
      'Nationwide Coverage',
    ],
    viewAll: 'View All Mobile'
  },
  {
    title: 'BY BRAND',
    items: [
      'GE Healthcare',
      'Siemens Healthineers',
      'Philips Healthcare',
      'Toshiba / Canon Medical',
    ],
    viewAll: 'View All Brands'
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
                  <li key={item}>
                    <a 
                      href="#" 
                      className="
                        group flex items-center text-sm text-foreground/80 
                        hover:text-accent transition-colors duration-200
                        py-1.5
                      "
                    >
                      <span className="relative">
                        {item}
                        <span className="
                          absolute bottom-0 left-0 w-0 h-0.5 bg-accent
                          group-hover:w-full transition-all duration-300
                        " />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* View All Link */}
              <a 
                href="#" 
                className="
                  inline-flex items-center gap-1 mt-4 text-xs font-semibold 
                  text-primary hover:text-accent transition-colors duration-200
                  group
                "
              >
                {column.viewAll}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <a 
            href="#" 
            className="
              inline-flex items-center gap-2 text-sm font-semibold 
              text-accent hover:text-accent/80 transition-colors
              group
            "
          >
            Browse All Equipment
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Need Help? Call <strong className="text-foreground">(844) 511-5276</strong></span>
            <span>•</span>
            <a href="#" className="hover:text-accent transition-colors">Request a Quote</a>
          </div>
        </div>
      </div>
    </div>
  );
};
