import { Link } from 'react-router-dom';
import { Phone, CheckCircle, MapPin, Quote } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import MarkdownContent from '@/components/shared/MarkdownContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getServiceArea } from '@/data/serviceAreas';

const Nationwide = () => {
  const area = getServiceArea('nationwide');
  
  if (!area) return null;
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com' },
    { name: 'Service Areas', url: 'https://lasoimaging.com/service-areas' },
    { name: 'Nationwide', url: 'https://lasoimaging.com/service-areas/nationwide' },
  ];

  return (
    <>
      <SEOHead
        title={area.metaTitle}
        description={area.metaDescription}
        keywords={area.keywords}
        canonical="/service-areas/nationwide"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={area.faqs} />
      <LocalBusinessSchema pageType="MedicalBusiness" />
      
      <Header />
      
      <main className="min-h-screen">
        <PageBreadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Service Areas', href: '/service-areas' },
          { label: 'Nationwide' },
        ]} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-primary-foreground/70 mb-4">
                <MapPin className="h-5 w-5" />
                <span>All 50 States</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{area.title}</h1>
              <p className="text-xl text-primary-foreground/90 mb-4">{area.heroSubtitle}</p>
              {/* Answer Capsule */}
              <div className="bg-primary-foreground/10 rounded-lg p-6 mt-8">
                <p className="text-lg leading-relaxed">{area.answerCapsule}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {area.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-6 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Serving all 50 states and U.S. territories</p>
                <p className="text-sm opacity-90">Equipment sales, mobile rentals, and installation nationwide</p>
              </div>
              <div className="flex gap-4">
                <Button asChild variant="secondary">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
                <Button asChild variant="outline" className="border-accent-foreground/30 hover:bg-accent-foreground/10">
                  <a href={`tel:${area.phoneNumber.replace(/-/g, '')}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {area.phoneNumber}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <MarkdownContent content={area.description} className="mb-12" />
                
                {/* Service Capabilities */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Our National Capabilities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {area.serviceCapabilities.map((cap) => (
                      <Card key={cap.title}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-accent" />
                            {cap.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{cap.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Mobile Rentals Callout */}
                <div className="mt-12 bg-accent/10 rounded-xl p-6 border border-accent/20">
                  <h2 className="text-2xl font-bold mb-4">Mobile Imaging Solutions Nationwide</h2>
                  <p className="text-muted-foreground mb-6">
                    Need temporary imaging capacity anywhere in the US? Our mobile rental fleet deploys to all 50 states with rapid turnaround.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link to="/mobile-rentals/mri" className="bg-card border rounded-lg p-4 hover:border-accent transition-colors">
                      <h3 className="font-semibold">Mobile MRI</h3>
                      <p className="text-sm text-muted-foreground">1.5T & 3T systems</p>
                    </Link>
                    <Link to="/mobile-rentals/ct" className="bg-card border rounded-lg p-4 hover:border-accent transition-colors">
                      <h3 className="font-semibold">Mobile CT</h3>
                      <p className="text-sm text-muted-foreground">16-128 slice options</p>
                    </Link>
                    <Link to="/mobile-rentals/pet-ct" className="bg-card border rounded-lg p-4 hover:border-accent transition-colors">
                      <h3 className="font-semibold">Mobile PET/CT</h3>
                      <p className="text-sm text-muted-foreground">Oncology imaging</p>
                    </Link>
                  </div>
                  <Link to="/mobile-rentals" className="inline-flex items-center gap-2 mt-4 text-accent hover:text-primary font-semibold">
                    View All Mobile Rentals →
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Major Markets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Major Markets Served</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {area.cities?.map((city) => (
                        <span key={city} className="text-sm bg-muted px-3 py-1 rounded-full">
                          {city}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Plus hundreds more cities across all 50 states
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-accent text-accent-foreground">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">Contact Us</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Ready to discuss your imaging equipment needs? We serve facilities nationwide.
                    </p>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/quote">Request Quote</Link>
                    </Button>
                    <div className="text-center mt-4">
                      <a href={`tel:${area.phoneNumber.replace(/-/g, '')}`} className="text-sm hover:underline">
                        or call {area.phoneNumber}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {area.testimonials.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {area.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <Quote className="h-8 w-8 text-accent/30 mb-4" />
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {area.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-background rounded-lg border px-6">
                    <AccordionTrigger className="text-left font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Imaging Experts Nationwide?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us today to discuss your imaging equipment needs. We serve healthcare facilities 
              across all 50 states.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10">
                <a href={`tel:${area.phoneNumber.replace(/-/g, '')}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {area.phoneNumber}
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

export default Nationwide;
