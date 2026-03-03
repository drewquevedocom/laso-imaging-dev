import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

const supportData: Record<string, { title: string; description: string; metaDescription: string; keywords: string[] }> = {
  'technical': {
    title: 'Technical Support',
    description: 'Expert technical support for all your medical imaging equipment needs.',
    metaDescription: 'Technical support for MRI, CT, and X-Ray equipment. Expert assistance from certified engineers.',
    keywords: ['MRI technical support', 'medical imaging help', 'CT support']
  },
  'warranty': {
    title: 'Warranty Information',
    description: 'Comprehensive warranty coverage for all equipment purchases.',
    metaDescription: 'Medical imaging equipment warranty information. Comprehensive coverage for MRI, CT, and X-Ray systems.',
    keywords: ['MRI warranty', 'equipment warranty', 'medical imaging coverage']
  },
  'returns': {
    title: 'Returns & Exchanges',
    description: 'Our returns and exchange policy for parts and equipment.',
    metaDescription: 'Medical imaging parts returns policy. Easy returns and exchanges for qualifying items.',
    keywords: ['parts returns', 'equipment exchange', 'return policy']
  },
  'documentation': {
    title: 'Documentation & Resources',
    description: 'Technical documentation, manuals, and resources for your equipment.',
    metaDescription: 'Medical imaging documentation and resources. Access manuals, guides, and technical specifications.',
    keywords: ['MRI manuals', 'technical documentation', 'equipment guides']
  },
};

const SupportPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const support = slug ? supportData[slug] : null;

  if (!support) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
            <Link to="/contact" className="text-accent hover:underline">
              Contact Support
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={support.title}
        description={support.metaDescription}
        keywords={support.keywords}
        canonical={`/support/${slug}`}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {support.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {support.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-secondary rounded-lg p-12 mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Get Support</h2>
                <p className="text-muted-foreground mb-6">
                  Need help with {support.title.toLowerCase()}? Our team is ready to assist you.
                </p>
                <Link to="/contact">
                  <Button variant="default" size="lg">
                    Contact Support
                  </Button>
                </Link>
              </div>
              <Link to="/contact" className="text-accent hover:underline">
                ← Back to Contact
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPage;
