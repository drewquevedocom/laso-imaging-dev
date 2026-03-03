import { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import logoLaso from '@/assets/logo-laso.png';
import { trackPhoneCall } from '@/components/analytics/GoogleAnalytics';
import { MobileSearchInput } from './MobileSearchInput';
import { ThemeToggleButton } from './ThemeToggleButton';

// ─── EQUIPMENT (mirrors MegaMenu.tsx exactly) ───
const equipmentItems = [
  {
    title: 'BY FIELD STRENGTH',
    items: [
      { label: '1.5T MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems"' },
      { label: '3.0T MRI Systems', href: '/products?query=product_type:"3.0T MRI Systems"' },
      { label: 'Mobile MRI Systems', href: '/products?query=product_type:"Mobile MRI Systems"' },
      { label: 'All MRI Systems', href: '/products?query=product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"' },
    ]
  },
  {
    title: 'CT SCANNERS',
    items: [
      { label: '8-Slice CT Scanners', href: '/products?query=product_type:"8-Slice CT"' },
      { label: '16-Slice CT Scanners', href: '/products?query=product_type:"16-Slice CT"' },
      { label: '64-Slice CT Scanners', href: '/products?query=product_type:"64-Slice CT"' },
      { label: 'Portable C-Arms', href: '/products?query=product_type:"Portable C-Arm"' },
    ]
  },
  {
    title: 'MOBILE RENTALS',
    items: [
      { label: 'Mobile MRI Rental', href: '/mobile-rentals/mri' },
      { label: 'Mobile CT Rental', href: '/mobile-rentals/ct' },
      { label: 'Mobile PET/CT Rental', href: '/mobile-rentals/pet-ct' },
      { label: 'Mobile MRI Systems', href: '/products?query=product_type:"Mobile MRI Systems"' },
    ]
  },
  {
    title: 'BY BRAND',
    items: [
      { label: 'GE Healthcare', href: '/products?query=vendor:"GE Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems")' },
      { label: 'Siemens Healthineers', href: '/products?query=vendor:"Siemens Healthineers" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
      { label: 'Philips Healthcare', href: '/products?query=vendor:"Philips Healthcare" (product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
      { label: 'Canon Medical (Toshiba)', href: '/products?query=vendor:"Canon Medical Systems" (product_type:"1.5T MRI Systems" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT")' },
    ]
  }
];

const equipmentFooter = {
  primary: { label: 'Browse All Imaging Systems', href: '/products?category=imaging-systems' },
  secondary: { label: 'Request a Quote', href: '/quote' },
};

// ─── PARTS (mirrors PartsMegaMenu.tsx exactly) ───
const partsItems = [
  {
    title: 'BY CATEGORY',
    items: [
      { label: 'MRI Parts', href: '/products?query=product_type:"MRI Parts"' },
      { label: 'RF Coils', href: '/products?query=product_type:"RF Coils"' },
      { label: 'Power Supplies', href: '/products?query=product_type:"Power Supplies"' },
      { label: 'Cold Heads', href: '/products?query=product_type:"Power Supplies" Coldhead' },
      { label: 'Compressors', href: '/products?query=product_type:"Power Supplies" Compressor' },
    ]
  },
  {
    title: 'BY MANUFACTURER',
    items: [
      { label: 'GE Parts', href: '/products?query=vendor:"GE Healthcare" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Siemens Parts', href: '/products?query=vendor:"Siemens Healthineers" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Philips Parts', href: '/products?query=vendor:"Philips Healthcare" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
      { label: 'Canon/Toshiba Parts', href: '/products?query=vendor:"Canon Medical Systems" (product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"Power Supplies")' },
    ]
  },
  {
    title: 'COILS & ACCESSORIES',
    items: [
      { label: 'Head Coils', href: '/products?query=product_type:"RF Coils" Head' },
      { label: 'Body Coils', href: '/products?query=product_type:"RF Coils" Body' },
      { label: 'Shoulder Coils', href: '/products?query=product_type:"RF Coils" Shoulder' },
      { label: 'Spine Coils', href: '/products?query=product_type:"RF Coils" Spine' },
      { label: 'CTL Coils', href: '/products?query=product_type:"RF Coils" CTL' },
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { label: 'Parts Request', href: '/quote?interest=Parts' },
      { label: 'Technical Support', href: '/support/technical' },
      { label: 'Warranty Info', href: '/support/warranty' },
      { label: 'Returns', href: '/support/returns' },
      { label: 'Documentation', href: '/support/documentation' },
    ]
  }
];

const partsFooter = {
  primary: { label: 'Browse All Parts', href: '/search/parts' },
  secondary: { label: 'Request Quick Quote', href: '/quote?interest=Parts' },
};

// ─── SERVICES (mirrors ServicesMegaMenu.tsx exactly) ───
const servicesItems = [
  {
    title: 'INSTALLATION',
    items: [
      { label: 'New System Install', href: '/services/mri-installation' },
      { label: 'Relocation Services', href: '/services/relocation' },
      { label: 'Site Planning', href: '/services/site-planning' },
      { label: 'De-installation', href: '/services/deinstallation' },
    ]
  },
  {
    title: 'MAINTENANCE',
    items: [
      { label: 'Preventive Maintenance', href: '/services/preventive-maintenance' },
      { label: 'Emergency Repairs', href: '/services/emergency-repairs' },
      { label: 'Software Updates', href: '/services/software-updates' },
      { label: 'Remote Diagnostics', href: '/services/remote-diagnostics' },
    ]
  },
  {
    title: 'CRYOGENIC SERVICES',
    items: [
      { label: 'Helium Refills', href: '/services/helium-refills' },
      { label: 'Cold Head Service', href: '/services/cold-head-service' },
      { label: 'Compressor Service', href: '/services/compressor-service' },
      { label: 'System Recovery', href: '/services/system-recovery' },
    ]
  },
  {
    title: 'TRAINING & MOBILE',
    items: [
      { label: 'Operator Training', href: '/services/operator-training' },
      { label: 'Safety Certification', href: '/services/safety-certification' },
      { label: 'Mobile MRI Rental', href: '/services/mobile-mri-rental' },
      { label: 'Nationwide Coverage', href: '/services/nationwide-coverage' },
    ]
  }
];

const servicesFooter = {
  primary: { label: 'Explore All Services', href: '/services' },
  secondary: { label: 'Request Service Quote', href: '/quote?interest=Service' },
  serviceAreas: [
    { label: 'California', href: '/service-areas/california' },
    { label: 'West Coast', href: '/service-areas/west-coast' },
    { label: 'Nationwide', href: '/service-areas/nationwide' },
    { label: 'View All', href: '/service-areas' },
  ],
};

// ─── Types ───
interface NavItem { label: string; href: string; }
interface NavCategory { title: string; items: NavItem[]; }
interface SectionFooter {
  primary: NavItem;
  secondary: NavItem;
  serviceAreas?: NavItem[];
}

// ─── NavSection component ───
const NavSection = ({ title, items, footer, onClose }: {
  title: string;
  items: NavCategory[];
  footer?: SectionFooter;
  onClose: () => void;
}) => {
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

        {/* Section footer CTAs */}
        {footer && (
          <div className="px-4 py-3 border-t border-border/50 space-y-2">
            <Link
              to={footer.primary.href}
              className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary transition-colors"
              onClick={onClose}
            >
              {footer.primary.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={footer.secondary.href}
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              onClick={onClose}
            >
              {footer.secondary.label}
            </Link>
            {footer.serviceAreas && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-muted-foreground font-medium">Service Areas:</span>
                {footer.serviceAreas.map((area) => (
                  <Link
                    key={area.label}
                    to={area.href}
                    className="text-foreground hover:text-accent transition-colors"
                    onClick={onClose}
                  >
                    {area.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

// ─── Main MobileNav ───
export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleAskAI = () => {
    handleClose();
    // Trigger chatbot - dispatch custom event that ChatbotWidget listens for
    window.dispatchEvent(new CustomEvent('open-chatbot'));
  };

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

          {/* Mobile Search */}
          <div className="p-4 border-b border-border">
            <MobileSearchInput onClose={handleClose} />
          </div>

          {/* Ask LASO AI Button */}
          <div className="px-4 py-3 border-b border-border">
            <Button
              variant="outline"
              className="w-full gap-2 text-accent border-accent/30 hover:bg-accent/10"
              onClick={handleAskAI}
            >
              <Bot className="w-4 h-4" />
              Ask LASO AI
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <NavSection title="EQUIPMENT" items={equipmentItems} footer={equipmentFooter} onClose={handleClose} />
              <NavSection title="PARTS" items={partsItems} footer={partsFooter} onClose={handleClose} />
              <NavSection title="SERVICES" items={servicesItems} footer={servicesFooter} onClose={handleClose} />

              <Link
                to="/guides"
                className="flex items-center py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors"
                onClick={handleClose}
              >
                PRICING GUIDES
              </Link>
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
                to="/portal/messages"
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
                <span className="text-sm font-medium">Browse Equipment</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-secondary/50">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Dark Mode</span>
              <ThemeToggleButton />
            </div>

            <div className="space-y-2 text-sm">
              <a
                href="tel:18445115276"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                onClick={trackPhoneCall}
              >
                <Phone className="w-4 h-4" />
                <span>(844) 511-5276</span>
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
