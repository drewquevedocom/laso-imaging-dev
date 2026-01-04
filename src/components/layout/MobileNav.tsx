import { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import logoLaso from '@/assets/logo-laso.png';
import { trackPhoneCall } from '@/components/analytics/GoogleAnalytics';

const equipmentItems = [
  { 
    title: 'BY FIELD STRENGTH', 
    items: [
      { label: '1.5T MRI Systems', href: '/equipment/1-5t-systems' },
      { label: '3.0T MRI Systems', href: '/equipment/3t-systems' },
      { label: 'Open MRI Systems', href: '/equipment/open-mri-systems' },
      { label: 'Extremity MRI', href: '/equipment/extremity-mri' },
    ]
  },
  { 
    title: 'BY CONDITION', 
    items: [
      { label: 'Refurbished MRI', href: '/equipment/refurbished' },
      { label: 'Used MRI Systems', href: '/equipment/used' },
      { label: 'Certified Pre-Owned', href: '/equipment/certified-pre-owned' },
      { label: 'New Equipment', href: '/equipment/new' },
    ]
  },
  { 
    title: 'MOBILE SOLUTIONS', 
    items: [
      { label: 'Mobile MRI Rental', href: '/services/mobile-rental' },
      { label: 'Mobile MRI Systems', href: '/equipment/mobile-mri-systems' },
      { label: 'Interim Projects', href: '/services/interim-solutions' },
    ]
  },
  { 
    title: 'BY BRAND', 
    items: [
      { label: 'GE Healthcare', href: '/equipment/brand/ge' },
      { label: 'Siemens Healthineers', href: '/equipment/brand/siemens' },
      { label: 'Philips Healthcare', href: '/equipment/brand/philips' },
      { label: 'Canon Medical', href: '/equipment/brand/canon' },
    ]
  }
];

const partsItems = [
  { 
    title: 'BY CATEGORY', 
    items: [
      { label: 'MRI Coils', href: '/parts/mri-coils' },
      { label: 'Gradient Amplifiers', href: '/parts/gradient-amplifiers' },
      { label: 'RF Amplifiers', href: '/parts/rf-amplifiers' },
      { label: 'Cold Heads', href: '/parts/cold-heads' },
    ]
  },
  { 
    title: 'BY MANUFACTURER', 
    items: [
      { label: 'GE Healthcare', href: '/parts/brand/ge' },
      { label: 'Siemens', href: '/parts/brand/siemens' },
      { label: 'Philips', href: '/parts/brand/philips' },
      { label: 'Toshiba/Canon', href: '/parts/brand/canon' },
    ]
  },
  { 
    title: 'COILS', 
    items: [
      { label: 'Head Coils', href: '/parts/head-coils' },
      { label: 'Body Coils', href: '/parts/body-coils' },
      { label: 'Knee Coils', href: '/parts/knee-coils' },
      { label: 'Spine Coils', href: '/parts/spine-coils' },
    ]
  }
];

const servicesItems = [
  { 
    title: 'INSTALLATION', 
    items: [
      { label: 'New System Install', href: '/services/mri-installation' },
      { label: 'Relocation Services', href: '/services/relocation' },
      { label: 'Site Planning', href: '/services/site-planning' },
    ]
  },
  { 
    title: 'MAINTENANCE', 
    items: [
      { label: 'Preventive Maintenance', href: '/services/maintenance' },
      { label: 'Emergency Repairs', href: '/services/repairs' },
      { label: 'Software Updates', href: '/services/software' },
    ]
  },
  { 
    title: 'CRYOGENIC', 
    items: [
      { label: 'Helium Refills', href: '/services/helium' },
      { label: 'Cold Head Service', href: '/services/cold-head' },
      { label: 'System Recovery', href: '/services/recovery' },
    ]
  }
];

interface NavItem {
  label: string;
  href: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

interface NavSectionProps {
  title: string;
  items: NavCategory[];
  onClose: () => void;
}

const NavSection = ({ title, items, onClose }: NavSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors">
        {title}
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-secondary/50">
        {items.map((category) => (
          <div key={category.title} className="px-4 py-3">
            <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
              {category.title}
            </h4>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-foreground hover:text-accent transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className="lg:hidden flex items-center justify-center w-10 h-10 text-foreground"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] p-0 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <img src={logoLaso} alt="LASO Imaging" className="h-10 w-auto" />
            <button 
              onClick={handleClose}
              className="flex items-center justify-center w-10 h-10 text-foreground hover:text-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <NavSection title="EQUIPMENT" items={equipmentItems} onClose={handleClose} />
              <NavSection title="PARTS" items={partsItems} onClose={handleClose} />
              <NavSection title="SERVICES" items={servicesItems} onClose={handleClose} />
              
              <Link 
                to="/blog" 
                className="flex items-center py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors"
                onClick={handleClose}
              >
                RESOURCES
              </Link>
              <Link 
                to="/case-studies" 
                className="flex items-center py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors"
                onClick={handleClose}
              >
                CASE STUDIES
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors"
                onClick={handleClose}
              >
                CONTACT
              </Link>
              <Link 
                to="/admin/notifications" 
                className="flex items-center py-3 px-4 text-warning font-semibold hover:bg-secondary transition-colors"
                onClick={handleClose}
              >
                ADMIN
              </Link>
            </div>

            {/* CTA */}
            <div className="px-4 py-4 border-t border-border">
              <Link to="/quote" onClick={handleClose}>
                <Button className="w-full" variant="cta" size="lg">
                  Get Quote Now
                </Button>
              </Link>
            </div>

            {/* Account Links */}
            <div className="px-4 py-4 border-t border-border space-y-3">
              <Link 
                to="/signup" 
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                onClick={handleClose}
              >
                <span className="text-sm font-medium">Your Account</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                onClick={handleClose}
              >
                <span className="text-sm font-medium">Your Messages</span>
              </Link>
              <Link 
                to="/products" 
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                onClick={handleClose}
              >
                <span className="text-sm font-medium">Your Cart</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-secondary/50">
            <div className="space-y-2 text-sm">
              <a 
                href="tel:8189169503" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                onClick={trackPhoneCall}
              >
                <Phone className="w-4 h-4" />
                <span>(818) 916-9503</span>
              </a>
              <a 
                href="tel:18006745276" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                onClick={trackPhoneCall}
              >
                <Phone className="w-4 h-4" />
                <span>1-800-MRI-LASO (674-5276)</span>
              </a>
              <a 
                href="mailto:info@lasoimaging.com" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@lasoimaging.com</span>
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
