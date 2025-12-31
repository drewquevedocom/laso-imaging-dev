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
            </div>

            {/* Equipment */}
            <div>
              <h4 className="font-semibold mb-4">Equipment</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">MRI Systems</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">CT Scanners</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">X-Ray Units</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Mobile Units</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Parts Catalog</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Installation</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Maintenance</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Consulting</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Financing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 LASO Imaging Solutions. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
