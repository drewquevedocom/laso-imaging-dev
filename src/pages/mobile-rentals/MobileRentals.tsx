import { Link } from 'react-router-dom';
import { Truck, Clock, Shield, Phone, Stethoscope, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllMobileRentals } from '@/data/mobileRentals';

const MobileRentals = () => {
  const rentals = getAllMobileRentals();
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com' },
    { name: 'Mobile Rentals', url: 'https://lasoimaging.com/mobile-rentals' },
  ];

  const benefits = [
    {
      icon: Truck,
      title: 'Rapid Deployment',
      description: 'Mobile units delivered and operational within 48-72 hours',
    },
    {
      icon: Clock,
      title: 'Flexible Terms',
      description: 'Daily, weekly, monthly, or long-term rental options available',
    },
    {
      icon: Shield,
      title: 'Full Support',
      description: '24/7 technical support and preventive maintenance included',
    },
    {
      icon: MapPin,
      title: 'Nationwide Coverage',
      description: 'Deployment available to all 50 states',
    },
  ];

  const useCases = [
    {
      title: 'Renovation & Construction',
      description: 'Maintain imaging services while your permanent equipment is being replaced or your facility is under construction.',
    },
    {
      title: 'Capacity Expansion',
      description: 'Add temporary imaging capacity during peak seasons or when patient volumes exceed your current capability.',
    },
    {
      title: 'Equipment Failure',
      description: 'Get back online quickly with a mobile backup while your primary equipment is being repaired.',
    },
    {
      title: 'New Service Testing',
      description: 'Test patient demand for imaging services in new markets before committing to permanent installation.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Mobile MRI, CT & PET/CT Rental"
        description="Rent mobile MRI, CT, and PET/CT scanners with nationwide delivery. Flexible terms from daily to long-term. 24/7 support included. Request a quote today."
        keywords={['mobile MRI rental', 'mobile CT rental', 'mobile PET/CT', 'medical imaging rental', 'portable MRI']}
        canonical="/mobile-rentals"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Mobile Imaging Equipment Rental
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
                Flexible mobile MRI, CT, and PET/CT solutions delivered nationwide with 24/7 support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/quote">Request a Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="tel:18006745276">
                    <Phone className="mr-2 h-5 w-5" />
                    1-800-MRI-LASO
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rental Options */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mobile Imaging Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the mobile imaging solution that fits your needs. All rentals include delivery, installation, training, and 24/7 technical support.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {rentals.map((rental) => (
                <Card key={rental.slug} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{rental.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {rental.answerCapsule.substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm space-y-2">
                        {rental.specifications.slice(0, 3).map((spec) => (
                          <div key={spec.label} className="flex justify-between">
                            <span className="text-muted-foreground">{spec.label}:</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-accent">
                          {rental.rates[2]?.rate || 'Contact for pricing'}
                        </div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                      <Button asChild className="w-full group-hover:bg-accent group-hover:text-accent-foreground">
                        <Link to={`/mobile-rentals/${rental.slug}`}>
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">When to Rent Mobile Imaging</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mobile imaging equipment provides flexibility for a variety of healthcare scenarios
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {useCases.map((useCase) => (
                <Card key={useCase.title}>
                  <CardHeader>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Rental Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Rental Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From initial consultation to equipment return, we manage every detail
              </p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Consultation', description: 'Discuss your needs and timeline' },
                { step: '2', title: 'Site Survey', description: 'Evaluate power and space requirements' },
                { step: '3', title: 'Deployment', description: 'Delivery and installation' },
                { step: '4', title: 'Operations', description: 'Training and 24/7 support' },
                { step: '5', title: 'Return', description: 'We handle all removal logistics' },
              ].map((phase, index) => (
                <div key={phase.step} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg mb-4">
                    {phase.step}
                  </div>
                  <h3 className="font-semibold mb-2">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us today to discuss your mobile imaging needs. Our team will help you find the right solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-accent-foreground/30 hover:bg-accent-foreground/10">
                <a href="tel:18006745276">
                  <Phone className="mr-2 h-5 w-5" />
                  Call 1-800-MRI-LASO
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default MobileRentals;
