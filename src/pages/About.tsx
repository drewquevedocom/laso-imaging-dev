import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { Button } from '@/components/ui/button';
import { 
  Shield, Award, Users, Globe, CheckCircle2, Phone, Mail, 
  Building2, Target, Heart, Lightbulb, Clock, Truck, Wrench
} from 'lucide-react';

// Brand logos for partnerships
import geLogo from '@/assets/brands/ge.jpg';
import siemensLogo from '@/assets/brands/siemens.jpg';
import philipsLogo from '@/assets/brands/philips.jpg';
import toshibaLogo from '@/assets/brands/toshiba.jpg';

// Facility images
import facilityMri from '@/assets/hero-mri.jpg';
import facilityCtScanner from '@/assets/ct-scanner.jpg';
import facilityMobile from '@/assets/mobile-mri.jpg';
import facilitySystem from '@/assets/mri-system-1.jpg';

const About = () => {
  // Animated counter hook
  const [counters, setCounters] = useState({ years: 0, systems: 0, facilities: 0, countries: 0 });
  
  useEffect(() => {
    const targets = { years: 18, systems: 756, facilities: 500, countries: 50 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        years: Math.round(targets.years * progress),
        systems: Math.round(targets.systems * progress),
        facilities: Math.round(targets.facilities * progress),
        countries: Math.round(targets.countries * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'Every system is thoroughly inspected, tested, and certified before delivery.'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'We build lasting relationships through exceptional service and support.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously improving our processes to deliver better solutions.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Honest, transparent dealings in every transaction and interaction.'
    },
  ];

  const team = [
    { name: 'Leadership Team', role: 'Executive Management', expertise: 'Strategic Direction & Growth' },
    { name: 'Engineering Team', role: 'Technical Services', expertise: 'Installation & Maintenance' },
    { name: 'Sales Team', role: 'Client Relations', expertise: 'Consultation & Solutions' },
    { name: 'Support Team', role: 'Customer Service', expertise: '24/7 Technical Assistance' },
  ];

  const certifications = [
    { name: 'FDA Registered', description: 'Licensed medical equipment dealer' },
    { name: 'ISO 9001:2015', description: 'Quality management certified' },
    { name: 'OEM Partnerships', description: 'Authorized service provider' },
    { name: 'HIPAA Compliant', description: 'Data security standards' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About LASO Imaging Solutions | FDA Registered MRI & CT Dealer"
        description="LASO Imaging Solutions is an FDA registered dealer with 18+ years of experience providing MRI, CT, and X-Ray equipment to healthcare facilities worldwide. Learn about our mission and values."
        keywords={['about LASO imaging', 'medical imaging company', 'MRI equipment dealer', 'FDA registered', 'CT scanner dealer', 'medical equipment Houston']}
        canonical="/about"
      />
      <LocalBusinessSchema />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary to-accent py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Shield className="h-4 w-4" />
                FDA Registered • ISO Certified
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                Your Trusted Partner in Medical Imaging Since 2006
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
                LASO Imaging Solutions provides MRI, CT, X-Ray machines and more. Our commitment is to provide you, 
                our valued customers, the highest level of response and management of MRI and CT diagnostic service programs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button variant="heroOutline" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Link to="/quote">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{counters.years}+</div>
                <div className="text-muted-foreground">Years in Business</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{counters.systems}+</div>
                <div className="text-muted-foreground">Systems in Inventory</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{counters.facilities}+</div>
                <div className="text-muted-foreground">Facilities Served</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{counters.countries}+</div>
                <div className="text-muted-foreground">Countries Shipped</div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  18+ Years of Excellence in Medical Imaging
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2006 in Los Angeles, California, LASO Imaging Solutions has grown from a small equipment 
                    dealer to a nationally recognized leader in refurbished medical imaging equipment.
                  </p>
                  <p>
                    We are proud to say that many reputable hospitals, vendors, and companies are on our customer list. 
                    Our success is built on a foundation of quality equipment, expert service, and unwavering 
                    commitment to our customers' success.
                  </p>
                  <p>
                    Today, we maintain an extensive inventory of MRI, CT, and X-Ray systems from leading 
                    manufacturers including GE, Siemens, Philips, Canon, and Hitachi. Every system we sell 
                    is thoroughly inspected, tested, and certified by our team of factory-trained engineers.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>FDA Registered Dealer</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Nationwide Service</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>12-Month Warranty</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={facilityMri} 
                  alt="LASO MRI facility" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src={facilityCtScanner} 
                  alt="CT Scanner inspection" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover mt-8"
                />
                <img 
                  src={facilitySystem} 
                  alt="MRI system testing" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src={facilityMobile} 
                  alt="Mobile MRI unit" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover mt-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Delivering Excellence in Medical Imaging
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Our mission is to provide healthcare facilities with reliable, affordable medical imaging 
                equipment backed by exceptional service and support. We believe every facility deserves 
                access to quality diagnostic technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {values.map((value, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Complete Medical Imaging Solutions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Equipment Sales</h3>
                <p className="text-muted-foreground">
                  New, refurbished, and certified pre-owned MRI, CT, and X-Ray systems from all major manufacturers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Service & Support</h3>
                <p className="text-muted-foreground">
                  Installation, maintenance, repairs, and 24/7 technical support by factory-trained engineers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-success-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Parts & Rentals</h3>
                <p className="text-muted-foreground">
                  Extensive parts inventory with same-day shipping and flexible rental programs for mobile units.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Team</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Expert Professionals at Your Service
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team of experienced professionals brings decades of combined expertise in medical imaging equipment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Users className="h-16 w-16 text-white/30" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                    <p className="text-accent text-sm font-medium">{member.role}</p>
                    <p className="text-muted-foreground text-sm mt-2">{member.expertise}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Certifications</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Trust & Compliance
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                  <Award className="h-10 w-10 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{cert.name}</h3>
                  <p className="text-muted-foreground text-sm">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OEM Partners Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Partners</span>
              <h2 className="text-2xl font-bold text-foreground mt-2">
                Authorized for All Major Manufacturers
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <img src={geLogo} alt="GE Healthcare" className="h-16 object-contain" />
              <img src={siemensLogo} alt="Siemens Healthineers" className="h-16 object-contain" />
              <img src={philipsLogo} alt="Philips Healthcare" className="h-16 object-contain" />
              <img src={toshibaLogo} alt="Canon Medical" className="h-16 object-contain" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Upgrade Your Imaging Capabilities?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your medical imaging needs. Our team is ready to help you 
              find the perfect solution for your facility.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Mail className="h-4 w-4 mr-2" />
                  Request a Quote
                </Button>
              </Link>
              <a href="tel:+18445115276">
                <Button variant="heroOutline" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 1-844-511-5276
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
