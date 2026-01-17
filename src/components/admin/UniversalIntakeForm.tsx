import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

const SERVICE_TYPES = [
  "Mobile MRI Rental",
  "Mobile CT Rental",
  "Coil Repair",
  "Equipment Sale",
  "Equipment Purchase",
  "Helium Fill",
  "De-installation",
  "Installation",
  "Maintenance",
  "Parts Request",
  "Cryogenic Service",
  "Other",
];

const formSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  clinic: z.string().min(1, "Clinic name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  services: z.array(z.object({
    type: z.string().min(1, "Service type is required"),
    details: z.string().optional(),
  })).min(1, "At least one service is required"),
  isEmergency: z.boolean().default(false),
  sameDayShipping: z.boolean().default(false),
  expeditedFee: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UniversalIntakeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UniversalIntakeForm = ({ open, onOpenChange }: UniversalIntakeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorName: "",
      clinic: "",
      email: "",
      phone: "",
      services: [{ type: "", details: "" }],
      isEmergency: false,
      sameDayShipping: false,
      expeditedFee: false,
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const isEmergency = form.watch("isEmergency");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Determine primary interest from services
      const primaryService = data.services[0]?.type || "General Inquiry";
      const allServices = data.services.map(s => s.type).join(", ");
      
      // Build message with service details
      const serviceDetails = data.services
        .filter(s => s.details)
        .map(s => `${s.type}: ${s.details}`)
        .join("\n");
      
      const emergencyInfo = data.isEmergency 
        ? `\n\n🚨 EMERGENCY REQUEST\n• Same Day Shipping: ${data.sameDayShipping ? "Yes" : "No"}\n• Expedited Fee Accepted: ${data.expeditedFee ? "Yes" : "No"}`
        : "";
      
      const fullMessage = `Services Requested: ${allServices}\n\n${serviceDetails}${emergencyInfo}${data.notes ? `\n\nAdditional Notes: ${data.notes}` : ""}`;

      // Insert into leads table
      const { error } = await supabase.from("leads").insert({
        name: data.doctorName,
        company: data.clinic,
        email: data.email,
        phone: data.phone || null,
        interest: primaryService.includes("Mobile") ? "Mobile MRI" : 
                  primaryService.includes("Service") || primaryService.includes("Repair") || primaryService.includes("Maintenance") ? "Service" : 
                  "Equipment Sale",
        message: fullMessage,
        source_page: "Admin Universal Intake",
        status: "new",
        is_hot: data.isEmergency,
        lead_score: data.isEmergency ? 75 : 25,
      });

      if (error) throw error;

      toast.success("Inquiry submitted successfully!", {
        description: data.isEmergency ? "🚨 Marked as emergency - high priority" : undefined,
      });
      
      // Invalidate queries to refresh the board
      queryClient.invalidateQueries({ queryKey: ["triage-leads"] });
      queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isEmergency ? "animate-emergency-pulse border-red-500/50" : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isEmergency && <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />}
            New Inquiry
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Emergency Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              isEmergency 
                ? "border-red-500 bg-red-500/10" 
                : "border-muted bg-muted/30"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="font-semibold">EMERGENCY REQUEST</p>
                  <p className="text-sm text-muted-foreground">Mark as urgent priority</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="isEmergency"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-red-500"
                  />
                )}
              />
            </div>

            {/* Emergency Options */}
            {isEmergency && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <FormField
                  control={form.control}
                  name="sameDayShipping"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="sameDayShipping"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="sameDayShipping" className="text-sm font-medium cursor-pointer">
                        Same Day Shipping Required
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expeditedFee"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="expeditedFee"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="expeditedFee" className="text-sm font-medium cursor-pointer">
                        Expedited Fee (+15%) Accepted
                      </label>
                    </div>
                  )}
                />
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clinic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic / Facility *</FormLabel>
                    <FormControl>
                      <Input placeholder="Memorial Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="doctor@clinic.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Service Requests *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ type: "", details: "" })}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`services.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.details`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Additional details..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other relevant information..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEmergency ? "🚨 Submit Emergency" : "Submit Inquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalIntakeForm;
