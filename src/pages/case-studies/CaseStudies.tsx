import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { caseStudies, getIndustries } from '@/data/caseStudies';
import { ArrowRight, Building2, MapPin, Star } from 'lucide-react';

const CaseStudies = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const industries = getIndustries();

  const filteredCaseStudies = selectedIndustry
    ? caseStudies.filter(cs => cs.industry === selectedIndustry)
    : caseStudies;

  const featuredStudies = caseStudies.filter(cs => cs.featured);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Customer Case Studies | LASO Imaging Solutions"
        description="Read real success stories from healthcare facilities who partnered with LASO for their MRI and imaging equipment needs. See how we've helped hospitals save costs and improve patient care."
        keywords={['MRI case studies', 'healthcare success stories', 'medical imaging ROI', 'hospital equipment upgrade']}
        canonical="/case-studies"
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Customer Success Stories
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Real results from healthcare facilities who trusted LASO for their imaging equipment needs
            </p>
          </div>
        </section>

        {/* Featured Case Studies */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStudies.map((study) => (
                <div
                  key={study.slug}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-warning fill-warning" />
                      <span className="text-sm font-semibold text-warning">Featured</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{study.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {study.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {study.location}
                      </span>
                    </div>
                    
                    {/* Key Results */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {study.results.slice(0, 4).map((result, idx) => (
                        <div key={idx} className="text-center p-3 bg-secondary rounded-lg">
                          <p className="text-xl font-bold text-accent">{result.metric}</p>
                          <p className="text-xs text-muted-foreground">{result.label}</p>
                        </div>
                      ))}
                    </div>

                    <Link to={`/case-studies/${study.slug}`}>
                      <Button variant="default" className="w-full">
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Case Studies */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-foreground">All Case Studies</h2>
              
              {/* Industry Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedIndustry === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedIndustry(null)}
                >
                  All Industries
                </Button>
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaseStudies.map((study) => (
                <div
                  key={study.slug}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {study.industry}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {study.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {study.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {study.location}
                      </span>
                    </div>

                    {/* Top Result */}
                    <div className="bg-accent/10 rounded-lg p-3 mb-4">
                      <p className="text-2xl font-bold text-accent">{study.results[0].metric}</p>
                      <p className="text-sm text-muted-foreground">{study.results[0].label}</p>
                    </div>

                    <Link to={`/case-studies/${study.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-accent-foreground mb-4">
              Become Our Next Success Story
            </h2>
            <p className="text-lg text-accent-foreground/80 max-w-2xl mx-auto mb-8">
              Join the 150+ healthcare facilities that have trusted LASO for their imaging equipment needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quote">
                <Button variant="secondary" size="lg">
                  Request a Quote
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudies;
