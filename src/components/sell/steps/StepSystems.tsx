import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Truck, ScanLine, Activity } from "lucide-react";

interface StepSystemsProps {
  data: {
    systems_count: number;
    systems_count_range: string;
    has_mri: boolean;
    has_ct: boolean;
    is_mobile: boolean;
    mobile_units_count: number;
    trailer_included: boolean | null;
    mobile_status: string;
  };
  onChange: (data: Partial<StepSystemsProps['data']>) => void;
}

export function StepSystems({ data, onChange }: StepSystemsProps) {
  const countRanges = ['1', '2-3', '4-10', '10+'];

  const handleCountRangeClick = (range: string) => {
    onChange({ 
      systems_count_range: range,
      systems_count: range === '1' ? 1 : range === '2-3' ? 2 : range === '4-10' ? 4 : 10
    });
  };

  const handleModalityChange = (value: string) => {
    if (value === 'mri') {
      onChange({ has_mri: true, has_ct: false });
    } else if (value === 'ct') {
      onChange({ has_mri: false, has_ct: true });
    } else if (value === 'both') {
      onChange({ has_mri: true, has_ct: true });
    }
  };

  const getModalityValue = () => {
    if (data.has_mri && data.has_ct) return 'both';
    if (data.has_mri) return 'mri';
    if (data.has_ct) return 'ct';
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Systems Count */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">How many systems are you selling?</Label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={1}
            max={100}
            value={data.systems_count}
            onChange={(e) => onChange({ 
              systems_count: parseInt(e.target.value) || 1,
              systems_count_range: e.target.value
            })}
            className="w-24 text-center text-lg font-semibold"
          />
          <div className="flex gap-2">
            {countRanges.map((range) => (
              <Button
                key={range}
                type="button"
                variant={data.systems_count_range === range ? "default" : "outline"}
                size="sm"
                onClick={() => handleCountRangeClick(range)}
                className="min-w-[50px]"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* System Type */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">What type of systems?</Label>
        <ToggleGroup 
          type="single" 
          value={getModalityValue()}
          onValueChange={handleModalityChange}
          className="justify-start gap-3"
        >
          <ToggleGroupItem 
            value="mri" 
            className="flex-col gap-2 h-auto py-4 px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <ScanLine className="h-8 w-8" />
            <span className="font-medium">MRI</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="ct"
            className="flex-col gap-2 h-auto py-4 px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Activity className="h-8 w-8" />
            <span className="font-medium">CT</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="both"
            className="flex-col gap-2 h-auto py-4 px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <div className="flex gap-1">
              <ScanLine className="h-6 w-6" />
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-medium">Both</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Installation Type */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Installation type</Label>
        <ToggleGroup 
          type="single" 
          value={data.is_mobile ? 'mobile' : 'fixed'}
          onValueChange={(value) => onChange({ 
            is_mobile: value === 'mobile',
            mobile_units_count: value === 'mobile' ? (data.mobile_units_count || 1) : 0
          })}
          className="justify-start gap-3"
        >
          <ToggleGroupItem 
            value="fixed"
            className="flex-col gap-2 h-auto py-4 px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Building2 className="h-8 w-8" />
            <span className="font-medium">Fixed (In-building)</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="mobile"
            className="flex-col gap-2 h-auto py-4 px-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Truck className="h-8 w-8" />
            <span className="font-medium">Mobile (Coach/Trailer)</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Mobile Details - Only shown if mobile selected */}
      {data.is_mobile && (
        <div className="space-y-6 p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Mobile Unit Details</h4>
          
          <div className="space-y-3">
            <Label>How many mobile units?</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={data.mobile_units_count || 1}
              onChange={(e) => onChange({ mobile_units_count: parseInt(e.target.value) || 1 })}
              className="w-24"
            />
          </div>

          <div className="space-y-3">
            <Label>Is trailer included?</Label>
            <RadioGroup
              value={data.trailer_included === true ? 'yes' : data.trailer_included === false ? 'no' : ''}
              onValueChange={(value) => onChange({ trailer_included: value === 'yes' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="trailer-yes" />
                <Label htmlFor="trailer-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="trailer-no" />
                <Label htmlFor="trailer-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Mobile unit status</Label>
            <RadioGroup
              value={data.mobile_status || ''}
              onValueChange={(value) => onChange({ mobile_status: value })}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roadworthy" id="status-roadworthy" />
                <Label htmlFor="status-roadworthy" className="cursor-pointer">Roadworthy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="storage" id="status-storage" />
                <Label htmlFor="status-storage" className="cursor-pointer">In Storage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on-site-only" id="status-onsite" />
                <Label htmlFor="status-onsite" className="cursor-pointer">On-Site Only</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
}
