import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sign Up"
        description="Create an account with LASO Imaging Solutions to receive 10% off your first order, exclusive deals, and updates on medical imaging equipment."
        keywords={['sign up', 'create account', 'MRI equipment deals', 'medical imaging discounts']}
        canonical="/signup"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Create Your Account
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Sign up for exclusive offers and 10% off your first order
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
                  Account registration is coming soon. Contact us directly to learn about current promotions.
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

export default SignUp;
