import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
const PrivacyPolicy = () => {
  return <div className="min-h-screen bg-background">
      <SEOHead title="Privacy Policy" description="LASO Imaging Solutions privacy policy. Learn how we collect, use, and protect your personal information." keywords={['privacy policy', 'data protection', 'LASO Imaging']} canonical="/privacy-policy" />
      <Header />
      
      <main>
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Last updated: January 8, 2026
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-6">
                LASO Imaging Solutions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We may collect information about you in various ways:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, company name, and mailing address when you fill out forms or contact us.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</li>
                <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Process quotes, orders, and service requests</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground mb-6">
                We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-secondary rounded-lg p-6 mb-6">
                <p className="text-foreground font-medium">LASO Imaging Solutions</p>
                <p className="text-muted-foreground">Los Angeles, CA </p>
                <p className="text-muted-foreground">Email: info@lasoimaging.com</p>
                <p className="text-muted-foreground">Phone: (713) 357-2749</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default PrivacyPolicy;