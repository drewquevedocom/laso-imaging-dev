import { Link } from "react-router-dom";
import { Truck, Shield, Headphones, Award } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Trust Bar */}
      <div className="border-b border-primary-foreground/10 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-8 w-8 text-accent" />
              <h4 className="font-semibold">Worldwide Shipping</h4>
              <p className="text-sm text-primary-foreground/70">Fast & secure delivery to 50+ countries</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-accent" />
              <h4 className="font-semibold">Quality Guaranteed</h4>
              <p className="text-sm text-primary-foreground/70">All parts tested & certified</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Headphones className="h-8 w-8 text-accent" />
              <h4 className="font-semibold">24/7 Expert Support</h4>
              <p className="text-sm text-primary-foreground/70">Technical assistance anytime</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="h-8 w-8 text-accent" />
              <h4 className="font-semibold">Industry Leaders</h4>
              <p className="text-sm text-primary-foreground/70">18+ years of excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-lg">L</span>
                </div>
                <div className="ml-2">
                  <span className="text-2xl font-bold">LASO</span>
                  <p className="text-xs text-primary-foreground/60 -mt-1">IMAGING SOLUTIONS</p>
                </div>
              </div>
              <p className="text-primary-foreground/70 text-sm mb-4 max-w-xs">
                Your trusted partner for MRI, CT, and medical imaging solutions. Serving healthcare facilities worldwide since 2006.
              </p>
              <div className="text-sm text-primary-foreground/70">
                <a href="tel:+18445115276" className="hover:text-primary-foreground transition-colors">
                  1-844-511-5276
                </a>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="font-semibold mb-4">Equipment</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/equipment/1-5t-mri-systems" className="hover:text-primary-foreground transition-colors">MRI Systems</Link></li>
                <li><Link to="/products?category=ct" className="hover:text-primary-foreground transition-colors">CT Scanners</Link></li>
                <li><Link to="/products?category=xray" className="hover:text-primary-foreground transition-colors">X-Ray Units</Link></li>
                <li><Link to="/equipment/mobile-mri-systems" className="hover:text-primary-foreground transition-colors">Mobile Units</Link></li>
                <li><Link to="/parts" className="hover:text-primary-foreground transition-colors">Parts Catalog</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/services/installation" className="hover:text-primary-foreground transition-colors">Installation</Link></li>
                <li><Link to="/services/maintenance" className="hover:text-primary-foreground transition-colors">Maintenance</Link></li>
                <li><Link to="/services/training" className="hover:text-primary-foreground transition-colors">Training</Link></li>
                <li><Link to="/services/consulting" className="hover:text-primary-foreground transition-colors">Consulting</Link></li>
                <li><Link to="/services/financing" className="hover:text-primary-foreground transition-colors">Financing</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
                <li><Link to="/products" className="hover:text-primary-foreground transition-colors">Our Products</Link></li>
                <li><Link to="/services" className="hover:text-primary-foreground transition-colors">Services</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
                <li><Link to="/faqs" className="hover:text-primary-foreground transition-colors">FAQs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} LASO Imaging Solutions. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-primary-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
