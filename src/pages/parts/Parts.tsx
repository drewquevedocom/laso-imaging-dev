import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const Parts = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="MRI & CT Parts"
        description="Quality replacement parts for MRI, CT, and X-Ray equipment. MRI coils, gradient amplifiers, cold heads, and more from GE, Siemens, Philips, and Toshiba."
        keywords={['MRI parts', 'CT scanner parts', 'gradient amplifier', 'MRI coils', 'cold head']}
        canonical="/parts"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Medical Imaging Parts
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Quality replacement parts for MRI, CT, and X-Ray equipment
            </p>
          </div>
        </section>

        {/* Content Placeholder */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-secondary rounded-lg p-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
                <p className="text-muted-foreground">
                  Our parts catalog is being developed. Contact us directly for parts inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Parts;
