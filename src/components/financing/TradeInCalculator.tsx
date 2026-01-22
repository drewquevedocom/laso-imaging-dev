import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { trackTradeInCalculation, trackTradeInQuoteRequested } from '@/lib/posthog';

interface TradeInData {
  equipmentType: string;
  manufacturer: string;
  model: string;
  year: string;
  condition: string;
  operatingStatus: string;
  hasServiceHistory: boolean;
  estimatedLow: number;
  estimatedHigh: number;
}

interface TradeInCalculatorProps {
  onGetQuote?: (data: TradeInData) => void;
}

const equipmentTypes = [
  { value: 'mri-3t', label: 'MRI 3.0T', baseValue: 800000 },
  { value: 'mri-15t', label: 'MRI 1.5T', baseValue: 400000 },
  { value: 'ct-scanner', label: 'CT Scanner', baseValue: 350000 },
  { value: 'mobile-mri', label: 'Mobile MRI', baseValue: 600000 },
  { value: 'mobile-ct', label: 'Mobile CT', baseValue: 400000 },
  { value: 'xray', label: 'X-Ray System', baseValue: 75000 },
  { value: 'pet-ct', label: 'PET/CT Scanner', baseValue: 900000 },
];

const manufacturers = [
  { value: 'ge', label: 'GE Healthcare', multiplier: 1.1 },
  { value: 'siemens', label: 'Siemens Healthineers', multiplier: 1.1 },
  { value: 'philips', label: 'Philips', multiplier: 1.0 },
  { value: 'canon', label: 'Canon / Toshiba', multiplier: 0.95 },
  { value: 'hitachi', label: 'Hitachi', multiplier: 0.9 },
  { value: 'other', label: 'Other', multiplier: 0.8 },
];

const conditions = [
  { value: 'excellent', label: 'Excellent', multiplier: 1.0, description: 'Like new, minimal use' },
  { value: 'good', label: 'Good', multiplier: 0.85, description: 'Normal wear, fully operational' },
  { value: 'fair', label: 'Fair', multiplier: 0.65, description: 'Some issues, may need repairs' },
  { value: 'poor', label: 'Poor', multiplier: 0.4, description: 'Significant issues, needs work' },
  { value: 'non-op', label: 'Non-Operational', multiplier: 0.15, description: 'Parts value only' },
];

const operatingStatuses = [
  { value: 'clinical', label: 'Currently in Clinical Use', multiplier: 1.0 },
  { value: 'decommissioned', label: 'Decommissioned', multiplier: 0.9 },
  { value: 'never-installed', label: 'Never Installed', multiplier: 1.15 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

const calculateDepreciation = (age: number): number => {
  let remaining = 1.0;
  
  for (let year = 1; year <= age; year++) {
    if (year <= 2) {
      remaining *= 0.8; // 20% depreciation years 1-2
    } else if (year <= 5) {
      remaining *= 0.85; // 15% depreciation years 3-5
    } else if (year <= 10) {
      remaining *= 0.9; // 10% depreciation years 6-10
    } else {
      remaining *= 0.95; // 5% depreciation years 10+
    }
  }
  
  // Floor at 15% of original value
  return Math.max(remaining, 0.15);
};

const TradeInCalculator = ({ onGetQuote }: TradeInCalculatorProps) => {
  const [equipmentType, setEquipmentType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [operatingStatus, setOperatingStatus] = useState('');
  const [hasServiceHistory, setHasServiceHistory] = useState(false);
  const hasTrackedEstimate = useRef(false);

  const estimate = useMemo(() => {
    if (!equipmentType || !manufacturer || !year || !condition) {
      return null;
    }

    const equipment = equipmentTypes.find(e => e.value === equipmentType);
    const mfr = manufacturers.find(m => m.value === manufacturer);
    const cond = conditions.find(c => c.value === condition);
    const status = operatingStatuses.find(s => s.value === operatingStatus);

    if (!equipment || !mfr || !cond) return null;

    const age = currentYear - parseInt(year);
    const baseValue = equipment.baseValue;
    const depreciation = calculateDepreciation(age);
    const serviceBonus = hasServiceHistory ? 1.1 : 1.0;
    const statusMultiplier = status?.multiplier || 1.0;

    const calculatedValue = baseValue * depreciation * mfr.multiplier * cond.multiplier * statusMultiplier * serviceBonus;

    // Provide a 30% range
    const low = Math.round(calculatedValue * 0.85);
    const high = Math.round(calculatedValue * 1.15);

    return { low, high };
  }, [equipmentType, manufacturer, year, condition, operatingStatus, hasServiceHistory]);

  // Track when estimate is calculated (only once per unique calculation)
  useEffect(() => {
    if (estimate && equipmentType && manufacturer && !hasTrackedEstimate.current) {
      const equipment = equipmentTypes.find(e => e.value === equipmentType);
      const mfr = manufacturers.find(m => m.value === manufacturer);
      const cond = conditions.find(c => c.value === condition);
      
      trackTradeInCalculation({
        equipmentType: equipment?.label || equipmentType,
        manufacturer: mfr?.label || manufacturer,
        year,
        condition: cond?.label || condition,
        estimatedLow: estimate.low,
        estimatedHigh: estimate.high,
      });
      
      hasTrackedEstimate.current = true;
    }
  }, [estimate, equipmentType, manufacturer, year, condition]);
  
  // Reset tracking when form changes significantly
  useEffect(() => {
    hasTrackedEstimate.current = false;
  }, [equipmentType, manufacturer, year, condition]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleGetQuote = () => {
    if (!estimate) return;

    const equipment = equipmentTypes.find(e => e.value === equipmentType);
    const mfr = manufacturers.find(m => m.value === manufacturer);
    const cond = conditions.find(c => c.value === condition);
    const status = operatingStatuses.find(s => s.value === operatingStatus);

    // Track quote request
    trackTradeInQuoteRequested({
      equipmentType: equipment?.label || '',
      manufacturer: mfr?.label || '',
      estimatedValue: (estimate.low + estimate.high) / 2,
    });

    onGetQuote?.({
      equipmentType: equipment?.label || '',
      manufacturer: mfr?.label || '',
      model,
      year,
      condition: cond?.label || '',
      operatingStatus: status?.label || '',
      hasServiceHistory,
      estimatedLow: estimate.low,
      estimatedHigh: estimate.high,
    });

    // Scroll to financing form
    document.getElementById('financing-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filledFields = [equipmentType, manufacturer, year, condition].filter(Boolean).length;
  const confidence = filledFields === 4 ? (operatingStatus && hasServiceHistory ? 'High' : 'Medium') : 'Low';

  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Calculator className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Trade-In Value Calculator</CardTitle>
            <p className="text-sm text-muted-foreground">Get an instant estimate for your current equipment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Equipment Type *</Label>
            <Select value={equipmentType} onValueChange={setEquipmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Manufacturer *</Label>
            <Select value={manufacturer} onValueChange={setManufacturer}>
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map(mfr => (
                  <SelectItem key={mfr.value} value={mfr.value}>
                    {mfr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model (Optional)</Label>
            <Input
              placeholder="e.g., Signa HDxt, Optima CT660"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Year Manufactured *</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
                <SelectItem value="2004">Before 2005</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Condition *</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(cond => (
                  <SelectItem key={cond.value} value={cond.value}>
                    <div className="flex flex-col">
                      <span>{cond.label}</span>
                      <span className="text-xs text-muted-foreground">{cond.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Operating Status</Label>
            <Select value={operatingStatus} onValueChange={setOperatingStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {operatingStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Checkbox
            id="serviceHistory"
            checked={hasServiceHistory}
            onCheckedChange={(checked) => setHasServiceHistory(checked as boolean)}
          />
          <Label htmlFor="serviceHistory" className="cursor-pointer text-sm">
            Equipment has documented service history (+10% value)
          </Label>
        </div>

        {estimate && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">Estimated Trade-In Value</span>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                {confidence} Confidence
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-accent">
              {formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on: {year} {manufacturers.find(m => m.value === manufacturer)?.label}{' '}
              {equipmentTypes.find(e => e.value === equipmentType)?.label} in{' '}
              {conditions.find(c => c.value === condition)?.label} condition
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            Estimates are approximate and subject to physical inspection. Market conditions, 
            specific model features, and software versions may affect final valuation.
          </p>
        </div>

        <Button
          variant="cta"
          size="lg"
          className="w-full"
          onClick={handleGetQuote}
          disabled={!estimate}
        >
          Get Exact Trade-In Quote
        </Button>
      </CardContent>
    </Card>
  );
};

export default TradeInCalculator;
