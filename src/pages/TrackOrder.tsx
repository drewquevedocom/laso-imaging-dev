import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const TrackOrder = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Track Your Order"
        description="Track your medical imaging equipment order status. Get real-time updates on delivery, installation scheduling, and project milestones."
        keywords={['track order', 'order status', 'delivery tracking', 'MRI equipment delivery']}
        canonical="/track-order"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Get real-time updates on your equipment order status
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
                  Our order tracking system is being developed. Contact us directly for order status updates.
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

export default TrackOrder;
