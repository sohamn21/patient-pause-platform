
import { BarChart3, Calendar, Clock, Users } from "lucide-react";
import { WaitlistCard } from "@/components/dashboard/WaitlistCard";
import { AppointmentsCard } from "@/components/dashboard/AppointmentsCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

const Index = () => {
  // Mock data
  const upcomingAppointments = [
    {
      id: "1",
      time: "10:30 AM",
      name: "John Smith",
      service: "Haircut & Style",
      status: "confirmed" as const,
    },
    {
      id: "2",
      time: "11:45 AM",
      name: "Emily Johnson",
      service: "Dental Checkup",
      status: "confirmed" as const,
    },
    {
      id: "3",
      time: "1:15 PM",
      name: "Michael Brown",
      service: "Table for 4",
      status: "pending" as const,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your PatientPause dashboard. Here's an overview of your current waitlist and appointments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Customers Today" 
          value={36} 
          icon={Users}
          change={12}
          changeText="vs yesterday"
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard 
          title="Current Wait Time" 
          value="24 min" 
          icon={Clock}
          change={-8}
          changeText="vs 1 hour ago"
          iconColor="bg-secondary/10 text-secondary"
        />
        <StatsCard 
          title="Today's Appointments" 
          value={18} 
          icon={Calendar}
          change={5}
          changeText="vs yesterday"
          iconColor="bg-accent/10 text-accent"
        />
        <StatsCard 
          title="Table Turnover Rate" 
          value="42 min" 
          icon={BarChart3}
          change={-4}
          changeText="vs last week"
          iconColor="bg-muted text-muted-foreground"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <WaitlistCard count={24} capacity={50} avgWaitTime={32} />
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
