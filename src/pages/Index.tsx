
import { BarChart3, Calendar, Clock, Users, LogOut } from "lucide-react";
import { WaitlistCard } from "@/components/dashboard/WaitlistCard";
import { AppointmentsCard } from "@/components/dashboard/AppointmentsCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [statsData, setStatsData] = useState({
    customersToday: 0,
    waitTime: "0 min",
    appointments: 0,
    turnoverRate: "0 min"
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Here you would fetch real data from your backend
        // For now we'll set empty data
        setStatsData({
          customersToday: 0,
          waitTime: "0 min",
          appointments: 0,
          turnoverRate: "0 min"
        });
        
        setUpcomingAppointments([]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const firstName = profile?.first_name || user?.user_metadata?.first_name || '';
  const businessName = profile?.business_name || user?.user_metadata?.businessName || '';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your {businessName || 'PatientPause'} dashboard.
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Customers Today" 
          value={statsData.customersToday} 
          icon={Users}
          change={0}
          changeText="vs yesterday"
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard 
          title="Current Wait Time" 
          value={statsData.waitTime} 
          icon={Clock}
          change={0}
          changeText="vs 1 hour ago"
          iconColor="bg-secondary/10 text-secondary"
        />
        <StatsCard 
          title="Today's Appointments" 
          value={statsData.appointments} 
          icon={Calendar}
          change={0}
          changeText="vs yesterday"
          iconColor="bg-accent/10 text-accent"
        />
        <StatsCard 
          title="Table Turnover Rate" 
          value={statsData.turnoverRate} 
          icon={BarChart3}
          change={0}
          changeText="vs last week"
          iconColor="bg-muted text-muted-foreground"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <WaitlistCard count={0} capacity={0} avgWaitTime={0} />
        <div className="lg:col-span-2">
          <AppointmentsCard upcomingAppointments={upcomingAppointments} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ActivityChart />
      </div>
    </div>
  );
};

export default Index;
