import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getServiceContent } from '@/data/serviceContent';
import { 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Shield, 
  Clock, 
  Award,
  MapPin,
  Thermometer,
  Settings
} from 'lucide-react';
import QuoteForm from '@/components/shared/QuoteForm';
import HeliumQuoteForm from '@/components/helium/HeliumQuoteForm';
import CryogenicServiceQuoteForm from '@/components/helium/CryogenicServiceQuoteForm';
import FinancingQuoteForm from '@/components/financing/FinancingQuoteForm';

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceContent(slug) : null;
  const [activeQuoteForm, setActiveQuoteForm] = useState<'helium' | 'cryogenic'>('helium');

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Link to="/services" className="text-accent hover:underline">
              View All Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate FAQ Schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Generate Service Schema markup
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "LASO Imaging Solutions",
      "telephone": "1-800-674-5276",
      "email": "info@lasoimaging.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8129 Clybourn Ave",
        "addressLocality": "Sun Valley",
        "addressRegion": "CA",
        "postalCode": "91352",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": "Medical Imaging Equipment Services"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{service.title} | Sun Valley CA | LASO Imaging</title>
        <meta name="description" content={service.metaDescription} />
        <meta name="keywords" content={service.keywords.join(', ')} />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Sun Valley" />
        <link rel="canonical" href={`https://lasoimaging.com/services/${slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${service.title} | LASO Imaging`} />
        <meta property="og:description" content={service.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lasoimaging.com/services/${slug}`} />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded">
                  <Shield className="w-3.5 h-3.5" />
                  FDA Registered
                </span>
                <span className="inline-flex items-center gap-1.5 bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded">
                  <MapPin className="w-3.5 h-3.5" />
                  Nationwide Service
                </span>
                <span className="inline-flex items-center gap-1.5 bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded">
                  <Clock className="w-3.5 h-3.5" />
                  24/7 Support
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl">
                {service.heroDescription}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="tel:18006745276">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Phone className="w-4 h-4" />
                    1-800-MRI-LASO
                  </Button>
                </a>
                {slug === 'financing' ? (
                  <a href="#financing-form">
                    <Button size="lg" variant="cta" className="gap-2">
                      Get Financing
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                ) : slug === 'helium-refills' ? (
                  <a href="#helium-quote-form">
                    <Button size="lg" variant="cta" className="gap-2">
                      Get Helium Fill Quote
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                ) : (
                  <Link to={`/quote?interest=${encodeURIComponent(service.title)}`}>
                    <Button size="lg" variant="cta" className="gap-2">
                      Request a Quote
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Overview
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {service.overview}
                  </p>
                </div>
                
                {/* Brands Covered */}
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Equipment & Brands We Service
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.equipmentBrands.map((brand) => (
                      <span 
                        key={brand} 
                        className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded text-sm font-medium"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar CTA */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24 shadow-card">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Get Expert Assistance
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Call Us 24/7</p>
                        <a href="tel:18006745276" className="font-semibold text-foreground hover:text-accent transition-colors">
                          1-800-MRI-LASO
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-semibold text-foreground">18+ Years in Industry</p>
                      </div>
                    </div>
                  </div>
                  {slug === 'financing' ? (
                    <a href="#financing-form">
                      <Button className="w-full" variant="cta" size="lg">
                        Get Financing Options
                      </Button>
                    </a>
                  ) : slug === 'helium-refills' ? (
                    <a href="#helium-quote-form">
                      <Button className="w-full" variant="cta" size="lg">
                        Get Helium Fill Quote
                      </Button>
                    </a>
                  ) : (
                    <Link to={`/quote?interest=${encodeURIComponent(service.title)}`}>
                      <Button className="w-full" variant="cta" size="lg">
                        Request a Quote
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Our Process
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A systematic approach to delivering exceptional {service.title.toLowerCase()} results.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {service.processSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex gap-6 bg-card border border-border rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.step}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Choose LASO for {service.title}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Industry-leading expertise backed by decades of experience serving healthcare facilities nationwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 bg-card border border-border rounded-lg p-5"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Common questions about our {service.title.toLowerCase()}.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Related Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive range of medical imaging services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {service.relatedServices.map((related) => (
                <Link 
                  key={related.slug}
                  to={`/services/${related.slug}`}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-accent hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                    {related.title}
                  </h3>
                  <span className="text-accent text-sm font-medium inline-flex items-center gap-1">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-primary-foreground/90 mb-8">
                  Contact our team of experts today to discuss your {service.title.toLowerCase()} needs. 
                  We're available 24/7 for emergency support.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary-foreground">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">1-800-MRI-LASO (1-800-674-5276)</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>8129 Clybourn Ave, Sun Valley, CA 91352</span>
                  </div>
                </div>
              </div>
              
              <div id="financing-form" className="bg-card rounded-xl p-6 md:p-8 shadow-xl">
                {slug === 'financing' ? (
                  <FinancingQuoteForm sourcePage={`Service: ${service.title}`} />
                ) : slug === 'helium-refills' ? (
                  <div>
                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={() => setActiveQuoteForm('helium')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          activeQuoteForm === 'helium'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Thermometer className="w-4 h-4" />
                        Helium Fill
                      </button>
                      <button
                        onClick={() => setActiveQuoteForm('cryogenic')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          activeQuoteForm === 'cryogenic'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        Cold Head / Compressor / HVAC
                      </button>
                    </div>
                    
                    {/* Active Form */}
                    {activeQuoteForm === 'helium' ? (
                      <HeliumQuoteForm sourcePage={`Service: ${service.title}`} />
                    ) : (
                      <CryogenicServiceQuoteForm sourcePage={`Service: ${service.title}`} />
                    )}
                  </div>
                ) : (
                  <QuoteForm 
                    sourcePage={`Service: ${service.title}`}
                    prefilledInterest={service.title}
                    variant="compact"
                    title="Request a Free Quote"
                    subtitle="Get a response within 24 hours"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;