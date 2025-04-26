
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/types/clinic';
import { getAppointments } from '@/lib/clinicService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Copy, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppointmentQRCode } from '@/components/clinic/AppointmentQRCode';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      toast({
        title: "Authentication Required",
        description: "Please log in to view appointments.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    
    try {
      console.log("Fetching appointments for user ID:", user.id);
      const appointmentsData = await getAppointments(user.id);
      console.log("Appointments data received:", appointmentsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setFetchError("Failed to fetch appointments");
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCopyAppointmentLink = (appointment: Appointment) => {
    const appointmentLink = `${window.location.origin}/customer/book-appointment?businessId=${appointment.business_id}`;
    navigator.clipboard.writeText(appointmentLink);
    toast({
      title: "Appointment Link Copied",
      description: "The appointment link has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">View and manage your appointments</p>
        </div>
        <Button onClick={fetchAppointments} variant="outline" className="flex items-center gap-2">
          <Loader2 className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Refresh
        </Button>
      </div>

      {fetchError && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <p className="font-medium">{fetchError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAppointments}>
            Try Again
          </Button>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentQRCode 
          appointment={selectedAppointment}
          onInvoiceGenerated={() => {
            // Refresh appointments list after invoice generation
            fetchAppointments();
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Here's a list of your upcoming appointments. Click on an appointment to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-32 text-muted-foreground">
              <p>No appointments scheduled.</p>
              {!fetchError && (
                <Button variant="link" onClick={fetchAppointments} className="mt-2">
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Practitioner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id} onClick={() => handleAppointmentClick(appointment)} className="cursor-pointer hover:bg-accent">
                      <TableCell className="font-medium">{format(new Date(appointment.date), 'PPP')}</TableCell>
                      <TableCell>{appointment.start_time}</TableCell>
                      <TableCell>{appointment.service?.name || 'N/A'}</TableCell>
                      <TableCell>{appointment.practitioner?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{appointment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAppointmentLink(appointment);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
