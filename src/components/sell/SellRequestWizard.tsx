import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, ScanLine, FileText, User } from "lucide-react";
import { StepSystems } from "./steps/StepSystems";
import { StepDetails } from "./steps/StepDetails";
import { StepContact } from "./steps/StepContact";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SellRequestWizardProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FormData {
  // Step 1: Systems
  systems_count: number;
  systems_count_range: string;
  has_mri: boolean;
  has_ct: boolean;
  is_mobile: boolean;
  mobile_units_count: number;
  trailer_included: boolean | null;
  mobile_status: string;
  
  // Step 2: Details
  manufacturer: string;
  model: string;
  software_version: string;
  year_manufactured: number | null;
  year_installed: number | null;
  magnet_strength: string;
  equipment_status: string;
  condition: string;
  daily_scan_volume: string;
  country: string;
  state: string;
  city: string;
  timeline: string;
  desired_price: string;
  
  // Step 3: Contact
  name: string;
  email: string;
  phone: string;
  company: string;
  facility_type: string;
  seller_role: string;
  message: string;
  email_opt_in: boolean;
  sms_opt_in: boolean;
}

const initialFormData: FormData = {
  systems_count: 1,
  systems_count_range: '1',
  has_mri: false,
  has_ct: false,
  is_mobile: false,
  mobile_units_count: 0,
  trailer_included: null,
  mobile_status: '',
  manufacturer: '',
  model: '',
  software_version: '',
  year_manufactured: null,
  year_installed: null,
  magnet_strength: '',
  equipment_status: 'clinical',
  condition: '',
  daily_scan_volume: '',
  country: '',
  state: '',
  city: '',
  timeline: '',
  desired_price: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  facility_type: '',
  seller_role: '',
  message: '',
  email_opt_in: true,
  sms_opt_in: false,
};

const STEPS = [
  { id: 1, title: 'Systems', icon: ScanLine, description: 'What are you selling?' },
  { id: 2, title: 'Details', icon: FileText, description: 'Equipment information' },
  { id: 3, title: 'Contact', icon: User, description: 'Your information' },
];

export function SellRequestWizard({ onSuccess, onClose }: SellRequestWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.has_mri || formData.has_ct;
      case 2:
        return !!formData.manufacturer;
      case 3:
        return !!formData.name && !!formData.email && !!formData.company;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error("Please fill in the required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build equipment type string
      const equipmentTypes: string[] = [];
      if (formData.has_mri) equipmentTypes.push('MRI');
      if (formData.has_ct) equipmentTypes.push('CT');
      const equipmentType = equipmentTypes.join(' & ');

      // Build location string for legacy field
      const locationParts = [formData.city, formData.state, formData.country].filter(Boolean);
      const location = locationParts.join(', ');

      const { error } = await supabase.from('equipment_sell_requests').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        equipment_type: equipmentType,
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        software_version: formData.software_version || null,
        year_manufactured: formData.year_manufactured || null,
        condition: formData.condition || null,
        message: formData.message || null,
        timeline: formData.timeline || null,
        location: location || null,
        email_opt_in: formData.email_opt_in,
        sms_opt_in: formData.sms_opt_in,
        // New enhanced fields
        systems_count: formData.systems_count,
        systems_count_range: formData.systems_count_range,
        has_mri: formData.has_mri,
        has_ct: formData.has_ct,
        is_mobile: formData.is_mobile,
        mobile_units_count: formData.is_mobile ? formData.mobile_units_count : null,
        trailer_included: formData.is_mobile ? formData.trailer_included : null,
        mobile_status: formData.is_mobile ? formData.mobile_status : null,
        magnet_strength: formData.has_mri ? formData.magnet_strength : null,
        year_installed: formData.year_installed || null,
        equipment_status: formData.equipment_status || null,
        daily_scan_volume: formData.daily_scan_volume || null,
        country: formData.country || null,
        state: formData.state || null,
        city: formData.city || null,
        desired_price: formData.desired_price || null,
        facility_type: formData.facility_type || null,
        seller_role: formData.seller_role || null,
      });

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke('send-sell-notification', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          equipmentType,
          manufacturer: formData.manufacturer,
          model: formData.model,
          condition: formData.condition,
          timeline: formData.timeline,
          location,
          message: formData.message,
          systemsCount: formData.systems_count,
          isMobile: formData.is_mobile,
          magnetStrength: formData.magnet_strength,
        },
      });

      setIsSubmitted(true);
      toast.success("Your sell request has been submitted successfully!");
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting sell request:', error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest in selling your equipment. Our team will review your submission 
            and contact you within 24 hours with a preliminary assessment.
          </p>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }

  const progress = (currentStep / 3) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="text-center">
          <CardTitle className="text-2xl">Sell Your MRI & CT Systems</CardTitle>
          <p className="text-muted-foreground mt-1">3 quick steps to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="pt-4">
          <div className="flex justify-between mb-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center gap-1 flex-1 ${
                    isActive ? 'text-primary' : isComplete ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-primary text-primary-foreground' : ''}
                    ${isComplete ? 'bg-green-100 text-green-600' : ''}
                    ${!isActive && !isComplete ? 'bg-muted' : ''}
                  `}>
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <StepSystems 
            data={formData} 
            onChange={updateFormData} 
          />
        )}
        
        {currentStep === 2 && (
          <StepDetails 
            data={formData} 
            onChange={updateFormData} 
          />
        )}
        
        {currentStep === 3 && (
          <StepContact 
            data={formData} 
            onChange={updateFormData} 
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
