import { QuoteWizardData } from "../QuoteWizard";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepDetailsProps {
  data: QuoteWizardData;
  updateData: (data: Partial<QuoteWizardData>) => void;
}

const facilityTypes = [
  { value: "hospital", label: "Hospital / Health System" },
  { value: "imaging-center", label: "Imaging Center" },
  { value: "clinic", label: "Clinic / Physician Office" },
  { value: "university", label: "University / Research" },
  { value: "veterinary", label: "Veterinary" },
  { value: "mobile-provider", label: "Mobile Imaging Provider" },
  { value: "reseller", label: "Equipment Reseller" },
  { value: "other", label: "Other" },
];

const patientVolumes = [
  { value: "under-10", label: "Under 10 scans/day" },
  { value: "10-25", label: "10-25 scans/day" },
  { value: "25-50", label: "25-50 scans/day" },
  { value: "50-100", label: "50-100 scans/day" },
  { value: "over-100", label: "Over 100 scans/day" },
  { value: "not-sure", label: "Not sure yet" },
];

const timelines = [
  { value: "asap", label: "ASAP - Urgent need" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-12-months", label: "6-12 months" },
  { value: "planning", label: "Just planning / researching" },
];

const budgetRanges = [
  { value: "under-100k", label: "Under $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "250k-500k", label: "$250,000 - $500,000" },
  { value: "500k-1m", label: "$500,000 - $1,000,000" },
  { value: "over-1m", label: "Over $1,000,000" },
  { value: "not-sure", label: "Not sure / Need guidance" },
];

const StepDetails = ({ data, updateData }: StepDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Tell us about your requirements
        </h2>
        <p className="text-muted-foreground mt-2">
          This helps us provide an accurate quote for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="facilityType">Facility Type *</Label>
          <Select
            value={data.facilityType}
            onValueChange={(value) => updateData({ facilityType: value })}
          >
            <SelectTrigger id="facilityType">
              <SelectValue placeholder="Select facility type" />
            </SelectTrigger>
            <SelectContent>
              {facilityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientVolume">Expected Patient Volume</Label>
          <Select
            value={data.patientVolume}
            onValueChange={(value) => updateData({ patientVolume: value })}
          >
            <SelectTrigger id="patientVolume">
              <SelectValue placeholder="Select volume" />
            </SelectTrigger>
            <SelectContent>
              {patientVolumes.map((volume) => (
                <SelectItem key={volume.value} value={volume.value}>
                  {volume.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Purchase Timeline *</Label>
          <Select
            value={data.timeline}
            onValueChange={(value) => updateData({ timeline: value })}
          >
            <SelectTrigger id="timeline">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map((timeline) => (
                <SelectItem key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Select
            value={data.budgetRange}
            onValueChange={(value) => updateData({ budgetRange: value })}
          >
            <SelectTrigger id="budgetRange">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((budget) => (
                <SelectItem key={budget.value} value={budget.value}>
                  {budget.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalRequirements">
          Additional Requirements (optional)
        </Label>
        <Textarea
          id="additionalRequirements"
          value={data.additionalRequirements || ""}
          onChange={(e) =>
            updateData({ additionalRequirements: e.target.value })
          }
          placeholder="Any specific features, space constraints, or other requirements..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default StepDetails;
