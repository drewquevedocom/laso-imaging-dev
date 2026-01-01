import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

const brandData: Record<string, { title: string; description: string; metaDescription: string; keywords: string[] }> = {
  'ge': {
    title: 'GE Healthcare Parts',
    description: 'Quality replacement parts for GE Healthcare MRI and CT systems.',
    metaDescription: 'GE Healthcare MRI and CT parts. Coils, amplifiers, cold heads, and more for GE Signa, Optima, and Discovery systems.',
    keywords: ['GE MRI parts', 'GE Healthcare parts', 'GE Signa parts']
  },
  'siemens': {
    title: 'Siemens Healthineers Parts',
    description: 'Quality replacement parts for Siemens MRI and CT systems.',
    metaDescription: 'Siemens MRI and CT parts. Coils, amplifiers, and components for Magnetom and SOMATOM systems.',
    keywords: ['Siemens MRI parts', 'Siemens Magnetom parts', 'Siemens CT parts']
  },
  'philips': {
    title: 'Philips Healthcare Parts',
    description: 'Quality replacement parts for Philips MRI and CT systems.',
    metaDescription: 'Philips MRI and CT parts. Coils, amplifiers, and components for Achieva and Ingenia systems.',
    keywords: ['Philips MRI parts', 'Philips Achieva parts', 'Philips CT parts']
  },
  'toshiba': {
    title: 'Toshiba / Canon Medical Parts',
    description: 'Quality replacement parts for Toshiba and Canon Medical MRI and CT systems.',
    metaDescription: 'Toshiba and Canon Medical parts. Coils, amplifiers, and components for Vantage and Aquilion systems.',
    keywords: ['Toshiba MRI parts', 'Canon Medical parts', 'Vantage parts']
  },
  'hitachi': {
    title: 'Hitachi Medical Parts',
    description: 'Quality replacement parts for Hitachi MRI systems.',
    metaDescription: 'Hitachi MRI parts. Coils and components for Oasis and Echelon open MRI systems.',
    keywords: ['Hitachi MRI parts', 'Hitachi Oasis parts', 'open MRI parts']
  },
};

const PartsBrand = () => {
  const { brand } = useParams<{ brand: string }>();
  const brandInfo = brand ? brandData[brand] : null;

  if (!brandInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
            <Link to="/parts" className="text-accent hover:underline">
              View All Parts
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
        title={brandInfo.title}
        description={brandInfo.metaDescription}
        keywords={brandInfo.keywords}
        canonical={`/parts/brand/${brand}`}
        type="product"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {brandInfo.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {brandInfo.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-secondary rounded-lg p-12 mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
                <p className="text-muted-foreground mb-6">
                  Our {brandInfo.title.toLowerCase()} catalog is being prepared.
                </p>
                <Link to="/quote?interest=Parts">
                  <Button variant="default" size="lg">
                    Request Parts Quote
                  </Button>
                </Link>
              </div>
              <Link to="/parts" className="text-accent hover:underline">
                ← Back to All Parts
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartsBrand;
