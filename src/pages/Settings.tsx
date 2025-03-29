
import { useState } from "react";
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
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // User profile fields
  const [profileSettings, setProfileSettings] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: user?.email || "",
    phoneNumber: profile?.phone_number || "",
    username: profile?.username || "",
  });
  
  // Business settings fields
  const [businessSettings, setBusinessSettings] = useState({
    businessName: profile?.business_name || "",
    businessType: profile?.business_type || "restaurant",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
  });
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    defaultWaitTime: "30",
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    autoRemoveNoShows: true,
    language: "english",
    timeFormat: "12h",
  });
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };
  
  const handleBusinessUpdate = () => {
    toast({
      title: "Business Settings Updated",
      description: "Your business settings have been saved successfully.",
    });
  };
  
  const handleSystemUpdate = () => {
    toast({
      title: "System Settings Updated",
      description: "Your system settings have been saved successfully.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, business, and system preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
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
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Account Information</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-28 w-28">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">{getInitials(`${profileSettings.firstName} ${profileSettings.lastName}`)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profileSettings.firstName} 
                        onChange={e => setProfileSettings({...profileSettings, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profileSettings.lastName} 
                        onChange={e => setProfileSettings({...profileSettings, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileSettings.email}
                      onChange={e => setProfileSettings({...profileSettings, email: e.target.value})}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email address cannot be changed. Contact support if needed.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        value={profileSettings.phoneNumber}
                        onChange={e => setProfileSettings({...profileSettings, phoneNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={profileSettings.username}
                        onChange={e => setProfileSettings({...profileSettings, username: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Security Settings</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.</p>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate}>
              <Save size={16} className="mr-2" />
              Save Profile Changes
            </Button>
          </div>
        </TabsContent>
        
        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Business Information</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      value={businessSettings.businessName}
                      onChange={e => setBusinessSettings({...businessSettings, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select 
                      value={businessSettings.businessType}
                      onValueChange={value => setBusinessSettings({...businessSettings, businessType: value})}
                    >
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
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
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    value={businessSettings.address}
                    onChange={e => setBusinessSettings({...businessSettings, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={businessSettings.city}
                      onChange={e => setBusinessSettings({...businessSettings, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      value={businessSettings.state}
                      onChange={e => setBusinessSettings({...businessSettings, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={businessSettings.country}
                      onChange={e => setBusinessSettings({...businessSettings, country: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    type="url" 
                    placeholder="https://" 
                    value={businessSettings.website}
                    onChange={e => setBusinessSettings({...businessSettings, website: e.target.value})}
                  />
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Billing & Subscription</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium">Current Plan: <span className="text-primary">Professional</span></span>
                    <span className="text-sm text-muted-foreground">₹1,999/month, billed monthly</span>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium">Payment Method</span>
                    <span className="text-sm text-muted-foreground">Credit Card ending in 4242</span>
                  </div>
                  <Button variant="outline">Update Payment</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium">Billing History</span>
                    <span className="text-sm text-muted-foreground">View past invoices and payment history</span>
                  </div>
                  <Button variant="outline">View Invoices</Button>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <div className="flex justify-end">
            <Button onClick={handleBusinessUpdate}>
              <Save size={16} className="mr-2" />
              Save Business Settings
            </Button>
          </div>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Waitlist Settings</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultWaitTime">Default Estimated Wait Time (minutes)</Label>
                    <Input 
                      id="defaultWaitTime" 
                      type="number"
                      value={systemSettings.defaultWaitTime}
                      onChange={e => setSystemSettings({...systemSettings, defaultWaitTime: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Default time displayed to customers when joining the waitlist</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autoRemoveNoShows" className="block mb-4">Auto Remove No-Shows</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="autoRemoveNoShows" 
                        checked={systemSettings.autoRemoveNoShows}
                        onCheckedChange={checked => setSystemSettings({...systemSettings, autoRemoveNoShows: checked})}
                      />
                      <span className="text-sm text-muted-foreground">Automatically remove customers who don't respond after 10 minutes</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={18} />
                      <span>Enable Notifications</span>
                    </div>
                    <Switch 
                      checked={systemSettings.notificationsEnabled}
                      onCheckedChange={checked => setSystemSettings({...systemSettings, notificationsEnabled: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between pl-7">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>Email Notifications</span>
                    </div>
                    <Switch 
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={checked => setSystemSettings({...systemSettings, emailNotifications: checked})}
                      disabled={!systemSettings.notificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between pl-7">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch 
                      checked={systemSettings.smsNotifications}
                      onCheckedChange={checked => setSystemSettings({...systemSettings, smsNotifications: checked})}
                      disabled={!systemSettings.notificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between pl-7">
                    <div className="flex items-center gap-2">
                      <Bell size={16} />
                      <span>Push Notifications</span>
                    </div>
                    <Switch 
                      checked={systemSettings.pushNotifications}
                      onCheckedChange={checked => setSystemSettings({...systemSettings, pushNotifications: checked})}
                      disabled={!systemSettings.notificationsEnabled}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={systemSettings.language}
                      onValueChange={value => setSystemSettings({...systemSettings, language: value})}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select 
                      value={systemSettings.timeFormat}
                      onValueChange={value => setSystemSettings({...systemSettings, timeFormat: value})}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <BlurCard>
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
                <Button>Manage Staff</Button>
              </div>
            </BlurCardContent>
          </BlurCard>
          
          <div className="flex justify-end">
            <Button onClick={handleSystemUpdate}>
              <Save size={16} className="mr-2" />
              Save System Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
