import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Settings } from 'lucide-react';

const cryogenicFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  phone: z.string().max(20).optional(),
  company: z.string().max(200).optional(),
  serviceType: z.string().min(1, 'Please select a service type'),
  manufacturer: z.string().min(1, 'Please select a manufacturer'),
  model: z.string().min(1, 'Please enter the equipment model').max(100),
  issueType: z.string().optional(),
  isEmergency: z.boolean().default(false),
  preferredDate: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type CryogenicFormData = z.infer<typeof cryogenicFormSchema>;

interface CryogenicServiceQuoteFormProps {
  sourcePage: string;
}

const manufacturers = [
  'GE Healthcare',
  'Siemens Healthineers',
  'Philips Healthcare',
  'Canon Medical (Toshiba)',
  'Hitachi',
  'Other',
];

const serviceTypes = [
  'Cold Head Service',
  'Compressor Service',
  'HVAC Service',
  'Multiple Services',
];

const issueTypes = [
  'Preventive Maintenance',
  'Repair Required',
  'Replacement Quote',
  'Performance Issues',
  'General Inquiry',
];

const CryogenicServiceQuoteForm = ({ sourcePage }: CryogenicServiceQuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<CryogenicFormData>({
    resolver: zodResolver(cryogenicFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceType: '',
      manufacturer: '',
      model: '',
      issueType: '',
      isEmergency: false,
      preferredDate: '',
      message: '',
    },
  });

  const onSubmit = async (data: CryogenicFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare the message with service details
      const serviceDetails = `
Service Type: ${data.serviceType}
Equipment: ${data.manufacturer} - ${data.model}
Issue Type: ${data.issueType || 'Not specified'}
Emergency: ${data.isEmergency ? 'Yes' : 'No'}
Preferred Date: ${data.preferredDate || 'Flexible'}
Notes: ${data.message || 'None'}
      `.trim();

      // Save to leads table
      const { error: dbError } = await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        interest: `Cryogenic Service: ${data.serviceType}`,
        message: serviceDetails,
        source_page: sourcePage,
      });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save request');
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-cryogenic-quote-notification', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          serviceType: data.serviceType,
          manufacturer: data.manufacturer,
          model: data.model,
          issueType: data.issueType,
          isEmergency: data.isEmergency,
          preferredDate: data.preferredDate,
          message: data.message,
        },
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw - the lead was saved
      }

      setIsSuccess(true);
      toast.success('Your service quote request has been submitted!');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Request Received!</h3>
        <p className="text-muted-foreground mb-4">
          We'll review your service request and get back to you within 24 hours.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Cold Head, Compressor & HVAC Quote</h3>
          <p className="text-sm text-muted-foreground">Get a quote within 24 hours</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@hospital.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Hospital</FormLabel>
                  <FormControl>
                    <Input placeholder="Memorial Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Service Information</h4>
          </div>

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((mfr) => (
                        <SelectItem key={mfr} value={mfr}>
                          {mfr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Signa HDxt 1.5T" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueTypes.map((issue) => (
                        <SelectItem key={issue} value={issue}>
                          {issue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Service Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isEmergency"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal text-destructive">
                  This is an emergency request
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any symptoms, error codes, or specific concerns..."
                    rows={3}
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
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Get Service Quote'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our privacy policy. We'll never share your information.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default CryogenicServiceQuoteForm;
