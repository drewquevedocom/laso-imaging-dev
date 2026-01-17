import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellRequestId?: string;
  leadId?: string;
  defaultData?: {
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    equipmentType?: string;
  };
}

export function ScheduleSiteVisitModal({
  isOpen,
  onClose,
  sellRequestId,
  leadId,
  defaultData,
}: ScheduleSiteVisitModalProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("2");
  const [title, setTitle] = useState(
    defaultData?.equipmentType
      ? `Site Visit - ${defaultData.equipmentType}`
      : "Equipment Inspection"
  );
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(defaultData?.location || "");
  const [locationNotes, setLocationNotes] = useState("");
  const [contactName, setContactName] = useState(defaultData?.contactName || "");
  const [contactPhone, setContactPhone] = useState(defaultData?.contactPhone || "");
  const [contactEmail, setContactEmail] = useState(defaultData?.contactEmail || "");
  const [sendConfirmation, setSendConfirmation] = useState(true);
  const queryClient = useQueryClient();

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error("Please select a date");

      const { data, error } = await supabase
        .from("site_visits")
        .insert({
          sell_request_id: sellRequestId || null,
          lead_id: leadId || null,
          title,
          description,
          scheduled_date: format(date, "yyyy-MM-dd"),
          scheduled_time: time,
          duration_hours: parseInt(duration),
          location_address: location,
          location_notes: locationNotes,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          status: "scheduled",
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email if checkbox is checked
      if (sendConfirmation && contactEmail) {
        await supabase.functions.invoke("send-site-visit-confirmation", {
          body: {
            siteVisitId: data.id,
            recipientEmail: contactEmail,
            recipientName: contactName,
            scheduledDate: format(date, "MMMM d, yyyy"),
            scheduledTime: time,
            duration: duration,
            location: location,
          },
        });
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Site visit scheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to schedule visit: " + error.message);
    },
  });

  const resetForm = () => {
    setDate(undefined);
    setTime("10:00");
    setDuration("2");
    setTitle("Equipment Inspection");
    setDescription("");
    setLocation("");
    setLocationNotes("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setSendConfirmation(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule Site Visit
          </DialogTitle>
          <DialogDescription>
            Schedule an on-site equipment inspection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Visit Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Equipment Inspection"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Time</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="4">4 hours (half day)</SelectItem>
                <SelectItem value="8">8 hours (full day)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Address
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Medical Center Dr, City, State ZIP"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Location Notes</Label>
            <Textarea
              value={locationNotes}
              onChange={(e) => setLocationNotes(e.target.value)}
              placeholder="Parking instructions, entrance to use, etc."
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Site Contact</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Contact Name</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Smith"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@facility.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Special instructions or notes for the visit..."
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendConfirmation"
              checked={sendConfirmation}
              onCheckedChange={(checked) => setSendConfirmation(checked as boolean)}
            />
            <Label htmlFor="sendConfirmation" className="text-sm cursor-pointer">
              Send confirmation email to site contact
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => scheduleMutation.mutate()}
              disabled={!date || scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule Visit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
