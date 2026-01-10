import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

const sellFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  equipment_type: z.string().min(1, "Please select equipment type"),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  year_manufactured: z.string().optional(),
  condition: z.string().optional(),
  software_version: z.string().optional(),
  location: z.string().optional(),
  reason_for_selling: z.string().optional(),
  timeline: z.string().optional(),
  has_service_history: z.boolean().default(false),
  message: z.string().optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

const equipmentTypes = [
  "MRI System",
  "CT Scanner",
  "X-Ray System",
  "PET/CT Scanner",
  "Ultrasound",
  "C-Arm",
  "Mobile MRI",
  "Mobile CT",
  "Parts & Components",
  "Other",
];

const manufacturers = [
  "GE Healthcare",
  "Siemens Healthineers",
  "Philips Healthcare",
  "Toshiba/Canon Medical",
  "Hitachi",
  "Other",
];

const conditions = [
  "Operational - Excellent",
  "Operational - Good",
  "Operational - Needs Minor Repair",
  "Non-Operational - Needs Repair",
  "Decommissioned",
];

const timelines = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6+ months",
  "Flexible",
];

const reasons = [
  "Upgrading equipment",
  "Closing facility",
  "Reducing capacity",
  "Replacing with newer model",
  "End of lease",
  "Other",
];

interface SellEquipmentFormProps {
  onSuccess?: () => void;
}

const SellEquipmentForm = ({ onSuccess }: SellEquipmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      has_service_history: false,
    },
  });

  const onSubmit = async (data: SellFormData) => {
    setIsSubmitting(true);
    try {
      // Insert into database
      const { error: dbError } = await supabase
        .from("equipment_sell_requests")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          equipment_type: data.equipment_type,
          manufacturer: data.manufacturer || null,
          model: data.model || null,
          year_manufactured: data.year_manufactured ? parseInt(data.year_manufactured) : null,
          condition: data.condition || null,
          software_version: data.software_version || null,
          location: data.location || null,
          reason_for_selling: data.reason_for_selling || null,
          timeline: data.timeline || null,
          has_service_history: data.has_service_history,
          message: data.message || null,
        });

      if (dbError) throw dbError;

      // Send email notification
      await supabase.functions.invoke("send-sell-notification", {
        body: data,
      });

      setIsSubmitted(true);
      toast.success("Your equipment details have been submitted!");
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting sell request:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Thank You!
        </h3>
        <p className="text-muted-foreground mb-6">
          We've received your equipment details. Our team will review your
          submission and contact you within 24-48 hours with an evaluation.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Smith"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@hospital.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company/Facility</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="ABC Hospital"
            />
          </div>
        </div>
      </div>

      {/* Equipment Details */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Equipment Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="equipment_type">Equipment Type *</Label>
            <Select onValueChange={(value) => setValue("equipment_type", value)}>
              <SelectTrigger className={errors.equipment_type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.equipment_type && (
              <p className="text-sm text-destructive">{errors.equipment_type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Select onValueChange={(value) => setValue("manufacturer", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((mfr) => (
                  <SelectItem key={mfr} value={mfr}>
                    {mfr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model Name/Number</Label>
            <Input
              id="model"
              {...register("model")}
              placeholder="e.g., Signa HDxt 1.5T"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_manufactured">Year Manufactured</Label>
            <Input
              id="year_manufactured"
              type="number"
              {...register("year_manufactured")}
              placeholder="e.g., 2018"
              min="1990"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Current Condition</Label>
            <Select onValueChange={(value) => setValue("condition", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="software_version">Software Version</Label>
            <Input
              id="software_version"
              {...register("software_version")}
              placeholder="e.g., v15.0"
            />
          </div>
        </div>
      </div>

      {/* Location and Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Location & Timeline
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Current Location (City, State)</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., Los Angeles, CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason_for_selling">Reason for Selling</Label>
            <Select onValueChange={(value) => setValue("reason_for_selling", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeline">Preferred Timeline</Label>
            <Select onValueChange={(value) => setValue("timeline", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_service_history"
                checked={watch("has_service_history")}
                onCheckedChange={(checked) =>
                  setValue("has_service_history", checked as boolean)
                }
              />
              <Label htmlFor="has_service_history" className="cursor-pointer">
                Service history documentation available
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="message">Additional Information</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Any additional details about your equipment, recent maintenance, accessories included, etc."
          rows={4}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Equipment for Review"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to our{" "}
        <a href="/privacy-policy" className="underline hover:text-primary">
          Privacy Policy
        </a>
        . We'll contact you within 24-48 hours.
      </p>
    </form>
  );
};

export default SellEquipmentForm;
