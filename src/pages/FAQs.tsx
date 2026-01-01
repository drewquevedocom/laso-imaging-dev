import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const faqs = [
  {
    question: "What types of medical imaging equipment do you sell?",
    answer: "We specialize in MRI systems (1.5T, 3.0T, Open MRI, Extremity MRI), CT scanners, X-Ray units, and PET/CT systems from leading manufacturers including GE, Siemens, Philips, and Toshiba/Canon."
  },
  {
    question: "Are your refurbished systems FDA registered?",
    answer: "Yes, LASO Imaging Solutions is an FDA registered medical equipment dealer. All our refurbished systems meet strict quality standards and regulatory requirements."
  },
  {
    question: "Do you offer warranties on used equipment?",
    answer: "Yes, we provide comprehensive warranties on all equipment we sell. Warranty terms vary by equipment type and condition. Contact us for specific warranty information."
  },
  {
    question: "What service areas do you cover?",
    answer: "We provide nationwide coverage across the United States, including installation, maintenance, and emergency repair services."
  },
  {
    question: "Do you offer mobile MRI solutions?",
    answer: "Yes, we offer mobile MRI rentals for interim projects, facility renovations, and temporary capacity needs with flexible rental terms."
  }
];

const FAQs = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Frequently Asked Questions"
        description="Find answers to common questions about medical imaging equipment, MRI systems, warranties, service coverage, and more from LASO Imaging Solutions."
        keywords={['MRI FAQ', 'medical imaging questions', 'refurbished MRI', 'equipment warranty']}
        canonical="/faqs"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Find answers to common questions about our equipment and services
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h2>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
