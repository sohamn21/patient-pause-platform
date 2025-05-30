import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { updateProfile } from '@/integrations/supabase/profile';
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { BillingDetails } from "@/components/settings/BillingDetails";

const Settings = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setUsername(profile.username || '');
      setPhoneNumber(profile.phone_number || '');
      setBusinessName(profile.business_name || '');
      setBusinessType(profile.business_type || '');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      if (!user) throw new Error("User not found");
      
      const updates = {
        id: user.id,
        username: username !== profile?.username ? username : undefined,
        first_name: firstName !== profile?.first_name ? firstName : undefined,
        last_name: lastName !== profile?.last_name ? lastName : undefined,
        phone_number: phoneNumber !== profile?.phone_number ? phoneNumber : undefined,
        business_name: businessName !== profile?.business_name ? businessName : undefined,
        business_type: businessType !== profile?.business_type ? businessType : undefined,
        updated_at: new Date().toISOString(),
      };
      
      // Remove undefined properties from updates object
      Object.keys(updates).forEach(key => updates[key] === undefined ? delete updates[key] : {});

      await updateProfile(user.id, updates);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
      
      await refreshProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>;
  }

  return (
    <SubscriptionProvider>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handleProfileUpdate} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Update Profile
                      {profile?.first_name !== firstName || profile?.last_name !== lastName || profile?.username !== username || profile?.phone_number !== phoneNumber ? (
                        <></>
                      ) : (
                        <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    type="text"
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    type="text"
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>
                <Button onClick={handleProfileUpdate} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Update Business Info
                      {profile?.business_name !== businessName || profile?.business_type !== businessType ? (
                        <></>
                      ) : (
                        <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage your notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailNotifications" className="flex items-center justify-between">
                    Email Notifications
                    <Switch id="emailNotifications" defaultChecked />
                  </Label>
                  <CardDescription>Receive important updates and notifications via email.</CardDescription>
                </div>
                <div>
                  <Label htmlFor="smsNotifications" className="flex items-center justify-between">
                    SMS Notifications
                    <Switch id="smsNotifications" />
                  </Label>
                  <CardDescription>Get notified via SMS for urgent alerts.</CardDescription>
                </div>
                <Button onClick={handleProfileUpdate} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Notifications"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-6">
            <BillingDetails />
          </TabsContent>
        </Tabs>
      </div>
    </SubscriptionProvider>
  );
};

export default Settings;
