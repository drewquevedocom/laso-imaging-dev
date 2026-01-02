import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { getCaseStudyBySlug, caseStudies } from '@/data/caseStudies';
import { ArrowLeft, ArrowRight, Building2, MapPin, CheckCircle2, Quote } from 'lucide-react';

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = slug ? getCaseStudyBySlug(slug) : null;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Case Study Not Found</h1>
            <Link to="/case-studies" className="text-accent hover:underline">
              View All Case Studies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related case studies (same industry, excluding current)
  const relatedStudies = caseStudies
    .filter(cs => cs.industry === caseStudy.industry && cs.slug !== caseStudy.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${caseStudy.title} | LASO Case Studies`}
        description={`Learn how ${caseStudy.client} achieved ${caseStudy.results[0].metric} ${caseStudy.results[0].label.toLowerCase()} with LASO's imaging solutions.`}
        keywords={['MRI case study', caseStudy.industry, caseStudy.client, 'medical imaging success story']}
        canonical={`/case-studies/${slug}`}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link to="/case-studies" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case Studies
            </Link>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="text-xs font-medium px-3 py-1 bg-accent text-accent-foreground rounded-full">
                  {caseStudy.industry}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                {caseStudy.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {caseStudy.client}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {caseStudy.location}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Results Summary */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {caseStudy.results.map((result, idx) => (
                <div key={idx} className="text-center p-6 bg-card rounded-xl border border-border">
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">{result.metric}</p>
                  <p className="text-sm text-muted-foreground">{result.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Challenge */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">The Challenge</h2>
                  <p className="text-muted-foreground leading-relaxed">{caseStudy.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Solution</h2>
                  <p className="text-muted-foreground leading-relaxed">{caseStudy.solution}</p>
                </div>

                {/* Testimonial */}
                <div className="bg-accent/10 rounded-xl p-8">
                  <Quote className="w-10 h-10 text-accent mb-4" />
                  <blockquote className="text-lg text-foreground italic mb-6">
                    "{caseStudy.testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-foreground">{caseStudy.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{caseStudy.testimonial.title}</p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Equipment Used */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Equipment Provided</h3>
                  <ul className="space-y-3">
                    {caseStudy.equipment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-accent rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-accent-foreground mb-2">
                    Ready for Similar Results?
                  </h3>
                  <p className="text-sm text-accent-foreground/80 mb-4">
                    Let's discuss your imaging equipment needs
                  </p>
                  <Link to="/quote">
                    <Button variant="secondary" className="w-full">
                      Request a Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {relatedStudies.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedStudies.map((study) => (
                  <div
                    key={study.slug}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">{study.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <span>{study.client}</span>
                        <span>{study.location}</span>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-3 mb-4">
                        <p className="text-xl font-bold text-accent">{study.results[0].metric}</p>
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
