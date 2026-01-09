import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
const CookiePolicy = () => {
  return <div className="min-h-screen bg-background">
      <SEOHead title="Cookie Policy" description="LASO Imaging Solutions cookie policy. Learn about how we use cookies and similar technologies on our website." keywords={['cookie policy', 'cookies', 'tracking', 'LASO Imaging']} canonical="/cookie-policy" />
      <Header />
      
      <main>
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Last updated: January 8, 2026
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground mb-6">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your browsing experience.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">We use the following types of cookies:</p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">Analytics Cookies</h3>
              <p className="text-muted-foreground mb-4">
                We use Google Analytics to understand how visitors interact with our website. These cookies collect information about page views, traffic sources, and user behavior. This data helps us improve our website and services.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">Functional Cookies</h3>
              <p className="text-muted-foreground mb-6">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and chat session history.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">We may use third-party services that set their own cookies:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li><strong>Google Analytics:</strong> For website usage analysis</li>
                <li><strong>Shopify:</strong> For e-commerce functionality and cart management</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings menu.</li>
                <li><strong>Opt-Out Links:</strong> You can opt out of Google Analytics by visiting <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Analytics Opt-out</a>.</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                Please note that blocking some cookies may impact your experience on our website and limit the services we can provide.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Retention</h2>
              <p className="text-muted-foreground mb-6">
                The retention period for cookies varies depending on their purpose. Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a set period or until you delete them.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground mb-6">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                Phone: 1-800-MRI-LASO (674-5276)
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
export default CookiePolicy;