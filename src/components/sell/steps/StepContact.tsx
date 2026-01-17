import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building, Phone, Mail, Briefcase } from "lucide-react";

interface StepContactProps {
  data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    facility_type: string;
    seller_role: string;
    message: string;
    email_opt_in: boolean;
    sms_opt_in: boolean;
  };
  onChange: (data: Partial<StepContactProps['data']>) => void;
}

const FACILITY_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'imaging-center', label: 'Imaging Center' },
  { value: 'private-practice', label: 'Private Practice' },
  { value: 'broker', label: 'Broker/Dealer' },
  { value: 'other', label: 'Other' },
];

const SELLER_ROLES = [
  { value: 'radiology-director', label: 'Radiology Director' },
  { value: 'administrator', label: 'Practice Administrator' },
  { value: 'owner', label: 'Owner' },
  { value: 'biomedical', label: 'Biomedical Engineer' },
  { value: 'broker', label: 'Broker/Dealer' },
  { value: 'other', label: 'Other' },
];

export function StepContact({ data, onChange }: StepContactProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pb-4">
        <h3 className="text-lg font-semibold">Almost done! How can we reach you?</h3>
        <p className="text-muted-foreground text-sm">
          We'll be in touch within 24 hours with a preliminary assessment.
        </p>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              value={data.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Business Email *
            </Label>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
            <p className="text-xs text-muted-foreground">Strongly recommended for faster response</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Facility/Company Name *
            </Label>
            <Input
              value={data.company || ''}
              onChange={(e) => onChange({ company: e.target.value })}
              placeholder="Your organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Facility Type</Label>
            <Select value={data.facility_type || ''} onValueChange={(value) => onChange({ facility_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                {FACILITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Your Role
            </Label>
            <Select value={data.seller_role || ''} onValueChange={(value) => onChange({ seller_role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {SELLER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label>Anything else we should know?</Label>
        <Textarea
          value={data.message || ''}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="e.g., lease ending soon, upgrading to 3T, closing location, need quick turnaround..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Share what you know, we'll handle the rest.
        </p>
      </div>

      {/* Communication Preferences */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-sm">Communication Preferences</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="email-opt-in"
              checked={data.email_opt_in}
              onCheckedChange={(checked) => onChange({ email_opt_in: !!checked })}
            />
            <div className="space-y-1">
              <Label htmlFor="email-opt-in" className="cursor-pointer font-normal">
                Email updates about my sell request
              </Label>
              <p className="text-xs text-muted-foreground">
                We'll keep you updated on market conditions and buyer interest
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="sms-opt-in"
              checked={data.sms_opt_in}
              onCheckedChange={(checked) => onChange({ sms_opt_in: !!checked })}
            />
            <div className="space-y-1">
              <Label htmlFor="sms-opt-in" className="cursor-pointer font-normal">
                SMS notifications for urgent updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive text messages for time-sensitive opportunities
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t">
          We never sell your data. View our{" "}
          <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
