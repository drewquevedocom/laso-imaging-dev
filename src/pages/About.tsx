import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us"
        description="LASO Imaging Solutions is an FDA registered dealer with 18+ years of experience in refurbished MRI, CT, and X-Ray equipment. Learn about our mission and values."
        keywords={['about LASO imaging', 'medical imaging company', 'MRI equipment dealer', 'FDA registered']}
        canonical="/about"
      />
      <LocalBusinessSchema />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              About LASO Imaging Solutions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Your trusted partner in medical imaging equipment since 2006
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
                  We're working on bringing you more information about our company, mission, and the team behind LASO Imaging Solutions.
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

export default About;
