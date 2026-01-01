import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Shield, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/shared/QuoteForm";

const Quote = () => {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get("product") || "";
  const interest = searchParams.get("interest") || "";

  const trustIndicators = [
    { icon: Clock, title: "Fast Response", description: "Get a quote within 24 hours" },
    { icon: Shield, title: "No Obligation", description: "Free quotes with no pressure" },
    { icon: Users, title: "Expert Consultation", description: "Speak with specialists" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Your Free Quote
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Tell us about your medical imaging equipment needs and our experts will provide a customized quote within 24 hours.
            </p>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>

              {productName && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="font-medium text-foreground">Requesting quote for: {productName}</span>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <QuoteForm
                  sourcePage="quote-page"
                  prefilledInterest={interest || undefined}
                  title="Request a Quote"
                  subtitle="Fill out the form below and we'll get back to you within 24 hours with a customized quote."
                />
              </div>

              {/* Additional Info */}
              <div className="mt-8 text-center text-muted-foreground">
                <p className="text-sm">
                  Have questions? Call us at{" "}
                  <a href="tel:+1-800-123-4567" className="text-accent hover:underline font-medium">
                    1-800-123-4567
                  </a>{" "}
                  or email{" "}
                  <a href="mailto:sales@lasomedical.com" className="text-accent hover:underline font-medium">
                    sales@lasomedical.com
                  </a>
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

export default Quote;
