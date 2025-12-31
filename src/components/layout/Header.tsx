import { Search, User, MessageSquare, ShoppingCart, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full">
      {/* Top Trust Bar */}
      <div className="bg-trust-bar text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>FDA Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>18+ Years</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>BBB A+</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>150+ Facilities Served</span>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="border-b border-border bg-secondary/50 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <nav className="hidden md:flex items-center gap-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About Us</a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-foreground transition-colors">Track Order</a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-foreground transition-colors">FAQs</a>
          </nav>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-accent font-medium">Sign up for 10% off your first order: <a href="#" className="underline hover:text-foreground">Sign Up</a></span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Toll Free: (844) 511-5276</span>
            </div>
            <a href="mailto:info@lasoimaging.com" className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" />
              <span>info@lasoimaging.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-background py-4 px-4 border-b border-border">
        <div className="container mx-auto flex items-center justify-between gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">L</span>
              </div>
              <div className="ml-2">
                <span className="text-2xl font-bold text-primary">LASO</span>
                <p className="text-xs text-muted-foreground -mt-1">IMAGING SOLUTIONS</p>
              </div>
            </div>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-xs">🌐</span>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search for MRI systems, parts & products..."
                className="w-full pl-14 pr-12 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Search className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Login<br/>Account</span>
            </a>
            <a href="#" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Your<br/>Messages</span>
            </a>
            <a href="#" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs mt-1">Your<br/>Cart</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground py-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <NavItem label="EQUIPMENT" hasDropdown />
            <NavItem label="PARTS" hasDropdown />
            <NavItem label="SERVICES" hasDropdown />
            <NavItem label="CONTACT" />
          </div>
          <Button variant="cta" size="lg" className="rounded-none h-full py-4">
            Get Quote Now
          </Button>
        </div>
      </nav>
    </header>
  );
};

const NavItem = ({ label, hasDropdown }: { label: string; hasDropdown?: boolean }) => (
  <a 
    href="#" 
    className="flex items-center gap-1 px-6 py-4 hover:bg-primary-foreground/10 transition-colors font-medium"
  >
    {label}
    {hasDropdown && <ChevronDown className="h-4 w-4" />}
  </a>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

export default Header;
