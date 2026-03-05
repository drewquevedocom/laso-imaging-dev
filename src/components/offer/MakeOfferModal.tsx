import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const offerFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().optional(),
  offerAmount: z.string().min(1, "Offer amount is required"),
  message: z.string().max(1000).optional(),
  emailOptIn: z.boolean().default(true),
  smsOptIn: z.boolean().default(false),
});

type OfferFormData = z.infer<typeof offerFormSchema>;

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice?: string;
}

const MakeOfferModal = ({ isOpen, onClose, productName, productPrice }: MakeOfferModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      offerAmount: "",
      message: "",
      emailOptIn: true,
      smsOptIn: false,
    },
  });

  const emailOptIn = watch("emailOptIn");
  const smsOptIn = watch("smsOptIn");

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);
    try {
      // First, save to leads table
      const { error: leadError } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: null,
        interest: `Offer: ${productName}`,
        message: `Offer Amount: $${data.offerAmount}${data.message ? `\nNotes: ${data.message}` : ""}`,
        source_page: `Product Offer - ${productName}`,
        status: "new",
        email_opt_in: data.emailOptIn,
        sms_opt_in: data.smsOptIn,
      });

      if (leadError) {
        console.error("Error saving lead:", leadError);
        // Continue with email notification even if lead save fails
      }

      // Send email notification (non-blocking)
      supabase.functions.invoke("send-offer-notification", {
        body: {
          productName,
          productPrice,
          name: data.name,
          email: data.email,
          phone: data.phone,
          offerAmount: data.offerAmount,
          message: data.message,
        },
      }).catch(err => console.error('Offer notification email failed:', err));

      setIsSuccess(true);
      toast.success("Your offer has been submitted!");
      reset();
      
      // Close after showing success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Make an Offer
          </DialogTitle>
          <DialogDescription>
            Submit your offer for <span className="font-semibold text-foreground">{productName}</span>
            {productPrice && (
              <span className="block text-sm mt-1">Listed at: {productPrice}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Offer Submitted!</h3>
            <p className="text-muted-foreground text-sm">
              We'll review your offer and get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="John Smith"
                {...register("name")}
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
                placeholder="john@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerAmount">Your Offer Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="offerAmount"
                  placeholder="150,000"
                  {...register("offerAmount")}
                  className={`pl-9 ${errors.offerAmount ? "border-destructive" : ""}`}
                />
              </div>
              {errors.offerAmount && (
                <p className="text-sm text-destructive">{errors.offerAmount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Notes (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any additional details about your offer..."
                rows={3}
                {...register("message")}
              />
            </div>

            {/* Communication Preferences */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-sm font-medium">Communication Preferences</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="email-opt-in" 
                    checked={emailOptIn}
                    onCheckedChange={(checked) => setValue("emailOptIn", !!checked)}
                  />
                  <Label htmlFor="email-opt-in" className="text-xs font-normal cursor-pointer">
                    I agree to receive emails about my offer
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="sms-opt-in" 
                    checked={smsOptIn}
                    onCheckedChange={(checked) => setValue("smsOptIn", !!checked)}
                  />
                  <Label htmlFor="sms-opt-in" className="text-xs font-normal cursor-pointer">
                    I agree to receive SMS updates (optional)
                  </Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                We never sell your data. See our{" "}
                <Link to="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Offer
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
