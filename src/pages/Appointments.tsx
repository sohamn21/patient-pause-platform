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

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const appointmentsData = await getAppointments(user.id);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">View and manage your appointments</p>
      </div>

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
            <div className="flex justify-center items-center h-32 text-muted-foreground">
              No appointments scheduled.
            </div>
          ) : (
            <ScrollArea>
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
                      <TableCell>{appointment.service?.name}</TableCell>
                      <TableCell>{appointment.practitioner?.name}</TableCell>
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
