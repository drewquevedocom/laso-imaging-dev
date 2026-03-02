import { Link } from 'react-router-dom';
import { Phone, CheckCircle } from 'lucide-react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMobileRental } from '@/data/mobileRentals';

const MobileMRI = () => {
  const rental = getMobileRental('mri');
  
  if (!rental) return null;
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com' },
    { name: 'Mobile Rentals', url: 'https://lasoimaging.com/mobile-rentals' },
    { name: 'Mobile MRI', url: 'https://lasoimaging.com/mobile-rentals/mri' },
  ];

  return (
    <>
      <SEOHead
        title={rental.metaTitle}
        description={rental.metaDescription}
        keywords={rental.keywords}
        canonical="/mobile-rentals/mri"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={rental.faqs} />
      <LocalBusinessSchema pageType="MedicalBusiness" />
      
      <Header />
      
      <main className="min-h-screen">
        <PageBreadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Mobile Rentals', href: '/mobile-rentals' },
          { label: 'Mobile MRI' },
        ]} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{rental.title}</h1>
              <p className="text-xl text-primary-foreground/90 mb-4">{rental.heroSubtitle}</p>
              {/* Answer Capsule */}
              <div className="bg-primary-foreground/10 rounded-lg p-6 mt-8">
                <p className="text-lg leading-relaxed">{rental.answerCapsule}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Specs */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {rental.specifications.map((spec) => (
                <div key={spec.label} className="text-center">
                  <div className="text-sm text-muted-foreground">{spec.label}</div>
                  <div className="font-semibold">{spec.value}</div>
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
                <p className="text-lg font-semibold">Need a mobile MRI quickly?</p>
                <p className="text-sm opacity-90">48-hour deployment available for urgent requests</p>
              </div>
              <div className="flex gap-4">
                <Button asChild variant="secondary">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
                <Button asChild variant="outline" className="border-accent-foreground/30 hover:bg-accent-foreground/10">
                  <a href="tel:18445115276">
                    <Phone className="mr-2 h-4 w-4" />
                    (844) 511-5276
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
                <MarkdownContent content={rental.description} className="mb-12" />
                
                {/* Rates Table */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Rental Rates</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rental Period</TableHead>
                        <TableHead>Rate Range</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rental.rates.map((rate) => (
                        <TableRow key={rate.period}>
                          <TableCell className="font-medium">{rate.period}</TableCell>
                          <TableCell className="text-accent font-semibold">{rate.rate}</TableCell>
                          <TableCell className="text-muted-foreground">{rate.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Rates vary based on system type, configuration, and rental duration. Contact us for a custom quote.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Site Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Site Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rental.siteRequirements.map((req) => (
                      <div key={req.category}>
                        <h4 className="font-semibold mb-2">{req.category}</h4>
                        <ul className="space-y-1">
                          {req.requirements.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Related Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Related Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rental.relatedLinks.map((link) => (
                        <li key={link.href}>
                          <Link to={link.href} className="text-accent hover:underline text-sm">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-accent text-accent-foreground">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">Ready to Rent?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Contact our team for a customized rental quote.
                    </p>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/quote">Request Quote</Link>
                    </Button>
                    <div className="text-center mt-4">
                      <a href="tel:18445115276" className="text-sm hover:underline">
                        or call (844) 511-5276
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {rental.faqs.map((faq, index) => (
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
            <h2 className="text-3xl font-bold mb-4">Get Your Mobile MRI Quote Today</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our team is ready to help you find the right mobile MRI solution for your facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10">
                <a href="tel:18445115276">
                  <Phone className="mr-2 h-5 w-5" />
                  (844) 511-5276
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

export default MobileMRI;
