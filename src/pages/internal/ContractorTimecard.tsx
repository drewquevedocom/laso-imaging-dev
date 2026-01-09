import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Send, Clock } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const timeEntrySchema = z.object({
  date: z.date().optional(),
  hours: z.coerce.number().min(0).max(24).default(0),
  timeIn: z.string().optional(),
  timeOut: z.string().optional(),
  description: z.string().optional(),
  approved: z.boolean().default(false),
});

const formSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  payeeEmail: z.string().email("Valid email is required"),
  payPeriodStart: z.date({ required_error: "Pay period start is required" }),
  payPeriodEnd: z.date({ required_error: "Pay period end is required" }),
  timeEntries: z.array(timeEntrySchema).min(1, "At least one time entry is required"),
  ratePerHour: z.coerce.number().min(0, "Rate must be positive"),
  deductions: z.coerce.number().min(0).default(0),
  expenseReimb: z.coerce.number().min(0).default(0),
  paymentMethod: z.string().optional(),
  paymentDate: z.date().optional(),
  sendToEmail: z.string().email("Valid email is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultTimeEntry = {
  date: undefined,
  hours: 0,
  timeIn: "",
  timeOut: "",
  description: "",
  approved: false,
};

const ContractorTimecard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [netPay, setNetPay] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payeeName: "",
      payeeEmail: "",
      timeEntries: [defaultTimeEntry],
      ratePerHour: 0,
      deductions: 0,
      expenseReimb: 0,
      paymentMethod: "",
      sendToEmail: "",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeEntries",
  });

  const watchTimeEntries = form.watch("timeEntries");
  const watchRate = form.watch("ratePerHour");
  const watchDeductions = form.watch("deductions");
  const watchExpenseReimb = form.watch("expenseReimb");

  useEffect(() => {
    const hours = watchTimeEntries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
    setTotalHours(hours);
    
    const gross = hours * (Number(watchRate) || 0);
    setTotalPay(gross);
    
    const net = gross - (Number(watchDeductions) || 0) + (Number(watchExpenseReimb) || 0);
    setNetPay(net);
  }, [watchTimeEntries, watchRate, watchDeductions, watchExpenseReimb]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare time entries for storage
      const formattedEntries = data.timeEntries.map((entry) => ({
        date: entry.date ? format(entry.date, "yyyy-MM-dd") : null,
        hours: entry.hours,
        timeIn: entry.timeIn || null,
        timeOut: entry.timeOut || null,
        description: entry.description || null,
        approved: entry.approved,
      }));

      // Insert into database
      const { error: dbError } = await supabase
        .from("contractor_timecards")
        .insert({
          payee_name: data.payeeName,
          payee_email: data.payeeEmail,
          pay_period_start: format(data.payPeriodStart, "yyyy-MM-dd"),
          pay_period_end: format(data.payPeriodEnd, "yyyy-MM-dd"),
          time_entries: formattedEntries,
          total_hours: totalHours,
          rate_per_hour: data.ratePerHour,
          total_pay: totalPay,
          deductions: data.deductions,
          expense_reimb: data.expenseReimb,
          net_pay: netPay,
          payment_method: data.paymentMethod || null,
          payment_date: data.paymentDate ? format(data.paymentDate, "yyyy-MM-dd") : null,
          send_to_email: data.sendToEmail,
          notes: data.notes || null,
          status: "pending",
        });

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke(
        "send-timecard-notification",
        {
          body: {
            payeeName: data.payeeName,
            payeeEmail: data.payeeEmail,
            payPeriodStart: format(data.payPeriodStart, "yyyy-MM-dd"),
            payPeriodEnd: format(data.payPeriodEnd, "yyyy-MM-dd"),
            timeEntries: formattedEntries,
            totalHours,
            ratePerHour: data.ratePerHour,
            totalPay,
            deductions: data.deductions,
            expenseReimb: data.expenseReimb,
            netPay,
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate ? format(data.paymentDate, "yyyy-MM-dd") : null,
            sendToEmail: data.sendToEmail,
            notes: data.notes,
          },
        }
      );

      if (emailError) {
        console.error("Email error:", emailError);
        toast.warning("Timecard saved but email could not be sent");
      } else {
        toast.success("Timecard submitted and email sent successfully!");
      }

      form.reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit timecard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Independent Contractor Invoice Worksheet</h1>
            </div>
            <p className="text-primary-foreground/80">Time Report</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Payee Information */}
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-4 text-primary">Payee Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payeeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contractor@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payPeriodStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pay Period Start *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payPeriodEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pay Period End *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Time Entries */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-primary">Time Entries</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append(defaultTimeEntry)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Row
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-center">Hours</th>
                        <th className="p-2 text-center">Time In</th>
                        <th className="p-2 text-center">Time Out</th>
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-center">Approved</th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <tr key={field.id} className="border-b">
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.date`}
                              render={({ field }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "w-[120px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? format(field.value, "MM/dd") : "Date"}
                                      <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.hours`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="24"
                                  className="w-20 text-center"
                                  {...field}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.timeIn`}
                              render={({ field }) => (
                                <Input type="time" className="w-28" {...field} />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.timeOut`}
                              render={({ field }) => (
                                <Input type="time" className="w-28" {...field} />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.description`}
                              render={({ field }) => (
                                <Input placeholder="Description" className="min-w-[150px]" {...field} />
                              )}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <FormField
                              control={form.control}
                              name={`timeEntries.${index}.approved`}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-4 text-primary">Payment Details</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ratePerHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate per Hour ($) *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deductions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deductions ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expenseReimb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expense Reimbursement ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
                              <SelectItem value="wire">Wire Transfer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Payment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : "Select date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="font-semibold text-lg mb-4 text-primary">Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Total Hours:</span>
                      <span className="font-semibold">{totalHours.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Rate per Hour:</span>
                      <span className="font-semibold">{formatCurrency(Number(watchRate) || 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Gross Pay:</span>
                      <span className="font-semibold">{formatCurrency(totalPay)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Deductions:</span>
                      <span className="font-semibold text-destructive">-{formatCurrency(Number(watchDeductions) || 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Expense Reimb:</span>
                      <span className="font-semibold text-green-600">+{formatCurrency(Number(watchExpenseReimb) || 0)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-primary/10 rounded px-2">
                      <span className="font-bold">Net Pay:</span>
                      <span className="font-bold text-lg">{formatCurrency(netPay)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Section */}
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-4 text-primary">Submit Timecard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sendToEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send To Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="accounting@lasoimaging.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes or comments..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Timecard
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-4">
          LASO Imaging Services - Internal Contractor Time Tracking
        </p>
      </div>
    </div>
  );
};

export default ContractorTimecard;
