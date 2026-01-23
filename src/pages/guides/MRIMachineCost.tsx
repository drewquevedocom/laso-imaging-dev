import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import ArticleSchema from '@/components/seo/ArticleSchema';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import MarkdownContent from '@/components/shared/MarkdownContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPricingGuide } from '@/data/pricingGuides';

const MRIMachineCost = () => {
  const guide = getPricingGuide('mri-machine-cost');
  
  if (!guide) {
    return null;
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com/' },
    { name: 'Pricing Guides', url: 'https://lasoimaging.com/guides' },
    { name: 'MRI Machine Cost', url: 'https://lasoimaging.com/guides/mri-machine-cost' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <>
      <SEOHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonical="/guides/mri-machine-cost"
        type="article"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={guide.faqs} />
      <ArticleSchema
        headline={guide.title}
        description={guide.metaDescription}
        datePublished="2025-01-15"
        dateModified="2025-01-20"
        url="https://lasoimaging.com/guides/mri-machine-cost"
        keywords={guide.keywords}
      />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <PageBreadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'MRI Machine Cost' },
        ]} />

        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <p className="text-accent font-medium mb-3">2025 Pricing Guide</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {guide.title}
              </h1>
              {/* Answer Capsule - Critical for AI Search */}
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                {guide.answerCapsule}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Price Summary */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '1.5T MRI', range: '$150K - $500K' },
                { label: '3T MRI', range: '$400K - $1.2M' },
                { label: 'Open MRI', range: '$75K - $350K' },
                { label: 'Installation', range: '$75K - $200K' },
              ].map((item) => (
                <Card key={item.label} className="text-center">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-accent">{item.range}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-accent text-accent-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Get a free, personalized MRI quote from our experts</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/quote">
                  <Button variant="secondary" size="sm">
                    Request Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:18006745276" className="flex items-center gap-2 hover:underline">
                  <Phone className="w-4 h-4" />
                  1-800-MRI-LASO
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content Column */}
              <div className="lg:col-span-2">
                <MarkdownContent content={guide.content} className="prose-lg" />

                {/* Mid-content CTA */}
                <div className="my-12 p-6 bg-muted rounded-lg border">
                  <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our team can provide a detailed quote based on your specific requirements and budget.
                  </p>
                  <Link to="/quote">
                    <Button>
                      Get Your Custom Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Price Ranges Card */}
                <Card className="sticky top-4 mb-8">
                  <CardHeader>
                    <CardTitle>Quick Reference Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {guide.priceRanges.slice(0, 6).map((range) => (
                        <div key={range.model} className="flex justify-between items-start border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium text-sm">{range.model}</p>
                            <p className="text-xs text-muted-foreground">{range.condition}</p>
                          </div>
                          <p className="text-sm font-semibold text-accent whitespace-nowrap">
                            {formatPrice(range.lowPrice)} - {formatPrice(range.highPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Related Equipment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {guide.relatedLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          to={link.href}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                        >
                          <span className="text-sm">{link.label}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Full Price Table */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Complete MRI Pricing Reference</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Year Range</TableHead>
                      <TableHead className="text-right">Price Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guide.priceRanges.map((range) => (
                      <TableRow key={range.model}>
                        <TableCell className="font-medium">{range.model}</TableCell>
                        <TableCell>{range.condition}</TableCell>
                        <TableCell>{range.yearRange || 'Various'}</TableCell>
                        <TableCell className="text-right font-semibold text-accent">
                          {formatPrice(range.lowPrice)} - {formatPrice(range.highPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {guide.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
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
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your MRI System?</h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Our experts will help you find the right MRI system at the best price for your facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quote">
                <Button size="lg" variant="secondary">
                  Request a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="tel:18006745276">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Phone className="w-4 h-4 mr-2" />
                  1-800-MRI-LASO
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MRIMachineCost;
