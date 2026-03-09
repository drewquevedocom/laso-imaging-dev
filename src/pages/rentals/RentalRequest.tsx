import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RentalAvailabilityCalendar } from "@/components/rentals/RentalAvailabilityCalendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EQUIPMENT_TYPES = [
  "Mobile MRI",
  "Mobile CT",
  "Mobile PET/CT",
  "Fixed MRI System",
  "Fixed CT Scanner",
  "C-Arm",
  "X-Ray System",
  "Ultrasound",
  "Other",
];

const RENTAL_DURATIONS = [
  "1-2 weeks",
  "1 month",
  "3 months",
  "6 months",
  "12+ months",
  "Custom",
];

const FACILITY_TYPES = [
  "Hospital",
  "Imaging Center",
  "Clinic",
  "Research Facility",
  "Mobile Healthcare Provider",
  "Other",
];

const RentalRequest = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");

  const [formData, setFormData] = useState({
    equipment_type: "",
    specific_model: "",
    rental_duration: "",
    start_date: "",
    delivery_address: "",
    city: "",
    state: "",
    zip: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    facility_type: "",
    notes: "",
    email_opt_in: true,
    sms_opt_in: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = `
Equipment Rental Request:
- Equipment Type: ${formData.equipment_type}
${formData.specific_model ? `- Specific Model: ${formData.specific_model}` : ""}
- Rental Duration: ${formData.rental_duration}
- Desired Start Date: ${formData.start_date}
- Delivery Address: ${formData.delivery_address}, ${formData.city}, ${formData.state} ${formData.zip}
${formData.facility_type ? `- Facility Type: ${formData.facility_type}` : ""}
${formData.notes ? `- Additional Notes: ${formData.notes}` : ""}
      `.trim();

      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        interest: `Equipment Rental - ${formData.equipment_type}`,
        message: message,
        source_page: "/rentals",
        email_opt_in: formData.email_opt_in,
        sms_opt_in: formData.sms_opt_in,
      });

      if (error) throw error;

      try {
        await supabase.functions.invoke("send-rental-request-notification", {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            equipment_type: formData.equipment_type,
            specific_model: formData.specific_model,
            rental_duration: formData.rental_duration,
            start_date: formData.start_date,
            delivery_address: `${formData.delivery_address}, ${formData.city}, ${formData.state} ${formData.zip}`,
            facility_type: formData.facility_type,
            notes: formData.notes,
            email_opt_in: formData.email_opt_in,
            sms_opt_in: formData.sms_opt_in,
          },
        });
      } catch (notifyError) {
        console.error("Notification error:", notifyError);
      }

      setIsSubmitted(true);
      toast.success("Rental request submitted successfully!");
    } catch (error) {
      console.error("Error submitting rental request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your rental inquiry. Our team will review your request and contact you within 1 business day with availability and pricing.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
                <Button onClick={() => navigate("/products")}>
                  Browse Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Equipment Rental Request | LASO Imaging</title>
        <meta
          name="description"
          content="Request a rental for mobile MRI, CT, PET/CT, and other medical imaging equipment. Flexible terms and nationwide delivery."
        />
      </Helmet>

      <Header />

      <main className="py-12 px-4 bg-muted/30 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <CalendarCheck className="h-5 w-5" />
              <span className="font-medium">Equipment Rental</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Rent Medical Imaging Equipment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Need temporary imaging equipment? Check availability and request a rental with flexible terms, nationwide delivery, and full support.
            </p>
          </div>

          {/* Availability Calendar Section */}
          <div className="mb-12">
            <RentalAvailabilityCalendar />
          </div>

          {/* Form Card */}
          <Card id="rental-form">
            <CardHeader>
              <CardTitle>Request a Rental</CardTitle>
              <CardDescription>
                Tell us about your equipment needs and we'll provide a custom quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Equipment Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Equipment Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="equipment_type">Equipment Type *</Label>
                      <Select
                        value={formData.equipment_type}
                        onValueChange={(v) => setFormData({ ...formData, equipment_type: v })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EQUIPMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specific_model">Specific Model (Optional)</Label>
                      <Input
                        id="specific_model"
                        value={formData.specific_model}
                        onChange={(e) =>
                          setFormData({ ...formData, specific_model: e.target.value })
                        }
                        placeholder="e.g., GE Signa 1.5T"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rental_duration">Rental Duration *</Label>
                      <Select
                        value={formData.rental_duration}
                        onValueChange={(v) => setFormData({ ...formData, rental_duration: v })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {RENTAL_DURATIONS.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Desired Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Delivery Location</h3>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_address">Street Address *</Label>
                    <Input
                      id="delivery_address"
                      value={formData.delivery_address}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_address: e.target.value })
                      }
                      placeholder="123 Medical Center Drive"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company / Facility</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility_type">Facility Type</Label>
                      <Select
                        value={formData.facility_type}
                        onValueChange={(v) => setFormData({ ...formData, facility_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FACILITY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Additional Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requirements or Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requirements, site conditions, or questions..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium">Communication Preferences</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="email_opt_in"
                        checked={formData.email_opt_in}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, email_opt_in: checked as boolean })
                        }
                      />
                      <Label htmlFor="email_opt_in" className="font-normal cursor-pointer">
                        I'd like to receive updates via email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="sms_opt_in"
                        checked={formData.sms_opt_in}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sms_opt_in: checked as boolean })
                        }
                      />
                      <Label htmlFor="sms_opt_in" className="font-normal cursor-pointer">
                        I'd like to receive SMS updates about my rental
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Rental Request
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Terms</h3>
              <p className="text-sm text-muted-foreground">
                Daily, weekly, monthly, or long-term rentals to fit your needs
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Nationwide Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Professional installation and setup at your location
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Full Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 technical support and maintenance included
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RentalRequest;
