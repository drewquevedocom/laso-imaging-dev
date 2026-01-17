import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StepDetailsProps {
  data: {
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
    has_mri: boolean;
  };
  onChange: (data: Partial<StepDetailsProps['data']>) => void;
}

const OEM_OPTIONS = ['GE', 'Siemens', 'Philips', 'Canon/Toshiba', 'Hitachi', 'Other'];
const MAGNET_OPTIONS = ['0.7T', '1.0T', '1.5T', '3.0T', 'Other'];
const STATUS_OPTIONS = [
  { value: 'clinical', label: 'Fully Clinical' },
  { value: 'partially-clinical', label: 'Partially Clinical' },
  { value: 'deinstalled', label: 'De-installed' },
  { value: 'storage', label: 'In Storage' },
];
const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'Needs Repair'];
const VOLUME_OPTIONS = ['Unknown', '5-10/day', '10-20/day', '20-40/day', '40+/day'];
const TIMELINE_OPTIONS = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '1-3 months', label: '1-3 Months' },
  { value: '3-6 months', label: '3-6 Months' },
  { value: '6+ months', label: '6+ Months' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

export function StepDetails({ data, onChange }: StepDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Equipment Basics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Equipment Basics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Manufacturer (OEM) *</Label>
            <Select value={data.manufacturer || ''} onValueChange={(value) => onChange({ manufacturer: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {OEM_OPTIONS.map((oem) => (
                  <SelectItem key={oem} value={oem}>{oem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={data.model || ''}
              onChange={(e) => onChange({ model: e.target.value })}
              placeholder="e.g., Signa HDxt, Optima 660"
            />
          </div>

          <div className="space-y-2">
            <Label>Software Version</Label>
            <Input
              value={data.software_version || ''}
              onChange={(e) => onChange({ software_version: e.target.value })}
              placeholder="e.g., v15.0, Syngo VB20"
            />
          </div>

          <div className="space-y-2">
            <Label>Year Manufactured</Label>
            <Select 
              value={data.year_manufactured?.toString() || ''} 
              onValueChange={(value) => onChange({ year_manufactured: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year Installed</Label>
            <Select 
              value={data.year_installed?.toString() || ''} 
              onValueChange={(value) => onChange({ year_installed: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year (optional)" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.has_mri && (
            <div className="space-y-2">
              <Label>Magnet Strength</Label>
              <Select value={data.magnet_strength || ''} onValueChange={(value) => onChange({ magnet_strength: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strength" />
                </SelectTrigger>
                <SelectContent>
                  {MAGNET_OPTIONS.map((strength) => (
                    <SelectItem key={strength} value={strength}>{strength}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Condition & Status */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Condition & Status</h3>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Current Status</Label>
            <RadioGroup
              value={data.equipment_status || ''}
              onValueChange={(value) => onChange({ equipment_status: value })}
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              {STATUS_OPTIONS.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={status.value} id={`status-${status.value}`} />
                  <Label htmlFor={`status-${status.value}`} className="cursor-pointer text-sm">
                    {status.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Condition</Label>
            <RadioGroup
              value={data.condition || ''}
              onValueChange={(value) => onChange({ condition: value })}
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              {CONDITION_OPTIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <RadioGroupItem value={condition} id={`condition-${condition}`} />
                  <Label htmlFor={`condition-${condition}`} className="cursor-pointer text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Approximate Daily Scan Volume</Label>
            <Select value={data.daily_scan_volume || ''} onValueChange={(value) => onChange({ daily_scan_volume: value })}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_OPTIONS.map((volume) => (
                  <SelectItem key={volume} value={volume}>{volume}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Location & Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Location & Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={data.country || ''} onValueChange={(value) => onChange({ country: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>State/Province</Label>
            <Input
              value={data.state || ''}
              onChange={(e) => onChange({ state: e.target.value })}
              placeholder="e.g., California"
            />
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={data.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g., Los Angeles"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">When are you ready to sell?</Label>
          <div className="flex flex-wrap gap-2">
            {TIMELINE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={data.timeline === option.value ? "default" : "outline"}
                onClick={() => onChange({ timeline: option.value })}
                className="flex-1 min-w-[120px]"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Desired Price (Optional)</Label>
          <Input
            value={data.desired_price || ''}
            onChange={(e) => onChange({ desired_price: e.target.value })}
            placeholder="Your asking price (optional)"
          />
          <p className="text-xs text-muted-foreground">We'll provide a market valuation regardless</p>
        </div>
      </div>
    </div>
  );
}
