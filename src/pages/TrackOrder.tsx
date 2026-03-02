import { Link } from 'react-router-dom';
import { Phone, Mail, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

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

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Customer Portal Option */}
              <div className="bg-secondary rounded-lg p-8 mb-8 text-center">
                <User className="h-12 w-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Existing Customers
                </h2>
                <p className="text-muted-foreground mb-6">
                  Log in to your customer portal to view your orders, track deliveries, and access service history.
                </p>
                <Button asChild size="lg">
                  <Link to="/auth/customer">Access Customer Portal</Link>
                </Button>
              </div>

              {/* Contact Options */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
                  Need Order Status Updates?
                </h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Contact our team directly for immediate assistance with your order status, delivery schedules, or installation appointments.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <a 
                    href="tel:18445115276" 
                    className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="bg-accent/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call Us</p>
                      <p className="text-lg font-semibold text-foreground">(844) 511-5276</p>
                    </div>
                  </a>
                  
                  <a 
                    href="mailto:orders@lasoimaging.com" 
                    className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="bg-accent/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Us</p>
                      <p className="text-lg font-semibold text-foreground">orders@lasoimaging.com</p>
                    </div>
                  </a>
                </div>
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
