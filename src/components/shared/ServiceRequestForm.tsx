import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const serviceRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  company: z.string().optional(),
  equipmentType: z.string().min(1, "Please select equipment type"),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  urgency: z.enum(["normal", "urgent", "emergency"]).default("normal"),
  preferredDate: z.string().optional(),
  issueDescription: z.string().min(10, "Please describe your service needs").max(2000),
  emailOptIn: z.boolean().default(true),
  smsOptIn: z.boolean().default(false),
});

type ServiceRequestData = z.infer<typeof serviceRequestSchema>;

interface ServiceRequestFormProps {
  serviceType: string;
  sourcePage: string;
  variant?: "default" | "compact";
}

const equipmentOptions = [
  { value: "MRI", label: "MRI System" },
  { value: "CT", label: "CT Scanner" },
  { value: "X-Ray", label: "X-Ray Unit" },
  { value: "PET/CT", label: "PET/CT Scanner" },
  { value: "Ultrasound", label: "Ultrasound" },
  { value: "Mammography", label: "Mammography" },
  { value: "C-Arm", label: "C-Arm" },
  { value: "Other", label: "Other Equipment" },
];

const urgencyOptions = [
  { value: "normal", label: "Normal", description: "Within 5-7 business days", color: "text-success" },
  { value: "urgent", label: "Urgent", description: "Within 24-48 hours", color: "text-warning" },
  { value: "emergency", label: "Emergency", description: "Same day / ASAP", color: "text-destructive" },
];

const ServiceRequestForm = ({ 
  serviceType, 
  sourcePage,
  variant = "default"
}: ServiceRequestFormProps) => {
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
  } = useForm<ServiceRequestData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      urgency: "normal",
      emailOptIn: true,
      smsOptIn: false,
    },
  });

  const emailOptIn = watch("emailOptIn");
  const smsOptIn = watch("smsOptIn");
  const selectedUrgency = watch("urgency");
  const selectedEquipment = watch("equipmentType");

  const onSubmit = async (data: ServiceRequestData) => {
    setIsSubmitting(true);
    
    try {
      // Calculate lead score based on urgency
      const urgencyScores = { normal: 25, urgent: 50, emergency: 75 };
      const leadScore = urgencyScores[data.urgency];
      const isHot = data.urgency === "emergency";
      
      // Build comprehensive message
      const message = [
        `Service Type: ${serviceType}`,
        `Equipment: ${data.equipmentType}`,
        data.manufacturer ? `Manufacturer: ${data.manufacturer}` : null,
        data.model ? `Model: ${data.model}` : null,
        data.preferredDate ? `Preferred Date: ${data.preferredDate}` : null,
        `Urgency: ${data.urgency.toUpperCase()}`,
        `\nIssue/Details:\n${data.issueDescription}`,
      ].filter(Boolean).join('\n');

      // Insert lead into database and get the ID
      const { data: insertedLead, error: insertError } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          interest: serviceType,
          message: message,
          source_page: `Service Request: ${sourcePage}`,
          email_opt_in: data.emailOptIn,
          sms_opt_in: data.smsOptIn,
          urgency: data.urgency === "emergency" ? "Emergency" : data.urgency === "urgent" ? "Urgent" : "Normal",
          lead_score: leadScore,
          is_hot: isHot,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Log activity for the service request
      if (insertedLead?.id) {
        await supabase.from("activities").insert({
          lead_id: insertedLead.id,
          activity_type: "note",
          content: `Service request submitted: ${data.urgency.toUpperCase()} - ${data.equipmentType}${data.manufacturer ? ` (${data.manufacturer})` : ""}`,
          direction: "inbound",
          subject: `${serviceType} Request`,
          metadata: {
            urgency: data.urgency,
            equipment_type: data.equipmentType,
            manufacturer: data.manufacturer,
            model: data.model,
            preferred_date: data.preferredDate,
          },
        });
      }

      // Send service request notification (non-blocking)
      supabase.functions.invoke('send-service-request-notification', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          company: data.company || '',
          serviceType,
          equipmentType: data.equipmentType,
          manufacturer: data.manufacturer || '',
          model: data.model || '',
          urgency: data.urgency,
          preferredDate: data.preferredDate || '',
          issueDescription: data.issueDescription,
          sourcePage,
          smsOptIn: data.smsOptIn,
          leadId: insertedLead?.id,
        }
      }).catch(err => console.error('Service request notification failed:', err));

      setIsSubmitted(true);
      toast({
        title: isHot ? "Emergency Service Request Submitted!" : "Service Request Submitted!",
        description: isHot 
          ? "Our team will contact you immediately."
          : "Our team will contact you within 24 hours.",
      });

      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting service request:", error);
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
      <div className="bg-card border border-border rounded-xl p-6 text-center py-12">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Request Submitted!</h3>
        <p className="text-muted-foreground">
          {selectedUrgency === "emergency" 
            ? "Our team is being notified immediately and will contact you ASAP."
            : "We'll be in touch within 24 hours to discuss your service needs."}
        </p>
      </div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <div className={cn("bg-card border border-border rounded-xl", isCompact ? "p-4" : "p-6")}>
      {!isCompact && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Request {serviceType}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Fill out the form and our service team will contact you promptly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sr-name">Full Name *</Label>
            <Input
              id="sr-name"
              placeholder="John Smith"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sr-email">Email Address *</Label>
            <Input
              id="sr-email"
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
            <Label htmlFor="sr-phone">Phone Number</Label>
            <Input
              id="sr-phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sr-company">Company/Facility</Label>
            <Input
              id="sr-company"
              placeholder="Memorial Hospital"
              {...register("company")}
            />
          </div>
        </div>

        {/* Equipment Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sr-equipment">Equipment Type *</Label>
            <Select
              value={selectedEquipment}
              onValueChange={(value) => setValue("equipmentType", value)}
            >
              <SelectTrigger className={errors.equipmentType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.equipmentType && (
              <p className="text-xs text-destructive">{errors.equipmentType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sr-manufacturer">Manufacturer</Label>
            <Input
              id="sr-manufacturer"
              placeholder="e.g., GE, Siemens"
              {...register("manufacturer")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sr-model">Model</Label>
            <Input
              id="sr-model"
              placeholder="e.g., Signa HDxt"
              {...register("model")}
            />
          </div>
        </div>

        {/* Urgency Selection */}
        <div className="space-y-2">
          <Label>Service Urgency *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("urgency", option.value as "normal" | "urgent" | "emergency")}
                className={cn(
                  "p-3 rounded-lg border-2 text-left transition-all",
                  selectedUrgency === option.value
                    ? option.value === "emergency"
                      ? "border-destructive bg-destructive/10"
                      : option.value === "urgent"
                      ? "border-warning bg-warning/10"
                      : "border-success bg-success/10"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  {option.value === "emergency" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  <span className={cn("font-medium", option.color)}>{option.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Date */}
        <div className="space-y-2">
          <Label htmlFor="sr-date">Preferred Service Date (Optional)</Label>
          <Input
            id="sr-date"
            type="date"
            {...register("preferredDate")}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Issue Description */}
        <div className="space-y-2">
          <Label htmlFor="sr-description">Describe Your Service Needs *</Label>
          <Textarea
            id="sr-description"
            placeholder="Please describe the issue or service you need, including any error codes, symptoms, or specific requirements..."
            rows={4}
            {...register("issueDescription")}
            className={errors.issueDescription ? "border-destructive" : ""}
          />
          {errors.issueDescription && (
            <p className="text-xs text-destructive">{errors.issueDescription.message}</p>
          )}
        </div>

        {/* Communication Preferences */}
        <div className="space-y-3 pt-2 border-t border-border">
          <Label className="text-sm font-medium">Communication Preferences</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="sr-email-opt-in" 
                checked={emailOptIn}
                onCheckedChange={(checked) => setValue("emailOptIn", !!checked)}
              />
              <Label htmlFor="sr-email-opt-in" className="text-sm font-normal cursor-pointer">
                I agree to receive emails about my service request
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="sr-sms-opt-in" 
                checked={smsOptIn}
                onCheckedChange={(checked) => setValue("smsOptIn", !!checked)}
              />
              <Label htmlFor="sr-sms-opt-in" className="text-sm font-normal cursor-pointer">
                I agree to receive SMS updates (recommended for urgent requests)
              </Label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full",
            selectedUrgency === "emergency" && "bg-destructive hover:bg-destructive/90"
          )}
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : selectedUrgency === "emergency" ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Submit Emergency Request
            </>
          ) : (
            "Submit Service Request"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, you agree to our{" "}
          <Link to="/privacy-policy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          . We never sell your data and only contact you about your inquiry.
        </p>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
