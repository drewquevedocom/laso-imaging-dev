import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        interest: formData.subject || "General Inquiry",
        message: formData.message,
        source_page: "Contact Page",
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | LASO Imaging</title>
        <meta
          name="description"
          content="Get in touch with LASO Imaging for MRI equipment inquiries, service requests, and parts quotes. Our team responds within 24 hours."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded mb-4">
                GET IN TOUCH
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Have questions about MRI equipment, parts, or services? Our team
                is here to help. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@hospital.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Facility</Label>
                      <Input
                        id="company"
                        placeholder="Memorial Hospital"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment Inquiry">
                          Equipment Inquiry
                        </SelectItem>
                        <SelectItem value="Parts Quote">Parts Quote</SelectItem>
                        <SelectItem value="Service Request">
                          Service Request
                        </SelectItem>
                        <SelectItem value="Training">
                          Training & Support
                        </SelectItem>
                        <SelectItem value="General Question">
                          General Question
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your needs..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info & Map */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Office Address
                        </h3>
                        <p className="text-muted-foreground">
                          8129 Clybourn Ave
                          <br />
                          Sun Valley, CA 91352
                        </p>
                        <p className="text-sm text-accent font-medium mt-1">
                          Nationwide Service
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Phone</h3>
                        <a href="tel:18006745276" className="text-muted-foreground hover:text-accent transition-colors block">
                          1-800-MRI-LASO (1-800-674-5276)
                        </a>
                        <p className="text-sm text-accent font-medium mt-1">
                          24/7 Emergency Support
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <a href="mailto:info@lasoimaging.com" className="text-muted-foreground hover:text-accent transition-colors block">
                          info@lasoimaging.com
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Business Hours
                        </h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 8:00 AM - 6:00 PM PST
                        </p>
                        <p className="text-sm text-accent font-medium mt-1">
                          24/7 Emergency Support Available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Contact Us */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Why Choose LASO Imaging?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "18+ years of MRI industry experience",
                      "FDA registered & ISO certified",
                      "Same-day response guarantee",
                      "Nationwide service coverage",
                      "Flexible financing options",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Map Placeholder */}
                <div className="bg-muted border border-border rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Interactive map coming soon
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Requires Mapbox API key
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
