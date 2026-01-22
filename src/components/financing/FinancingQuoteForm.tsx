import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, DollarSign } from 'lucide-react';

const financingFormSchema = z.object({
  facilityName: z.string().min(2, 'Facility name is required').max(100),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20),
  equipmentType: z.string().min(1, 'Please select equipment type'),
  estimatedValue: z.string().min(1, 'Please select estimated value'),
  financingType: z.string().min(1, 'Please select financing type'),
  timeline: z.string().min(1, 'Please select timeline'),
  hasTradeIn: z.boolean().default(false),
  additionalNotes: z.string().max(1000).optional(),
});

type FinancingFormData = z.infer<typeof financingFormSchema>;

interface FinancingQuoteFormProps {
  sourcePage?: string;
}

const FinancingQuoteForm = ({ sourcePage = 'Financing Page' }: FinancingQuoteFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FinancingFormData>({
    resolver: zodResolver(financingFormSchema),
    defaultValues: {
      facilityName: '',
      contactName: '',
      email: '',
      phone: '',
      equipmentType: '',
      estimatedValue: '',
      financingType: '',
      timeline: '',
      hasTradeIn: false,
      additionalNotes: '',
    },
  });

  const onSubmit = async (data: FinancingFormData) => {
    setIsSubmitting(true);

    try {
      // Insert into leads table
      const { error: leadError } = await supabase.from('leads').insert({
        name: data.contactName,
        email: data.email,
        phone: data.phone,
        company: data.facilityName,
        interest: 'Equipment Financing',
        source_page: sourcePage,
        message: `Equipment Type: ${data.equipmentType}\nEstimated Value: ${data.estimatedValue}\nFinancing Type: ${data.financingType}\nTimeline: ${data.timeline}\nTrade-In Available: ${data.hasTradeIn ? 'Yes' : 'No'}${data.additionalNotes ? `\n\nNotes: ${data.additionalNotes}` : ''}`,
      });

      if (leadError) throw leadError;

      // Send notification email
      await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
          company: data.facilityName,
          subject: `Financing Request - ${data.equipmentType} (${data.estimatedValue})`,
          message: `Equipment Type: ${data.equipmentType}\nEstimated Value: ${data.estimatedValue}\nFinancing Type: ${data.financingType}\nTimeline: ${data.timeline}\nTrade-In Available: ${data.hasTradeIn ? 'Yes' : 'No'}${data.additionalNotes ? `\n\nAdditional Notes: ${data.additionalNotes}` : ''}`,
        },
      });

      setIsSubmitted(true);
      toast.success('Financing request submitted successfully!');
    } catch (error) {
      console.error('Error submitting financing request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Request Received!</h3>
        <p className="text-muted-foreground">
          Our financing team will contact you within 24 hours to discuss your options.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Get Financing Options</h3>
          <p className="text-sm text-muted-foreground">Response within 24 hours</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Hospital / Clinic Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@facility.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MRI System">MRI System</SelectItem>
                      <SelectItem value="CT Scanner">CT Scanner</SelectItem>
                      <SelectItem value="X-Ray">X-Ray</SelectItem>
                      <SelectItem value="Mobile MRI/CT">Mobile MRI/CT</SelectItem>
                      <SelectItem value="Multiple Systems">Multiple Systems</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under $100,000">Under $100,000</SelectItem>
                      <SelectItem value="$100,000 - $250,000">$100,000 - $250,000</SelectItem>
                      <SelectItem value="$250,000 - $500,000">$250,000 - $500,000</SelectItem>
                      <SelectItem value="$500,000 - $1,000,000">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="Over $1,000,000">Over $1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financing Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lease">Lease</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                      <SelectItem value="Rent-to-Own">Rent-to-Own</SelectItem>
                      <SelectItem value="Not Sure">Not Sure - Need Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate (ASAP)</SelectItem>
                      <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                      <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                      <SelectItem value="6+ Months">6+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="hasTradeIn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    I have equipment to trade in
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your financing needs..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Get Financing Options'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FinancingQuoteForm;
