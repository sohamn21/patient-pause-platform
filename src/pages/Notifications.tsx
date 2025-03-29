import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { getCurrentSubscription, SubscriptionStatus } from '@/lib/subscriptionService';

const NotificationsPage = () => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('Hello, your waitlist status has been updated!');
  const [smsTemplate, setSmsTemplate] = useState('Your waitlist status has been updated!');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    // setTimeout(() => {
    //   setLoading(false);
    // }, 500);
    
    // Add this to fetch subscription
    const fetchSubscription = async () => {
      try {
        setSubscriptionLoading(true);
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification settings have been updated.",
    });
  };
  
  // Wrap the SMS settings section with a feature gate
  const renderSmsNotificationSettings = () => {
    return (
      <FeatureGate 
        feature="hasSmsNotifications" 
        plan={subscription?.plan}
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Send SMS notifications to customers (Premium Feature)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  SMS notifications are available on Professional and Enterprise plans
                </p>
                <Button onClick={() => navigate('/settings')}>
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>SMS Notifications</CardTitle>
            <CardDescription>
              Send SMS notifications to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Enable SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={smsNotificationsEnabled}
                  onCheckedChange={(checked) => setSmsNotificationsEnabled(checked)}
                />
              </div>
              <div>
                <Label htmlFor="sms-template">SMS Template</Label>
                <Textarea
                  id="sms-template"
                  placeholder="Enter your SMS template"
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground">
          Configure how and when to send notifications to your waitlist customers.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Notifications - Available to all plans */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Send email notifications to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotificationsEnabled}
                  onCheckedChange={(checked) => setEmailNotificationsEnabled(checked)}
                />
              </div>
              <div>
                <Label htmlFor="email-template">Email Template</Label>
                <Textarea
                  id="email-template"
                  placeholder="Enter your email template"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* SMS Notifications - Premium feature */}
        {renderSmsNotificationSettings()}
      </div>
      
      {/* Notification Templates and Preview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Notification Templates</h2>
          <p className="text-muted-foreground">
            Customize the templates for your notifications.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{emailTemplate}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SMS Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{smsTemplate}</p>
          </CardContent>
        </Card>
      </div>
      
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  );
};

export default NotificationsPage;
