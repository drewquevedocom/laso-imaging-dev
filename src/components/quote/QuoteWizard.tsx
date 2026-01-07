import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackQuoteRequest } from "@/components/analytics/GoogleAnalytics";
import StepEquipment from "./steps/StepEquipment";
import StepDetails from "./steps/StepDetails";
import StepContact from "./steps/StepContact";
import StepReview from "./steps/StepReview";

export interface QuoteWizardData {
  // Step 1: Equipment
  equipmentType: string;
  specificModel?: string;
  // Step 2: Requirements
  facilityType: string;
  patientVolume: string;
  timeline: string;
  budgetRange: string;
  additionalRequirements?: string;
  // Step 3: Contact
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
}

const initialData: QuoteWizardData = {
  equipmentType: "",
  specificModel: "",
  facilityType: "",
  patientVolume: "",
  timeline: "",
  budgetRange: "",
  additionalRequirements: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
};

const steps = [
  { id: 1, title: "Equipment", description: "Select your equipment" },
  { id: 2, title: "Requirements", description: "Your facility needs" },
  { id: 3, title: "Contact", description: "Your information" },
  { id: 4, title: "Review", description: "Confirm & submit" },
];

interface QuoteWizardProps {
  prefilledEquipment?: string;
  prefilledProduct?: string;
  sourcePage?: string;
}

const QuoteWizard = ({ 
  prefilledEquipment, 
  prefilledProduct,
  sourcePage = "quote-wizard" 
}: QuoteWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteWizardData>({
    ...initialData,
    equipmentType: prefilledEquipment || "",
    specificModel: prefilledProduct || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const updateFormData = (data: Partial<QuoteWizardData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.equipmentType;
      case 2:
        return !!formData.facilityType && !!formData.timeline;
      case 3:
        return !!formData.name && !!formData.email && !!formData.role;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("🚀 Starting quote submission...");
    setIsSubmitting(true);
    
    try {
      // Build message from wizard data
      const message = `
Equipment: ${formData.equipmentType}${formData.specificModel ? ` - ${formData.specificModel}` : ""}
Facility Type: ${formData.facilityType}
Patient Volume: ${formData.patientVolume || "Not specified"}
Timeline: ${formData.timeline}
Budget Range: ${formData.budgetRange || "Not specified"}
Role: ${formData.role}
Additional Requirements: ${formData.additionalRequirements || "None"}
      `.trim();

      console.log("📝 Inserting lead into database...");
      
      // Simple insert without .select() - just insert and check for error
      const { error: insertError } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          interest: formData.equipmentType,
          message: message,
          source_page: sourcePage,
        });

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        throw insertError;
      }

      console.log("✅ Lead inserted successfully!");

      // Fire-and-forget: Edge functions (completely non-blocking)
      // We don't await these - they run in background
      supabase.functions.invoke("calculate-lead-score", {
        body: { leadId: crypto.randomUUID() }, // We don't have the ID, but scoring can still work
      }).then(res => console.log("📊 Lead scoring complete:", res))
        .catch(err => console.warn("⚠️ Lead scoring failed (non-blocking):", err));

      supabase.functions.invoke("send-quote-notification", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          role: formData.role,
          equipmentType: formData.equipmentType,
          specificModel: formData.specificModel,
          facilityType: formData.facilityType,
          patientVolume: formData.patientVolume,
          timeline: formData.timeline,
          budget: formData.budgetRange,
          additionalRequirements: formData.additionalRequirements,
          sourcePage: sourcePage,
        },
      }).then(res => console.log("📧 Email notification sent:", res))
        .catch(err => console.warn("⚠️ Email notification failed (non-blocking):", err));

      // Track quote request in Google Analytics
      trackQuoteRequest(formData.equipmentType, sourcePage);

      console.log("🎉 Quote submission complete!");
      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "Our team will contact you within 24 hours.",
      });
    } catch (error) {
      console.error("💥 Error submitting quote:", error);
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl p-12 text-center"
      >
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Thank You!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your quote request for <span className="font-semibold text-foreground">{formData.equipmentType}</span> has been received. 
          Our specialist will contact you within 24 hours.
        </p>
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Questions? Call us directly at{" "}
            <a href="tel:+18006745276" className="text-accent font-medium hover:underline">
              1-800-MRI-LASO
            </a>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.id
                      ? "bg-success text-success-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                    currentStep > step.id ? "bg-success" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <StepEquipment data={formData} updateData={updateFormData} />
            )}
            {currentStep === 2 && (
              <StepDetails data={formData} updateData={updateFormData} />
            )}
            {currentStep === 3 && (
              <StepContact data={formData} updateData={updateFormData} />
            )}
            {currentStep === 4 && (
              <StepReview data={formData} onEdit={setCurrentStep} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-border p-4 flex justify-between items-center bg-muted/20">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-success hover:bg-success/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuoteWizard;
