import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, ChevronLeft } from 'lucide-react';
import { BlurCard } from '@/components/ui/blur-card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { BusinessTypeFeatures } from '@/components/business/BusinessTypeFeatures';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<BusinessFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessFormData, string>>>({});
  const location = useLocation();
  
  // Get business type from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type) {
      setFormData(prev => ({ ...prev, businessType: type }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof BusinessFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, termsAccepted: checked }));
    if (errors.termsAccepted) {
      setErrors(prev => ({ ...prev, termsAccepted: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, businessType: value }));
    if (errors.businessType) {
      setErrors(prev => ({ ...prev, businessType: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof BusinessFormData, string>> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof BusinessFormData, string>> = {};
    let isValid = true;

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
      isValid = false;
    }
    
    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
      isValid = false;
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
    
    if (!validateStep2()) {
      return;
    }

    try {
      setIsLoading(true);
      
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        role: 'business',
        businessName: formData.businessName,
        businessType: formData.businessType
      });

      // The redirect is handled in the AuthContext
    } catch (err) {
      console.error('Sign up error:', err);
      // Error is handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const profileFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().optional(),
  });
  
  const businessFormSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessType: z.enum(["restaurant", "salon", "clinic", "other"]),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms and conditions" }) }),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      phoneNumber: '',
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      businessType: 'restaurant',
      termsAccepted: false,
    },
  });

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
              {step === 1 ? "Select your business type to see available features" : "Complete your business profile"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <FormField
                  control={businessForm.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select 
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setFormData(prev => ({ ...prev, businessType: value }));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="salon">Salon & Spa</SelectItem>
                          <SelectItem value="clinic">Medical Clinic</SelectItem>
                          <SelectItem value="other">Other Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {formData.businessType && (
                  <BusinessTypeFeatures businessType={formData.businessType} />
                )}
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="terms" 
                    checked={formData.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="terms"
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      errors.termsAccepted ? "text-destructive" : ""
                    }`}
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-xs text-destructive">{errors.termsAccepted}</p>
                )}
                
                <Button 
                  type="button" 
                  className="w-full"
                  onClick={nextStep}
                  disabled={!formData.businessType || !formData.termsAccepted}
                >
                  Continue to Account Details
                </Button>
              </>
            ) : (
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
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">{errors.lastName}</p>
                    )}
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
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive">{errors.username}</p>
                  )}
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
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
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
                    className={errors.phoneNumber ? "border-destructive" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-destructive">{errors.phoneNumber}</p>
                  )}
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
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
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
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
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
