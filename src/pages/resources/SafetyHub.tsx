import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, ExternalLink, ArrowRight, BookOpen, AlertTriangle, Activity, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { PageBreadcrumb } from '@/components/shared/PageBreadcrumb';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';

const safetyArticles = [
  {
    title: 'MRI Safety Guidelines',
    slug: 'mri-safety-guidelines-complete-guide',
    description: 'Complete guide to the ACR 4-Zone model, projectile hazards, RF burns, cryogen quench procedures, and MRI-compatible materials.',
    icon: Activity,
    modality: 'MRI',
    readTime: '8 min read'
  },
  {
    title: 'CT Radiation Safety (ALARA)',
    slug: 'ct-radiation-safety-alara-principles',
    description: 'ALARA principles explained, dose optimization strategies, diagnostic reference levels, and special population considerations.',
    icon: Zap,
    modality: 'CT',
    readTime: '7 min read'
  },
  {
    title: 'X-Ray Safety Best Practices',
    slug: 'xray-safety-best-practices-facilities',
    description: 'Time-distance-shielding triad, operator PPE requirements, patient protection measures, and quality control essentials.',
    icon: AlertTriangle,
    modality: 'X-Ray',
    readTime: '6 min read'
  }
];

const officialResources = [
  {
    title: 'ACR Radiation Safety Guidelines',
    description: 'Official American College of Radiology radiation safety resources and clinical tools.',
    href: 'https://www.acr.org/clinical-resources/clinical-tools-and-reference/radiology-safety/radiation-safety',
    source: 'American College of Radiology'
  },
  {
    title: 'ACR Clinical Resources Portal',
    description: 'Comprehensive radiology safety clinical resources and reference materials.',
    href: 'https://cs.acr.org/Clinical-Resources/Radiology-Safety/Radiation-Safety',
    source: 'ACR Clinical Resources'
  },
  {
    title: 'RadiologyInfo.org Patient Safety',
    description: 'Patient-focused radiation safety information developed by RSNA and ACR.',
    href: 'https://www.radiologyinfo.org/en/info/safety-radiation',
    source: 'RSNA & ACR'
  },
  {
    title: 'Kryptonite MRI Safety Guidelines',
    description: 'In-depth MRI safety protocols, zone management, and hazard prevention strategies.',
    href: 'https://kryptonite.global/blogs/mri-safety-guidelines/',
    source: 'Kryptonite Solutions'
  }
];

const safetyFaqs = [
  {
    question: 'What is the ALARA principle in radiology?',
    answer: 'ALARA stands for "As Low As Reasonably Achievable." It is the guiding principle for radiation safety, emphasizing that radiation exposure should be minimized through proper technique, equipment maintenance, and protocol optimization while still achieving diagnostic quality images.'
  },
  {
    question: 'What are the 4 MRI safety zones?',
    answer: 'The ACR 4-Zone model includes: Zone 1 (public access areas), Zone 2 (screening checkpoint where patients are interviewed), Zone 3 (restricted control room area), and Zone 4 (the magnet room itself, within the 5 Gauss line). Each zone has increasing safety restrictions.'
  },
  {
    question: 'How often should imaging equipment undergo safety inspections?',
    answer: 'Most regulatory bodies require annual physics surveys for all imaging equipment. However, preventive maintenance should be performed quarterly for optimal safety and performance. Daily quality control checks are also recommended for operators.'
  },
  {
    question: 'What role does equipment maintenance play in radiation safety?',
    answer: 'Proper maintenance ensures accurate radiation output, correct calibration, and optimal image quality—allowing lower doses to achieve diagnostic results. Poorly maintained equipment may require higher doses or repeat exposures, increasing patient radiation burden.'
  }
];

const schemaBreadcrumbs = [
  { name: 'Home', url: 'https://lasoimaging.com/' },
  { name: 'Resources', url: 'https://lasoimaging.com/resources/safety' },
  { name: 'Safety', url: 'https://lasoimaging.com/resources/safety' }
];

const pageBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Resources' },
  { label: 'Safety' }
];

const SafetyHub = () => {
  return (
    <>
      <Helmet>
        <title>Imaging Safety Resources | MRI, CT, X-Ray Guidelines | LASO Imaging</title>
        <meta 
          name="description" 
          content="Comprehensive imaging safety resources including MRI safety guidelines, CT radiation safety (ALARA), X-ray best practices, and links to official ACR and RadiologyInfo resources." 
        />
        <meta 
          name="keywords" 
          content="MRI safety, CT radiation safety, X-ray safety, ALARA principle, radiology safety guidelines, imaging equipment safety, ACR guidelines" 
        />
        <link rel="canonical" href="https://lasoimaging.com/resources/safety" />
      </Helmet>
      
      <BreadcrumbSchema items={schemaBreadcrumbs} />
      <FAQSchema faqs={safetyFaqs} />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-6">
          <PageBreadcrumb items={pageBreadcrumbs} />
        </div>
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Safety First
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Imaging Safety Resources
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive safety guidelines for MRI, CT, and X-ray imaging. Access our in-depth articles and official resources from ACR, RSNA, and RadiologyInfo.org.
            </p>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#mri-safety" className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors">
                MRI Safety
              </a>
              <a href="#ct-safety" className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors">
                CT Safety
              </a>
              <a href="#xray-safety" className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors">
                X-Ray Safety
              </a>
              <a href="#official-resources" className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors">
                Official Guidelines
              </a>
            </div>
          </div>
        </section>
        
        {/* Safety Articles Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Safety Guidelines by Modality
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                In-depth safety articles covering best practices, regulatory requirements, and practical tips for each imaging modality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {safetyArticles.map((article) => (
                <Link 
                  key={article.slug}
                  id={`${article.modality.toLowerCase()}-safety`}
                  to={`/blog/${article.slug}`}
                  className="group bg-card border border-border rounded-2xl p-8 hover:border-accent hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <article.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground mb-4">
                    {article.modality}
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-3">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    <span className="text-accent font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Guide <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Official Resources Section */}
        <section id="official-resources" className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                Official Guidelines
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Authoritative Safety Resources
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Links to official guidelines from the American College of Radiology (ACR), RSNA, and other authoritative sources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {officialResources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card border border-border rounded-xl p-6 hover:border-accent hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors pr-4">
                      {resource.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {resource.description}
                  </p>
                  <span className="text-xs text-accent font-medium">
                    {resource.source}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Common questions about imaging safety and regulatory compliance.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {safetyFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* PM Connection Section */}
        <section className="py-16 md:py-20 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card border border-accent/30 rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                Maintenance = Safety
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Proper Maintenance Ensures Equipment Safety
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Regular preventive maintenance is essential for radiation safety, image quality, and regulatory compliance. 
                Our PM programs include calibration verification, safety interlock testing, and dose optimization checks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/services/preventive-maintenance">
                  <Button size="lg" className="gap-2">
                    Learn About PM Services
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/quote?interest=Preventive%20Maintenance">
                  <Button variant="outline" size="lg">
                    Request PM Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need Safety Training or Consultation?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Our team provides on-site safety training, compliance audits, and custom safety program development for imaging facilities nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+18188866061">
                <Button variant="secondary" size="lg" className="gap-2">
                  Call (818) 886-6061
                </Button>
              </a>
              <Link to="/quote?interest=Safety%20Training">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default SafetyHub;
