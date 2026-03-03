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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  company: z.string().optional(),
  phone: z.string().min(7, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  customerType: z.enum(["reseller", "engineer", "buyer"], { required_error: "Please select your account type" }),
  emailOptIn: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
    const result = await signUp(data.email, data.password, data.fullName, data.customerType, data.phone);
    setIsLoading(false);
    
    if (!result.error) {
      toast.success("Account created! Check your email for exclusive offers.");
      navigate("/portal");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setIsGoogleLoading(false);
    if (error) {
      toast.error("Google sign-in failed. Please try again.");
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

                  {/* Google OAuth Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4"
                    size="lg"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                    </div>
                  </div>
                  
                  <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                    {/* Account Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">I am a... *</Label>
                      <RadioGroup
                        value={form.watch("customerType")}
                        onValueChange={(value) => form.setValue("customerType", value as "reseller" | "engineer" | "buyer", { shouldValidate: true })}
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          { value: "reseller", label: "Reseller" },
                          { value: "engineer", label: "Engineer" },
                          { value: "buyer", label: "Buyer" },
                        ].map((option) => (
                          <Label
                            key={option.value}
                            htmlFor={`type-${option.value}`}
                            className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                              form.watch("customerType") === option.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={option.value} id={`type-${option.value}`} className="sr-only" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.customerType && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.customerType.message}
                        </p>
                      )}
                    </div>

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
                        <Label htmlFor="phone">Phone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="(555) 555-5555"
                            className="pl-10"
                            {...form.register("phone")}
                          />
                        </div>
                        {form.formState.errors.phone && (
                          <p className="text-xs text-destructive">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
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
