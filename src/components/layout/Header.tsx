import { useState } from 'react';
import { ChevronDown, Check, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { MegaMenu } from './MegaMenu';
import { PartsMegaMenu } from './PartsMegaMenu';
import { ServicesMegaMenu } from './ServicesMegaMenu';
import { MobileNav } from './MobileNav';

import logoLaso from '@/assets/logo-laso.png';
import userIcon from '@/assets/icons/user.png';
import messageIcon from '@/assets/icons/message.png';
import cartIcon from '@/assets/icons/cart.png';

const trustBadges = [
  'FDA Registered',
  '18+ Years',
  'BBB A+',
  '150+ Facilities Served'
];

const navItems = [
  { label: 'EQUIPMENT', hasDropdown: true, key: 'equipment' },
  { label: 'PARTS', hasDropdown: true, key: 'parts' },
  { label: 'SERVICES', hasDropdown: true, key: 'services' },
  { label: 'CONTACT', hasDropdown: false, key: 'contact' },
  { label: 'ADMIN', hasDropdown: false, key: 'admin', isAccent: true },
];

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('equipment');

  const handleNavHover = (key: string, hasDropdown: boolean) => {
    if (hasDropdown) {
      setActiveDropdown(key);
    }
  };

  const handleNavLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="w-full relative z-50">
      {/* Row 1: Trust Bar */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-success-foreground" />
                </div>
                <span className="text-foreground font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Navigation */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs md:text-sm">
            {/* Left Links */}
            <nav className="hidden lg:flex items-center gap-4">
              {['About Us', 'Track Order', 'Contact Us', 'FAQs'].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="hover:text-accent transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Center - Sign Up */}
            <div className="flex-1 text-center">
              <span className="text-primary-foreground/80">
                Sign up for 10% off your first order: {' '}
              </span>
              <a href="#" className="text-warning font-bold hover:underline">
                Sign Up
              </a>
            </div>

            {/* Right - Contact Info */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:8445115276" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>Toll Free: (844) 511-5276</span>
              </a>
              <span className="text-primary-foreground/40">|</span>
              <a href="mailto:info@lasoimaging.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>info@lasoimaging.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Main Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img 
                src={logoLaso} 
                alt="LASO Imaging Solutions" 
                className="h-10 md:h-14 w-auto"
              />
            </a>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden lg:block">
              <SearchBar />
            </div>

            {/* Account Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              <a href="#" className="hidden md:flex flex-col items-center gap-1 group">
                <img 
                  src={userIcon} 
                  alt="Account" 
                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Your Account
                </span>
              </a>
              
              <a href="#" className="hidden md:flex flex-col items-center gap-1 group">
                <img 
                  src={messageIcon} 
                  alt="Messages" 
                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Your Messages
                </span>
              </a>
              
              <a href="#" className="flex flex-col items-center gap-1 group relative">
                <img 
                  src={cartIcon} 
                  alt="Cart" 
                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors hidden md:block">
                  Your Cart
                </span>
                {/* Cart Badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </a>

              {/* Mobile Nav Toggle */}
              <MobileNav />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Main Navigation - Desktop Only */}
      <div 
        className="bg-primary relative hidden lg:block"
        onMouseLeave={handleNavLeave}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Navigation Items */}
            <nav className="flex items-center">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  className={`
                    relative flex items-center gap-1.5 px-5 py-4 text-sm font-semibold
                    transition-all duration-200
                    ${item.isAccent 
                      ? 'text-warning hover:text-warning/80' 
                      : 'text-primary-foreground hover:bg-primary-foreground/10'
                    }
                    ${activeNav === item.key && !item.isAccent ? 'bg-primary-foreground/10' : ''}
                  `}
                  onMouseEnter={() => handleNavHover(item.key, item.hasDropdown)}
                  onClick={() => setActiveNav(item.key)}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={`
                        w-4 h-4 transition-transform duration-200
                        ${activeDropdown === item.key ? 'rotate-180' : ''}
                      `}
                    />
                  )}
                  
                  {/* Active Indicator */}
                  {activeNav === item.key && !item.isAccent && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <Button variant="cta" size="lg" className="my-2">
              Get Quote Now
            </Button>
          </div>
        </div>

        {/* Mega Menus */}
        <MegaMenu isOpen={activeDropdown === 'equipment'} />
        <PartsMegaMenu isOpen={activeDropdown === 'parts'} />
        <ServicesMegaMenu isOpen={activeDropdown === 'services'} />
      </div>
    </header>
  );
};

export default Header;
