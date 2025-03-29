
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@clerk/clerk-react';
import { Clock, ChevronLeft } from 'lucide-react';
import { BlurCard } from '@/components/ui/blur-card';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BusinessFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessType: string;
  termsAccepted: boolean;
  phoneNumber: string;
  username: string;
}

const initialState: BusinessFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  businessType: '',
  termsAccepted: false,
  phoneNumber: '',
  username: '',
};

const BusinessRegister = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formData, setFormData] = useState<BusinessFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get business type from URL query parameters
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type) {
      setFormData(prev => ({ ...prev, businessType: type }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, termsAccepted: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, businessType: value }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast({ title: "Error", description: "First name is required", variant: "destructive" });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast({ title: "Error", description: "Last name is required", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return false;
    }
    if (!formData.username.trim()) {
      toast({ title: "Error", description: "Username is required", variant: "destructive" });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast({ title: "Error", description: "Phone number is required", variant: "destructive" });
      return false;
    }
    if (!formData.password) {
      toast({ title: "Error", description: "Password is required", variant: "destructive" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName.trim()) {
      toast({ title: "Error", description: "Business name is required", variant: "destructive" });
      return false;
    }
    if (!formData.businessType) {
      toast({ title: "Error", description: "Business type is required", variant: "destructive" });
      return false;
    }
    if (!formData.termsAccepted) {
      toast({ title: "Error", description: "You must accept the terms and conditions", variant: "destructive" });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }

    if (!validateStep2()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Create the user with all required fields
      const result = await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
      });

      // Add business metadata
      await signUp.update({
        unsafeMetadata: {
          role: 'business',
          businessName: formData.businessName,
          businessType: formData.businessType,
        },
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast({
          title: "Account created!",
          description: "Welcome to Waitify. Your business account is ready.",
        });
        navigate('/dashboard');
      } else {
        // Handle verification step if needed
        console.log('Sign up status:', result.status);
        toast({
          title: "Verification needed",
          description: "Please check your email or phone for verification instructions.",
        });
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast({
        title: "Error",
        description: err.errors?.[0]?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition">
          <Clock className="w-5 h-5" />
          <span className="font-bold">Waitify</span>
        </Link>
      </div>
      
      <BlurCard className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create Business Account</h1>
            <p className="text-muted-foreground mt-2">
              {step === 1 ? "First, tell us about yourself" : "Now, tell us about your business"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username"
                    placeholder="johndoe" 
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber"
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    name="businessName"
                    placeholder="Your Business Name" 
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinic">Medical Clinic</SelectItem>
                      <SelectItem value="salon">Salon / Spa</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="terms" 
                    checked={formData.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </>
            )}
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default BusinessRegister;
