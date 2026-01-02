import { QuoteWizardData } from "../QuoteWizard";
import { Button } from "@/components/ui/button";
import { Pencil, Shield, Clock, Phone } from "lucide-react";

interface StepReviewProps {
  data: QuoteWizardData;
  onEdit: (step: number) => void;
}

const StepReview = ({ data, onEdit }: StepReviewProps) => {
  const sections = [
    {
      step: 1,
      title: "Equipment Selection",
      items: [
        { label: "Equipment Type", value: data.equipmentType },
        { label: "Specific Model", value: data.specificModel || "Not specified" },
      ],
    },
    {
      step: 2,
      title: "Requirements",
      items: [
        { label: "Facility Type", value: formatValue(data.facilityType) },
        { label: "Patient Volume", value: formatValue(data.patientVolume) || "Not specified" },
        { label: "Timeline", value: formatValue(data.timeline) },
        { label: "Budget Range", value: formatValue(data.budgetRange) || "Not specified" },
        { label: "Additional Requirements", value: data.additionalRequirements || "None" },
      ],
    },
    {
      step: 3,
      title: "Contact Information",
      items: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone || "Not provided" },
        { label: "Company", value: data.company || "Not provided" },
        { label: "Role", value: formatValue(data.role) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Review Your Quote Request
        </h2>
        <p className="text-muted-foreground mt-2">
          Please verify your information before submitting
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.step}
            className="border border-border rounded-lg overflow-hidden"
          >
            <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(section.step)}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-success/10 rounded-full">
            <Clock className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">24-Hour Response</p>
            <p className="text-xs text-muted-foreground">Guaranteed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-success/10 rounded-full">
            <Shield className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No Obligation</p>
            <p className="text-xs text-muted-foreground">Free quote</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-success/10 rounded-full">
            <Phone className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Expert Support</p>
            <p className="text-xs text-muted-foreground">1-855-254-5363</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatValue(value: string): string {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default StepReview;
