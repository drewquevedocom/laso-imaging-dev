import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllServiceAreas } from '@/data/serviceAreas';

const ServiceAreas = () => {
  const areas = getAllServiceAreas();
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://lasoimaging.com' },
    { name: 'Service Areas', url: 'https://lasoimaging.com/service-areas' },
  ];

  return (
    <>
      <SEOHead
        title="Service Areas"
        description="LASO Imaging provides MRI and CT equipment sales, installation, service, and rental nationwide. From our California headquarters, we serve healthcare facilities across all 50 states."
        keywords={['MRI service areas', 'CT scanner service', 'medical imaging nationwide', 'MRI installation California']}
        canonical="/service-areas"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema includeOrganization includeWebSite />
      
      <Header />
      
      <main className="min-h-screen">
        <PageBreadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Service Areas' },
        ]} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Service Areas
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
                Medical imaging equipment solutions from coast to coast
              </p>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                From our headquarters in Sherman Oaks, California, LASO Imaging serves healthcare facilities 
                across all 50 states with MRI and CT equipment sales, installation, service, and mobile rentals.
              </p>
            </div>
          </div>
        </section>

        {/* Service Area Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {areas.map((area) => (
                <Card key={area.slug} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {area.answerCapsule.substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {area.stats.slice(0, 4).map((stat) => (
                          <div key={stat.label}>
                            <div className="text-2xl font-bold text-accent">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Capabilities Preview */}
                      <div className="pt-4 border-t">
                        <div className="text-sm text-muted-foreground mb-2">Services available:</div>
                        <div className="flex flex-wrap gap-1">
                          {area.serviceCapabilities.slice(0, 3).map((cap) => (
                            <span key={cap.title} className="text-xs bg-muted px-2 py-1 rounded">
                              {cap.title}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Button asChild className="w-full group-hover:bg-accent group-hover:text-accent-foreground">
                        <Link to={`/service-areas/${area.slug}`}>
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

        {/* National Coverage */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">National Reach, Local Service</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're in a major metropolitan area or a rural community, LASO Imaging 
                delivers the same commitment to quality and responsive service that has defined 
                our company for over 18 years.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">50</div>
                  <div className="text-muted-foreground">States Served</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">500+</div>
                  <div className="text-muted-foreground">Installations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">18+</div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">24/7</div>
                  <div className="text-muted-foreground">Support Available</div>
                </div>
              </div>
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
              Contact us today to discuss your imaging equipment needs. Our team serves healthcare 
              facilities across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-accent-foreground/30 hover:bg-accent-foreground/10">
                <a href="tel:18445115276">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (844) 511-5276
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

export default ServiceAreas;
