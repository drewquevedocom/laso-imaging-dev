import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trackQuoteRequest } from "@/components/analytics/GoogleAnalytics";

const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  company: z.string().optional(),
  interest: z.string().min(1, "Please select an interest"),
  message: z.string().max(1000).optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  sourcePage: string;
  prefilledInterest?: string;
  variant?: "default" | "compact" | "sidebar";
  title?: string;
  subtitle?: string;
}

const interestOptions = [
  { value: "1.5T Systems", label: "1.5T MRI Systems" },
  { value: "3T Systems", label: "3.0T MRI Systems" },
  { value: "CT Systems", label: "CT Systems" },
  { value: "X-Ray Systems", label: "X-Ray Systems" },
  { value: "Parts", label: "Parts & Components" },
  { value: "Service", label: "Service & Maintenance" },
  { value: "Mobile MRI", label: "Mobile MRI Units" },
  { value: "Other", label: "Other" },
];

const QuoteForm = ({ 
  sourcePage, 
  prefilledInterest, 
  variant = "default",
  title = "Request a Quote",
  subtitle = "Fill out the form below and our team will get back to you within 24 hours."
}: QuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      interest: prefilledInterest || "",
    },
  });

  const selectedInterest = watch("interest");

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert lead into database
      const { data: lead, error: insertError } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          interest: data.interest,
          message: data.message || null,
          source_page: sourcePage,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Trigger lead scoring
      if (lead) {
        await supabase.functions.invoke("calculate-lead-score", {
          body: { leadId: lead.id },
        });
      }

      // Track quote request in Google Analytics
      trackQuoteRequest(data.interest, sourcePage);

      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "Our team will contact you within 24 hours.",
      });

      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 text-center ${variant === "compact" ? "py-8" : "py-12"}`}>
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your quote request has been received. We'll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  const isCompact = variant === "compact";
  const isSidebar = variant === "sidebar";

  return (
    <div className={`bg-card border border-border rounded-xl ${isCompact ? "p-4" : "p-6"}`}>
      {!isCompact && (
        <div className="mb-6">
          <h3 className={`font-semibold text-foreground ${isSidebar ? "text-lg" : "text-xl"}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={isSidebar ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Smith"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@hospital.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company/Hospital</Label>
            <Input
              id="company"
              placeholder="Memorial Hospital"
              {...register("company")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest">Interest *</Label>
          <Select
            value={selectedInterest}
            onValueChange={(value) => setValue("interest", value)}
          >
            <SelectTrigger className={errors.interest ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your interest" />
            </SelectTrigger>
            <SelectContent>
              {interestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interest && (
            <p className="text-xs text-destructive">{errors.interest.message}</p>
          )}
        </div>

        {!isCompact && (
          <div className="space-y-2">
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your requirements..."
              rows={3}
              {...register("message")}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size={isCompact ? "default" : "lg"}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Get Your Free Quote"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, you agree to our privacy policy. We'll never share your information.
        </p>
      </form>
    </div>
  );
};

export default QuoteForm;
