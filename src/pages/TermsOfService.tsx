import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
const TermsOfService = () => {
  return <div className="min-h-screen bg-background">
      <SEOHead title="Terms of Service" description="LASO Imaging Solutions terms of service. Read our terms and conditions for using our website and services." keywords={['terms of service', 'terms and conditions', 'LASO Imaging']} canonical="/terms-of-service" />
      <Header />
      
      <main>
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Last updated: January 8, 2026
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-6">
                By accessing and using the LASO Imaging Solutions website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services Description</h2>
              <p className="text-muted-foreground mb-6">
                LASO Imaging Solutions provides medical imaging equipment sales, maintenance, installation, training, and related services. All equipment sales and services are subject to additional terms provided at the time of purchase or service agreement.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">When using our website and services, you agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Provide accurate and complete information in all forms and communications</li>
                <li>Not use our services for any unlawful purpose</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-6">
                All content on this website, including text, graphics, logos, images, and software, is the property of LASO Imaging Solutions or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Product Information</h2>
              <p className="text-muted-foreground mb-6">
                We strive to provide accurate product descriptions and pricing. However, we reserve the right to correct any errors and to change or update information at any time without prior notice. All equipment sales are subject to availability.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-6">
                To the fullest extent permitted by law, LASO Imaging Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Warranty Disclaimer</h2>
              <p className="text-muted-foreground mb-6">
                Equipment warranties are provided separately with each purchase. Website content and online services are provided "as is" without warranties of any kind, either express or implied.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Governing Law</h2>
              <p className="text-muted-foreground mb-6">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground mb-6">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                Phone: (844) 511-5276
              </p>
              <div className="bg-secondary rounded-lg p-6 mb-6">
                <p className="text-foreground font-medium">LASO Imaging Solutions</p>
                <p className="text-muted-foreground">Los Angeles,CA </p>
                <p className="text-muted-foreground">Email: info@lasoimaging.com</p>
                <p className="text-muted-foreground">Phone: (844) 511-5276</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default TermsOfService;