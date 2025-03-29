import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, BarChart2, PieChart, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { getCurrentSubscription, SubscriptionStatus } from '@/lib/subscriptionService';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [waitlistFilter, setWaitlistFilter] = useState('all');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      console.log('Reports data loaded');
    }, 1000);
    
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

    return () => clearTimeout(timer);
  }, []);

  const overviewStats = [
    { title: 'Total Customers', value: '1,248', icon: <Users className="h-4 w-4" /> },
    { title: 'Avg. Wait Time', value: '24 min', icon: <Clock className="h-4 w-4" /> },
    { title: 'Revenue', value: '₹42,500', icon: <DollarSign className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          View insights and statistics about your business.
        </p>
      </div>
      
      {/* Basic Analytics - Available to all */}
      <div className="grid gap-4 md:grid-cols-3">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Advanced Analytics - Premium feature */}
      <FeatureGate 
        feature="hasAdvancedAnalytics" 
        plan={subscription?.plan}
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground/30" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Wait Time Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground/30" />
              </CardContent>
            </Card>
          </div>
        </div>
      </FeatureGate>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select value={waitlistFilter} onValueChange={setWaitlistFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Waitlists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Waitlists</SelectItem>
              <SelectItem value="main">Main Waitlist</SelectItem>
              <SelectItem value="vip">VIP Waitlist</SelectItem>
              <SelectItem value="events">Events Waitlist</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <TabsContent value="overview" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Customers</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <BarChart2 className="h-16 w-16 text-muted-foreground/30" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Wait Time Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground/30" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="customers" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center">
            <PieChart className="h-16 w-16 text-muted-foreground/30" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="waitlist" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center">
            <BarChart2 className="h-16 w-16 text-muted-foreground/30" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="revenue" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center">
            <DollarSign className="h-16 w-16 text-muted-foreground/30" />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default ReportsPage;
