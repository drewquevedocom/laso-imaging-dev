import { QuoteWizardData } from "../QuoteWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepContactProps {
  data: QuoteWizardData;
  updateData: (data: Partial<QuoteWizardData>) => void;
}

const roleOptions = [
  { value: "administrator", label: "Administrator / Manager" },
  { value: "physician", label: "Physician / Radiologist" },
  { value: "engineer", label: "Biomedical Engineer" },
  { value: "purchasing", label: "Purchasing / Procurement" },
  { value: "executive", label: "Executive / C-Suite" },
  { value: "reseller", label: "Equipment Reseller" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];

const StepContact = ({ data, updateData }: StepContactProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          How can we reach you?
        </h2>
        <p className="text-muted-foreground mt-2">
          We'll use this information to send your personalized quote
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="john@hospital.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone || ""}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / Hospital</Label>
          <Input
            id="company"
            value={data.company || ""}
            onChange={(e) => updateData({ company: e.target.value })}
            placeholder="Memorial Hospital"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="role">Your Role *</Label>
          <Select
            value={data.role}
            onValueChange={(value) => updateData({ role: value })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Privacy Note:</span>{" "}
          Your information is secure and will only be used to provide your quote. 
          We never share your data with third parties.
        </p>
      </div>
    </div>
  );
};

export default StepContact;
