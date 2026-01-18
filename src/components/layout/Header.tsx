import { useState } from 'react';
import { ChevronDown, Check, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { MegaMenu } from './MegaMenu';
import { PartsMegaMenu } from './PartsMegaMenu';
import { ServicesMegaMenu } from './ServicesMegaMenu';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { trackPhoneCall } from '@/components/analytics/GoogleAnalytics';

import logoLasoDark from '@/assets/logo-laso.png';
import logoLasoLight from '@/assets/laso-logo-light.png';
import userIcon from '@/assets/icons/user.png';
import messageIcon from '@/assets/icons/message.png';

const trustBadges = [
  'FDA Registered',
  '18+ Years',
  'BBB A+',
  '150+ Facilities Served'
];

const navItems = [
  { label: 'EQUIPMENT', hasDropdown: true, key: 'equipment', href: '/products' },
  { label: 'PARTS', hasDropdown: true, key: 'parts', href: '/parts' },
  { label: 'SERVICES', hasDropdown: true, key: 'services', href: '/services' },
  { label: 'RENTALS', hasDropdown: false, key: 'rentals', href: '/rentals' },
  { label: 'RESOURCES', hasDropdown: false, key: 'resources', href: '/blog' },
  { label: 'CONTACT', hasDropdown: false, key: 'contact', href: '/contact' },
];

const topNavLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
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
              {topNavLinks.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.href}
                  className="hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center - Sign Up */}
            <div className="flex-1 text-center">
              <span className="text-primary-foreground/80">
                Sign up for 10% off your first order: {' '}
              </span>
              <Link to="/signup" className="text-white font-bold hover:underline">
                Sign Up
              </Link>
            </div>

            {/* Right - Contact Info */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="tel:18006745276" 
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
                onClick={trackPhoneCall}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>1-800-MRI-LASO</span>
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
            {/* Logo - 30% bigger */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logoLasoLight} 
                alt="LASO Imaging Solutions" 
                className="h-8 md:h-10 w-auto block dark:hidden"
              />
              <img 
                src={logoLasoDark} 
                alt="LASO Imaging Solutions" 
                className="h-8 md:h-10 w-auto hidden dark:block brightness-0 invert"
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden lg:block">
              <SearchBar />
            </div>

            {/* Account Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/signup" className="hidden md:flex flex-col items-center gap-1 group">
                <img 
                  src={userIcon} 
                  alt="Account" 
                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Your Account
                </span>
              </Link>
              
              <Link to="/contact" className="hidden md:flex flex-col items-center gap-1 group">
                <img 
                  src={messageIcon} 
                  alt="Messages" 
                  className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Your Messages
                </span>
              </Link>
              
              <CartDrawer />

              {/* Mobile Nav Toggle */}
              <MobileNav />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Main Navigation - Desktop Only */}
      <div 
        className="bg-black relative hidden lg:block"
        onMouseLeave={handleNavLeave}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Navigation Items */}
            <nav className="flex items-center">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`
                    relative flex items-center gap-1.5 px-5 py-4 text-sm font-semibold
                    transition-all duration-200
                    ${activeNav === item.key 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-white hover:bg-accent/80 hover:text-accent-foreground'
                    }
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
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <Link to="/quote">
              <Button variant="cta" size="lg" className="my-2">
                Get Quote Now
              </Button>
            </Link>
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
