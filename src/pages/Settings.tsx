import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  User, 
  Building, 
  Bell, 
  Lock, 
  CreditCard, 
  Users, 
  Save,
  Smartphone,
  Globe,
  Mail,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BillingDetails } from "@/components/settings/BillingDetails";
import { BillingHistory } from "@/components/settings/BillingHistory";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
});

const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const systemSettingsSchema = z.object({
  defaultWaitTime: z.string(),
  notificationsEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  autoRemoveNoShows: z.boolean(),
  language: z.string(),
  timeFormat: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type BusinessFormValues = z.infer<typeof businessFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type SystemSettingsValues = z.infer<typeof systemSettingsSchema>;

const SettingsPage = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      username: "",
    },
  });
  
  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      businessType: "restaurant",
      address: "",
      city: "",
      state: "",
      country: "",
      website: "",
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const systemSettingsForm = useForm<SystemSettingsValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      defaultWaitTime: "30",
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      autoRemoveNoShows: true,
      language: "english",
      timeFormat: "12h",
    },
  });
  
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phoneNumber: profile.phone_number || "",
        username: profile.username || "",
      });
      
      businessForm.reset({
        businessName: profile.business_name || "",
        businessType: profile.business_type || "restaurant",
        address: "",
        city: "",
        state: "",
        country: "",
        website: "",
      });
      
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);
  
  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
        username: values.username,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onBusinessSubmit = async (values: BusinessFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({
        business_name: values.businessName,
        business_type: values.businessType,
      });
      
      toast({
        title: "Business Settings Updated",
        description: "Your business settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update business settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    if (!user) return;
    
    setIsPasswordChanging(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || "",
        password: values.currentPassword,
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        throw updateError;
      }
      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsPasswordChanging(false);
    }
  };
  
  const onSystemSettingsSubmit = async (values: SystemSettingsValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      toast({
        title: "System Settings Updated",
        description: "Your system settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update system settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    
    setIsLoading(true);
    try {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('avatars');
      
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase
          .storage
          .createBucket('avatars', { public: true });
      }
      
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = await supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      await updateProfile({
        avatar_url: urlData.publicUrl,
      });
      
      setAvatarUrl(urlData.publicUrl);
      
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Avatar Update Failed",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, business, and system preferences.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building size={16} />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Bell size={16} />
            <span>System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <BlurCard>
                <BlurCardHeader>
                  <BlurCardTitle>Account Information</BlurCardTitle>
                </BlurCardHeader>
                <BlurCardContent>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={avatarUrl || undefined} />
                        <AvatarFallback className="text-2xl">
                          {getInitials(`${profileForm.getValues().firstName} ${profileForm.getValues().lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2 items-center">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button variant="outline" type="button" className="cursor-pointer">
                            Change Avatar
                          </Button>
                          <Input 
                            id="avatar-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarUpload}
                          />
                        </Label>
                        {avatarUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            type="button"
                            className="text-destructive"
                            onClick={async () => {
                              if (!user) return;
                              try {
                                await updateProfile({ avatar_url: null });
                                setAvatarUrl(null);
                                toast({
                                  title: "Avatar Removed",
                                  description: "Your avatar has been removed."
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to remove avatar",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user?.email || ""}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email address cannot be changed. Contact support if needed.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </BlurCardContent>
              </BlurCard>
              
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <BlurCard className="mt-6">
                    <BlurCardHeader>
                      <BlurCardTitle>Security Settings</BlurCardTitle>
                    </BlurCardHeader>
                    <BlurCardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <p className="text-sm text-muted-foreground">Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.</p>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={isPasswordChanging}
                          >
                            <Lock size={16} className="mr-2" />
                            {isPasswordChanging ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </div>
                    </BlurCardContent>
                  </BlurCard>
                </form>
              </Form>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading || !profileForm.formState.isDirty}
                >
                  <Save size={16} className="mr-2" />
                  {isLoading ? "Saving..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-6">
          <Form {...businessForm}>
            <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)}>
              <BlurCard>
                <BlurCardHeader>
                  <BlurCardTitle>Business Information</BlurCardTitle>
                </BlurCardHeader>
                <BlurCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select 
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="cafe">Café</SelectItem>
                                <SelectItem value="bar">Bar & Pub</SelectItem>
                                <SelectItem value="medical">Medical Practice</SelectItem>
                                <SelectItem value="salon">Beauty & Salon</SelectItem>
                                <SelectItem value="retail">Retail Store</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={businessForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={businessForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} type="url" placeholder="https://" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </BlurCardContent>
              </BlurCard>
              
              <div className="space-y-6 mt-6">
                <BillingDetails />
                <BillingHistory />
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading || !businessForm.formState.isDirty}
                >
                  <Save size={16} className="mr-2" />
                  {isLoading ? "Saving..." : "Save Business Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <Form {...systemSettingsForm}>
            <form onSubmit={systemSettingsForm.handleSubmit(onSystemSettingsSubmit)}>
              <BlurCard>
                <BlurCardHeader>
                  <BlurCardTitle>Waitlist Settings</BlurCardTitle>
                </BlurCardHeader>
                <BlurCardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={systemSettingsForm.control}
                        name="defaultWaitTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Estimated Wait Time (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Default time displayed to customers when joining the waitlist</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemSettingsForm.control}
                        name="autoRemoveNoShows"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Auto Remove No-Shows</FormLabel>
                            <div className="flex items-center space-x-2 h-10">
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground">Automatically remove customers who don't respond after 10 minutes</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <FormField
                        control={systemSettingsForm.control}
                        name="notificationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                              <Bell size={18} />
                              <FormLabel className="mb-0">Enable Notifications</FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemSettingsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0 pl-7">
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              <FormLabel className="mb-0">Email Notifications</FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                disabled={!systemSettingsForm.watch("notificationsEnabled")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemSettingsForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0 pl-7">
                            <div className="flex items-center gap-2">
                              <Smartphone size={16} />
                              <FormLabel className="mb-0">SMS Notifications</FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                disabled={!systemSettingsForm.watch("notificationsEnabled")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemSettingsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0 pl-7">
                            <div className="flex items-center gap-2">
                              <Bell size={16} />
                              <FormLabel className="mb-0">Push Notifications</FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                disabled={!systemSettingsForm.watch("notificationsEnabled")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={systemSettingsForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select 
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="hindi">Hindi</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="german">German</SelectItem>
                                <SelectItem value="japanese">Japanese</SelectItem>
                                <SelectItem value="chinese">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemSettingsForm.control}
                        name="timeFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Format</FormLabel>
                            <Select 
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                <SelectItem value="24h">24-hour</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </BlurCardContent>
              </BlurCard>
              
              <BlurCard className="mt-6">
                <BlurCardHeader>
                  <BlurCardTitle>Staff & Permissions</BlurCardTitle>
                </BlurCardHeader>
                <BlurCardContent>
                  <div className="text-center py-8">
                    <Users size={36} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-medium text-lg">Staff Management</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Add staff members and manage their permissions
                    </p>
                    <Button onClick={() => navigate("/staff-management")}>Manage Staff</Button>
                  </div>
                </BlurCardContent>
              </BlurCard>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading || !systemSettingsForm.formState.isDirty}
                >
                  <Save size={16} className="mr-2" />
                  {isLoading ? "Saving..." : "Save System Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
