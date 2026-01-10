import { QuoteWizardData } from "../QuoteWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Monitor, 
  Scan, 
  Radio, 
  Truck, 
  Settings, 
  Wrench,
  Zap,
  CircleDot
} from "lucide-react";

interface StepEquipmentProps {
  data: QuoteWizardData;
  updateData: (data: Partial<QuoteWizardData>) => void;
}

const equipmentOptions = [
  {
    id: "1.5T MRI",
    label: "1.5T MRI Systems",
    description: "Standard clinical MRI scanners",
    icon: Monitor,
  },
  {
    id: "3T MRI",
    label: "3.0T MRI Systems",
    description: "High-field research & clinical",
    icon: Zap,
  },
  {
    id: "Mobile MRI",
    label: "Mobile MRI, CT Units",
    description: "Trailer-mounted systems",
    icon: Truck,
  },
  {
    id: "CT Systems",
    label: "CT Scanners",
    description: "Multi-slice CT systems",
    icon: Scan,
  },
  {
    id: "X-Ray",
    label: "X-Ray Systems",
    description: "Digital radiography",
    icon: Radio,
  },
  {
    id: "PET/CT",
    label: "PET/CT Systems",
    description: "Nuclear medicine imaging",
    icon: CircleDot,
  },
  {
    id: "Parts",
    label: "Parts & Components",
    description: "Replacement parts",
    icon: Settings,
  },
  {
    id: "Service",
    label: "Service & Maintenance",
    description: "Repair and maintenance",
    icon: Wrench,
  },
];

const StepEquipment = ({ data, updateData }: StepEquipmentProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          What equipment are you interested in?
        </h2>
        <p className="text-muted-foreground mt-2">
          Select the type of medical imaging equipment you're looking for
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {equipmentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.equipmentType === option.id;
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => updateData({ equipmentType: option.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                {option.label}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {data.equipmentType && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <Label htmlFor="specificModel" className="text-sm font-medium">
            Specific model or manufacturer (optional)
          </Label>
          <Input
            id="specificModel"
            value={data.specificModel || ""}
            onChange={(e) => updateData({ specificModel: e.target.value })}
            placeholder="e.g., GE Signa HDxt, Siemens Avanto"
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default StepEquipment;
