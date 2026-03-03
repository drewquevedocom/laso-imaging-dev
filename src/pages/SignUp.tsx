import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User, Building, Phone, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { toast } from "sonner";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  company: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  emailOptIn: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useCustomerAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      emailOptIn: true,
    },
  });

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    const result = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);
    
    if (!result.error) {
      toast.success("Account created! Check your email for exclusive offers.");
      navigate("/portal");
    }
  };

  const benefits = [
    "10% off your first equipment purchase",
    "Exclusive access to new inventory alerts",
    "Priority support from our imaging specialists",
    "Track orders and service history in one place",
    "Save equipment to your wishlist",
    "Personalized equipment recommendations",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sign Up - Get 10% Off Your First Order"
        description="Create an account with LASO Imaging Solutions to receive 10% off your first order, exclusive deals, and updates on medical imaging equipment."
        keywords={['sign up', 'create account', 'MRI equipment deals', 'medical imaging discounts']}
        canonical="/signup"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Gift className="h-5 w-5" />
              <span className="font-medium">Limited Time: 10% Off First Order</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Join LASO Imaging
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Create your free account to access exclusive deals, track equipment, and connect with our imaging specialists
            </p>
          </div>
        </section>

        {/* Signup Form Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Benefits Column */}
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Member Benefits
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-secondary rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">
                    Already have an account?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to access your customer portal
                  </p>
                  <Button variant="outline" onClick={() => navigate("/auth/customer")}>
                    Sign In Instead
                  </Button>
                </div>
              </div>

              {/* Form Column */}
              <div className="order-1 md:order-2">
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Create Your Account
                  </h2>
                  
                  <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="John Smith"
                          className="pl-10"
                          {...form.register("fullName")}
                        />
                      </div>
                      {form.formState.errors.fullName && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          className="pl-10"
                          {...form.register("email")}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="company"
                            placeholder="Your Organization"
                            className="pl-10"
                            {...form.register("company")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="(555) 555-5555"
                            className="pl-10"
                            {...form.register("phone")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...form.register("password")}
                        />
                      </div>
                      {form.formState.errors.password && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...form.register("confirmPassword")}
                        />
                      </div>
                      {form.formState.errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox 
                        id="emailOptIn" 
                        checked={form.watch("emailOptIn")}
                        onCheckedChange={(checked) => form.setValue("emailOptIn", !!checked)}
                      />
                      <Label htmlFor="emailOptIn" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Yes, I want to receive exclusive deals, new inventory alerts, and educational content from LASO Imaging. Unsubscribe anytime.
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-4 w-4" />
                          Create Account & Get 10% Off
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By creating an account, you agree to our{" "}
                      <a href="/terms-of-service" className="text-accent hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;