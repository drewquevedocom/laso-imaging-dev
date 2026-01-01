import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

const partsData: Record<string, { title: string; description: string; metaDescription: string; keywords: string[] }> = {
  'mri-coils': {
    title: 'MRI Coils',
    description: 'Quality replacement MRI coils for all major manufacturers.',
    metaDescription: 'MRI coils for GE, Siemens, Philips, and Toshiba. Head coils, body coils, knee coils, and more.',
    keywords: ['MRI coils', 'replacement coils', 'imaging coils']
  },
  'gradient-amplifiers': {
    title: 'Gradient Amplifiers',
    description: 'High-quality gradient amplifiers and components.',
    metaDescription: 'MRI gradient amplifiers for all major manufacturers. New and refurbished options available.',
    keywords: ['gradient amplifier', 'MRI amplifier', 'gradient system']
  },
  'rf-amplifiers': {
    title: 'RF Amplifiers',
    description: 'RF amplifiers and transmit chain components.',
    metaDescription: 'MRI RF amplifiers and transmit components. Quality parts for optimal image quality.',
    keywords: ['RF amplifier', 'MRI transmitter', 'RF chain']
  },
  'cold-heads': {
    title: 'Cold Heads',
    description: 'Cryocooler cold heads for superconducting MRI systems.',
    metaDescription: 'MRI cold heads and cryocoolers. New and refurbished options from leading manufacturers.',
    keywords: ['cold head', 'cryocooler', 'MRI cryogenic']
  },
  'compressors': {
    title: 'Compressors',
    description: 'Helium compressors for MRI cryogenic systems.',
    metaDescription: 'MRI helium compressors. Quality replacement compressors for all major MRI systems.',
    keywords: ['helium compressor', 'MRI compressor', 'cryogenic compressor']
  },
  'head-coils': {
    title: 'Head Coils',
    description: 'Quality head coils for brain and neurological imaging.',
    metaDescription: 'MRI head coils for neuroimaging. Compatible with GE, Siemens, Philips, and Toshiba systems.',
    keywords: ['head coil', 'brain coil', 'neuro coil']
  },
  'body-coils': {
    title: 'Body Coils',
    description: 'Body coils for thoracic and abdominal imaging.',
    metaDescription: 'MRI body coils for chest and abdominal imaging. High-quality replacement coils.',
    keywords: ['body coil', 'torso coil', 'abdominal coil']
  },
  'knee-coils': {
    title: 'Knee Coils',
    description: 'Specialized coils for knee and joint imaging.',
    metaDescription: 'MRI knee coils for orthopedic imaging. Quality replacement coils for all systems.',
    keywords: ['knee coil', 'joint coil', 'orthopedic coil']
  },
  'spine-coils': {
    title: 'Spine Coils',
    description: 'Spine coils for vertebral and spinal cord imaging.',
    metaDescription: 'MRI spine coils for spinal imaging. High-resolution coils for all major manufacturers.',
    keywords: ['spine coil', 'spinal coil', 'vertebral imaging']
  },
  'extremity-coils': {
    title: 'Extremity Coils',
    description: 'Coils for hands, wrists, feet, and ankle imaging.',
    metaDescription: 'MRI extremity coils for hands, wrists, feet, and ankles. Quality replacement options.',
    keywords: ['extremity coil', 'wrist coil', 'ankle coil', 'hand coil']
  },
  'coils': {
    title: 'All MRI Coils',
    description: 'Complete selection of MRI coils for all body parts.',
    metaDescription: 'Browse all MRI coils including head, body, knee, spine, and extremity coils.',
    keywords: ['MRI coils', 'imaging coils', 'RF coils']
  },
};

const PartsCategory = () => {
  const { category } = useParams<{ category: string }>();
  const parts = category ? partsData[category] : null;

  if (!parts) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
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
        title={parts.title}
        description={parts.metaDescription}
        keywords={parts.keywords}
        canonical={`/parts/${category}`}
        type="product"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {parts.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {parts.description}
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
                  Our {parts.title.toLowerCase()} catalog is being prepared.
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

export default PartsCategory;
