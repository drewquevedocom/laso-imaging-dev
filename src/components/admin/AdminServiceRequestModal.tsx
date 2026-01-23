import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const serviceRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  equipmentType: z.string().min(1, "Please select equipment type"),
  urgency: z.enum(["normal", "urgent", "emergency"]).default("normal"),
  issueDescription: z.string().min(10, "Please describe the service needs"),
});

type ServiceRequestData = z.infer<typeof serviceRequestSchema>;

interface AdminServiceRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const serviceTypes = [
  "Preventive Maintenance",
  "Installation Services",
  "Helium Refills",
  "Cryogenic Services",
  "Training & Education",
  "Consulting",
  "Parts & Repairs",
  "Deinstallation",
  "Rigging & Transport",
  "Other",
];

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
  { value: "normal", label: "Normal", description: "5-7 days" },
  { value: "urgent", label: "Urgent", description: "24-48 hours" },
  { value: "emergency", label: "Emergency", description: "ASAP" },
];

const AdminServiceRequestModal = ({ open, onOpenChange }: AdminServiceRequestModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

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
    },
  });

  const selectedUrgency = watch("urgency");
  const selectedService = watch("serviceType");
  const selectedEquipment = watch("equipmentType");

  const onSubmit = async (data: ServiceRequestData) => {
    setIsSubmitting(true);
    
    try {
      const urgencyScores = { normal: 25, urgent: 50, emergency: 75 };
      const leadScore = urgencyScores[data.urgency];
      const isHot = data.urgency === "emergency";

      const message = [
        `Service Type: ${data.serviceType}`,
        `Equipment: ${data.equipmentType}`,
        `Urgency: ${data.urgency.toUpperCase()}`,
        `\nDetails:\n${data.issueDescription}`,
      ].join('\n');

      const { error } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          interest: data.serviceType,
          message: message,
          source_page: "Admin: Service Request",
          urgency: data.urgency === "emergency" ? "Emergency" : data.urgency === "urgent" ? "Urgent" : "Normal",
          lead_score: leadScore,
          is_hot: isHot,
        });

      if (error) throw error;

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["triage-leads"] });
      queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["hot-leads-count"] });

      toast.success(
        isHot ? "Emergency service request created!" : "Service request created!",
        { description: `Lead created for ${data.name}` }
      );

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating service request:", error);
      toast.error("Failed to create service request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-accent" />
            New Service Request
          </DialogTitle>
          <DialogDescription>
            Create a new service request lead for a customer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-sr-name">Customer Name *</Label>
              <Input
                id="admin-sr-name"
                {...register("name")}
                placeholder="John Smith"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-sr-email">Email *</Label>
              <Input
                id="admin-sr-email"
                type="email"
                {...register("email")}
                placeholder="john@hospital.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-sr-phone">Phone</Label>
              <Input id="admin-sr-phone" {...register("phone")} placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-sr-company">Company</Label>
              <Input id="admin-sr-company" {...register("company")} placeholder="ABC Hospital" />
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <Select value={selectedService} onValueChange={(v) => setValue("serviceType", v)}>
                <SelectTrigger className={errors.serviceType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && <p className="text-xs text-destructive">{errors.serviceType.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Equipment Type *</Label>
              <Select value={selectedEquipment} onValueChange={(v) => setValue("equipmentType", v)}>
                <SelectTrigger className={errors.equipmentType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.equipmentType && <p className="text-xs text-destructive">{errors.equipmentType.message}</p>}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label>Urgency *</Label>
            <div className="grid grid-cols-3 gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("urgency", opt.value as "normal" | "urgent" | "emergency")}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all text-sm",
                    selectedUrgency === opt.value
                      ? opt.value === "emergency"
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : opt.value === "urgent"
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-success bg-success/10 text-success"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="font-medium">{opt.label}</span>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="admin-sr-desc">Service Details *</Label>
            <Textarea
              id="admin-sr-desc"
              {...register("issueDescription")}
              placeholder="Describe the issue or service needed..."
              rows={3}
              className={errors.issueDescription ? "border-destructive" : ""}
            />
            {errors.issueDescription && <p className="text-xs text-destructive">{errors.issueDescription.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(selectedUrgency === "emergency" && "bg-destructive hover:bg-destructive/90")}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : selectedUrgency === "emergency" ? (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Create Emergency Request
                </>
              ) : (
                "Create Service Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminServiceRequestModal;
