import { Link } from "react-router-dom";
import { Truck, Shield, Headphones, Award } from "lucide-react";
import logoLaso from "@/assets/logo-laso.png";

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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1">
              <div className="mb-4">
                <img 
                  src={logoLaso} 
                  alt="LASO Imaging" 
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-primary-foreground/70 text-sm mb-4 max-w-xs">
                Your trusted partner for MRI, CT, and medical imaging solutions. Serving healthcare facilities worldwide since 2006.
              </p>
              <div className="text-sm text-primary-foreground/70 space-y-1">
                <a href="tel:8189169503" className="block hover:text-primary-foreground transition-colors">
                  (818) 916-9503
                </a>
                <a href="tel:18006745276" className="block hover:text-primary-foreground transition-colors">
                  1-800-MRI-LASO (674-5276)
                </a>
                <a href="mailto:info@lasoimaging.com" className="block hover:text-primary-foreground transition-colors">
                  info@lasoimaging.com
                </a>
                <p className="pt-2">Mailing Address<br />14900 Magnolia Blvd #56323<br />Sherman Oaks, CA 91413</p>
                <p className="text-xs pt-1">Mon-Fri: 8AM-6PM PST | 24/7 Emergency</p>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="font-semibold mb-4">Equipment</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/equipment/1-5t-mri-systems" className="hover:text-primary-foreground transition-colors">Imaging Systems</Link></li>
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
                <li><Link to="/services/mri-installation" className="hover:text-primary-foreground transition-colors">Installation</Link></li>
                <li><Link to="/services/preventive-maintenance" className="hover:text-primary-foreground transition-colors">Maintenance</Link></li>
                <li><Link to="/services/operator-training" className="hover:text-primary-foreground transition-colors">Training</Link></li>
                <li><Link to="/services/consulting" className="hover:text-primary-foreground transition-colors">Consulting</Link></li>
                <li><Link to="/services/financing" className="hover:text-primary-foreground transition-colors">Financing</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
                <li><Link to="/case-studies" className="hover:text-primary-foreground transition-colors">Case Studies</Link></li>
                <li><Link to="/blog" className="hover:text-primary-foreground transition-colors">Resources & Blog</Link></li>
                <li><Link to="/guides" className="hover:text-primary-foreground transition-colors">Pricing Guides</Link></li>
                <li><Link to="/mobile-rentals" className="hover:text-primary-foreground transition-colors">Mobile Rentals</Link></li>
                <li><Link to="/service-areas" className="hover:text-primary-foreground transition-colors">Service Areas</Link></li>
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
              <Link to="/sitemap" className="hover:text-primary-foreground transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
