import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, TrendingUp, Truck, Calculator } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllPricingGuides } from '@/data/pricingGuides';

const guideCards = [
  {
    slug: 'mri-machine-cost',
    title: 'MRI Machine Cost Guide',
    description: 'Complete 2025 pricing for used and refurbished MRI systems. Covers 1.5T, 3T, and open MRI options from all major manufacturers.',
    icon: DollarSign,
    highlight: '$150K - $1.2M',
    highlightLabel: 'Price Range',
  },
  {
    slug: 'ct-scanner-cost',
    title: 'CT Scanner Cost Guide',
    description: 'Comprehensive CT scanner pricing from 16-slice to 256-slice systems. Includes installation and operating cost analysis.',
    icon: TrendingUp,
    highlight: '$50K - $500K',
    highlightLabel: 'Price Range',
  },
  {
    slug: 'mobile-rental-rates',
    title: 'Mobile Rental Rates',
    description: 'Daily, weekly, and monthly rental rates for mobile MRI and CT units. Understand what impacts pricing and what is included.',
    icon: Truck,
    highlight: '$1.5K - $65K',
    highlightLabel: 'Rate Range',
  },
];

const Guides = () => {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com/' },
    { name: 'Pricing Guides', url: 'https://lasoimaging.com/guides' },
  ];

  return (
    <>
      <SEOHead
        title="Medical Imaging Equipment Pricing Guides"
        description="Expert pricing guides for MRI machines, CT scanners, and mobile imaging rentals. Get accurate 2025 pricing from 18+ years of industry experience. Compare costs and make informed decisions."
        keywords={['MRI machine cost', 'CT scanner price', 'medical imaging pricing', 'used MRI price', 'refurbished CT cost', 'mobile MRI rental rates']}
        canonical="/guides"
        type="website"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <PageBreadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Pricing Guides' },
        ]} />

        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" />
                Expert Pricing Resources
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Medical Imaging Equipment Pricing Guides
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Transparent, accurate pricing information based on 18+ years of industry experience. Make informed equipment decisions with our comprehensive cost guides.
              </p>
            </div>
          </div>
        </section>

        {/* Guide Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {guideCards.map((guide) => (
                <Card key={guide.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <guide.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{guide.highlightLabel}</p>
                        <p className="text-lg font-bold text-accent">{guide.highlight}</p>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/guides/${guide.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        Read Full Guide
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Trust Our Guides */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Trust Our Pricing Guides?</h2>
              <p className="text-lg text-muted-foreground">
                Our pricing information comes from real transaction data, not estimates or outdated figures.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { stat: '18+', label: 'Years Experience' },
                { stat: '500+', label: 'Systems Sold' },
                { stat: '50+', label: 'States Served' },
                { stat: '2025', label: 'Current Pricing' },
              ].map((item) => (
                <div key={item.label} className="text-center p-6 bg-background rounded-lg border">
                  <p className="text-4xl font-bold text-accent mb-2">{item.stat}</p>
                  <p className="text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Quote?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our pricing guides provide general ranges. For accurate pricing on specific equipment matching your requirements, request a personalized quote from our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/quote">
                  <Button size="lg" className="w-full sm:w-auto">
                    Request a Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:18006745276">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Call 1-800-MRI-LASO
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Guides;
