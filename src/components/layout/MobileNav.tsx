import { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import logoLaso from '@/assets/logo-laso.png';

const equipmentItems = [
  { title: 'BY FIELD STRENGTH', items: ['1.5T MRI Systems', '3.0T MRI Systems', 'Open MRI Systems', 'Extremity MRI'] },
  { title: 'BY CONDITION', items: ['Refurbished MRI', 'Used MRI Systems', 'Certified Pre-Owned', 'New Equipment'] },
  { title: 'MOBILE SOLUTIONS', items: ['Mobile MRI Rental', 'Mobile MRI Systems', 'Interim Projects'] },
  { title: 'BY BRAND', items: ['GE Healthcare', 'Siemens Healthineers', 'Philips Healthcare', 'Canon Medical'] }
];

const partsItems = [
  { title: 'BY CATEGORY', items: ['MRI Coils', 'Gradient Amplifiers', 'RF Amplifiers', 'Cold Heads'] },
  { title: 'BY MANUFACTURER', items: ['GE Healthcare', 'Siemens', 'Philips', 'Toshiba/Canon'] },
  { title: 'COILS', items: ['Head Coils', 'Body Coils', 'Knee Coils', 'Spine Coils'] }
];

const servicesItems = [
  { title: 'INSTALLATION', items: ['New System Install', 'Relocation Services', 'Site Planning'] },
  { title: 'MAINTENANCE', items: ['Preventive Maintenance', 'Emergency Repairs', 'Software Updates'] },
  { title: 'CRYOGENIC', items: ['Helium Refills', 'Cold Head Service', 'System Recovery'] }
];

interface NavSectionProps {
  title: string;
  items: { title: string; items: string[] }[];
}

const NavSection = ({ title, items }: NavSectionProps) => {
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
                <li key={item}>
                  <a href="#" className="text-sm text-foreground hover:text-accent transition-colors">
                    {item}
                  </a>
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
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-10 h-10 text-foreground hover:text-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <NavSection title="EQUIPMENT" items={equipmentItems} />
              <NavSection title="PARTS" items={partsItems} />
              <NavSection title="SERVICES" items={servicesItems} />
              
              <a href="#" className="flex items-center py-3 px-4 text-foreground font-semibold hover:bg-secondary transition-colors">
                CONTACT
              </a>
              <a href="#" className="flex items-center py-3 px-4 text-warning font-semibold hover:bg-secondary transition-colors">
                ADMIN
              </a>
            </div>

            {/* CTA */}
            <div className="px-4 py-4 border-t border-border">
              <Button className="w-full" variant="cta" size="lg">
                Get Quote Now
              </Button>
            </div>

            {/* Account Links */}
            <div className="px-4 py-4 border-t border-border space-y-3">
              <a href="#" className="flex items-center gap-3 text-foreground hover:text-accent transition-colors">
                <span className="text-sm font-medium">Your Account</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-foreground hover:text-accent transition-colors">
                <span className="text-sm font-medium">Your Messages</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-foreground hover:text-accent transition-colors">
                <span className="text-sm font-medium">Your Cart</span>
              </a>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-secondary/50">
            <div className="space-y-2 text-sm">
              <a href="tel:8445115276" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>(844) 511-5276</span>
              </a>
              <a href="mailto:info@lasoimaging.com" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
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
