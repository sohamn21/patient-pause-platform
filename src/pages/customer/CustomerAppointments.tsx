
import React, { useState } from 'react';
import { BlurCard } from "@/components/ui/blur-card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon,
  Check,
  X
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample upcoming appointments
const sampleUpcomingAppointments = [
  {
    id: "a1",
    businessName: "Studio 54 Hair Salon",
    serviceName: "Haircut & Style",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    time: "10:30 AM",
    duration: "45 min",
    staffName: "Jessica Lee",
    price: "$65.00",
  },
  {
    id: "a2",
    businessName: "Peak Medical Clinic",
    serviceName: "Annual Check-up",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    time: "2:15 PM",
    duration: "30 min",
    staffName: "Dr. Michael Chen",
    price: "Insurance",
  }
];

// Sample past appointments
const samplePastAppointments = [
  {
    id: "p1",
    businessName: "Urban Bistro",
    serviceName: "Dinner Reservation",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    time: "7:30 PM",
    duration: "90 min",
    status: "completed" as const
  },
  {
    id: "p2",
    businessName: "Studio 54 Hair Salon",
    serviceName: "Hair Coloring",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    time: "1:00 PM",
    duration: "120 min",
    status: "completed" as const
  },
  {
    id: "p3",
    businessName: "Cloud 9 Cafe",
    serviceName: "Team Meeting",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 21 days ago
    time: "9:00 AM",
    duration: "60 min",
    status: "cancelled" as const
  }
];

const CustomerAppointments = () => {
  const { toast } = useToast();
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    business: "",
    service: "",
    date: "",
    time: "",
    notes: ""
  });
  
  const handleCancelAppointment = (appointmentId: string, businessName: string) => {
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment at ${businessName} has been cancelled.`,
      variant: "destructive",
    });
  };
  
  const handleRescheduleAppointment = (appointmentId: string, businessName: string) => {
    toast({
      title: "Reschedule Requested",
      description: `We've sent a request to reschedule your appointment at ${businessName}.`,
    });
  };
  
  const handleBookAppointment = () => {
    toast({
      title: "Appointment Requested",
      description: "Your appointment request has been sent to the business.",
    });
    setShowBookDialog(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
        <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
          <DialogTrigger asChild>
            <Button>Book New Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to request a new appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="business" className="text-right">
                  Business
                </Label>
                <Select 
                  onValueChange={(value) => setNewAppointment({...newAppointment, business: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban Bistro</SelectItem>
                    <SelectItem value="cloud9">Cloud 9 Cafe</SelectItem>
                    <SelectItem value="studio54">Studio 54 Hair Salon</SelectItem>
                    <SelectItem value="peak">Peak Medical Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select
                  onValueChange={(value) => setNewAppointment({...newAppointment, service: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haircut">Haircut & Style</SelectItem>
                    <SelectItem value="color">Hair Coloring</SelectItem>
                    <SelectItem value="dinner">Dinner Reservation</SelectItem>
                    <SelectItem value="checkup">Medical Check-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  className="col-span-3"
                  placeholder="Any special requests"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleBookAppointment}>Request Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {sampleUpcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleUpcomingAppointments.map(appointment => (
                <BlurCard key={appointment.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.businessName}</h3>
                        <p className="text-base">{appointment.serviceName}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {appointment.price}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {appointment.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {appointment.time} ({appointment.duration})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.staffName}</span>
                      </div>
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRescheduleAppointment(appointment.id, appointment.businessName)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCancelAppointment(appointment.id, appointment.businessName)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </BlurCard>
              ))}
            </div>
          ) : (
            <BlurCard className="p-6 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any appointments scheduled.
              </p>
              <Button onClick={() => setShowBookDialog(true)}>
                Book an Appointment
              </Button>
            </BlurCard>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          <BlurCard>
            <div className="divide-y divide-border">
              {samplePastAppointments.map(appointment => (
                <div key={appointment.id} className="p-4 hover:bg-accent/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.businessName}</h3>
                      <p className="text-sm">{appointment.serviceName}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {appointment.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {appointment.time} ({appointment.duration})
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      appointment.status === 'completed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {appointment.status === 'completed' ? (
                        <>
                          <Check className="w-3 h-3" />
                          Completed
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Cancelled
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAppointments;
