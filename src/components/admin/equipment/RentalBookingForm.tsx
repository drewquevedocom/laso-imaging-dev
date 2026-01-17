import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { format, differenceInDays, differenceInWeeks, differenceInMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useRentableInventory, useCreateRental } from "@/hooks/useEquipmentRentals";
import { EquipmentRental, InventoryItem } from "@/types/database";

interface RentalBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedEquipment?: InventoryItem | null;
  preselectedDates?: { start: Date; end: Date } | null;
}

export function RentalBookingForm({ 
  open, 
  onOpenChange, 
  preselectedEquipment,
  preselectedDates 
}: RentalBookingFormProps) {
  const { data: rentableInventory = [] } = useRentableInventory();
  const createRental = useCreateRental();

  const [formData, setFormData] = useState({
    inventory_id: "",
    customer_name: "",
    customer_email: "",
    customer_company: "",
    customer_phone: "",
    delivery_address: "",
    delivery_notes: "",
    notes: "",
  });

  const [startDate, setStartDate] = useState<Date | undefined>(preselectedDates?.start);
  const [endDate, setEndDate] = useState<Date | undefined>(preselectedDates?.end);
  const [rateType, setRateType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (preselectedEquipment) {
      setFormData(prev => ({ ...prev, inventory_id: preselectedEquipment.id }));
    }
    if (preselectedDates) {
      setStartDate(preselectedDates.start);
      setEndDate(preselectedDates.end);
    }
  }, [preselectedEquipment, preselectedDates]);

  const selectedEquipment = rentableInventory.find((item: any) => item.id === formData.inventory_id);

  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedEquipment) return 0;

    const days = differenceInDays(endDate, startDate) + 1;
    const weeks = differenceInWeeks(endDate, startDate) + 1;
    const months = differenceInMonths(endDate, startDate) + 1;

    switch (rateType) {
      case "daily":
        return (selectedEquipment.rental_daily_rate || 0) * days;
      case "weekly":
        return (selectedEquipment.rental_weekly_rate || 0) * weeks;
      case "monthly":
        return (selectedEquipment.rental_monthly_rate || 0) * months;
      default:
        return 0;
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !formData.inventory_id || !formData.customer_name || !formData.customer_email) {
      return;
    }

    const rentalData = {
      inventory_id: formData.inventory_id,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_company: formData.customer_company || undefined,
      customer_phone: formData.customer_phone || undefined,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      daily_rate: rateType === "daily" ? selectedEquipment?.rental_daily_rate : undefined,
      weekly_rate: rateType === "weekly" ? selectedEquipment?.rental_weekly_rate : undefined,
      monthly_rate: rateType === "monthly" ? selectedEquipment?.rental_monthly_rate : undefined,
      total_amount: calculateTotal(),
      deposit_amount: depositAmount ? parseFloat(depositAmount) : undefined,
      delivery_address: formData.delivery_address || undefined,
      delivery_notes: formData.delivery_notes || undefined,
      notes: formData.notes || undefined,
      status: "pending" as const,
      pickup_reminder_sent: false,
      return_reminder_sent: false,
    };

    await createRental.mutateAsync(rentalData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      inventory_id: "",
      customer_name: "",
      customer_email: "",
      customer_company: "",
      customer_phone: "",
      delivery_address: "",
      delivery_notes: "",
      notes: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setRateType("daily");
    setDepositAmount("");
  };

  const totalAmount = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Rental Booking</DialogTitle>
          <DialogDescription>
            Create a new equipment rental reservation
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label>Equipment *</Label>
            <Select 
              value={formData.inventory_id} 
              onValueChange={(v) => setFormData({ ...formData, inventory_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {rentableInventory.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.product_name} ({item.oem} - {item.modality})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Rate Type */}
          {selectedEquipment && (
            <div className="space-y-2">
              <Label>Rate Type</Label>
              <RadioGroup value={rateType} onValueChange={(v) => setRateType(v as any)}>
                <div className="flex gap-4">
                  {selectedEquipment.rental_daily_rate && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="font-normal">
                        Daily (${selectedEquipment.rental_daily_rate?.toLocaleString()}/day)
                      </Label>
                    </div>
                  )}
                  {selectedEquipment.rental_weekly_rate && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="font-normal">
                        Weekly (${selectedEquipment.rental_weekly_rate?.toLocaleString()}/week)
                      </Label>
                    </div>
                  )}
                  {selectedEquipment.rental_monthly_rate && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="font-normal">
                        Monthly (${selectedEquipment.rental_monthly_rate?.toLocaleString()}/month)
                      </Label>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">Customer Email *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="john@hospital.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_company">Company</Label>
              <Input
                id="customer_company"
                value={formData.customer_company}
                onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                placeholder="City Hospital"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Deposit */}
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit Amount</Label>
            <Input
              id="deposit"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="delivery_address">Delivery Address</Label>
            <Textarea
              id="delivery_address"
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              placeholder="123 Hospital Drive, Chicago, IL 60601"
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          {/* Total Calculation */}
          {totalAmount > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              {startDate && endDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  {differenceInDays(endDate, startDate) + 1} days • {rateType} rate
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.inventory_id || !formData.customer_name || !formData.customer_email || !startDate || !endDate || createRental.isPending}
          >
            {createRental.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
