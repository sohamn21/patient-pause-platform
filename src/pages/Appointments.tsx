import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/types/clinic';
import { getAppointments } from '@/lib/clinicService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Copy, Loader2, AlertTriangle, RefreshCw, QrCode, ScanIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentQRCode } from '@/components/clinic/AppointmentQRCode';
import QrCodeScanner from '@/components/QrCodeScanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchAppointments();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setFetchError("Authentication required");
    }
  }, [user, retryCount]);

  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      setFetchError("Authentication required");
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
      
      if (!Array.isArray(appointmentsData)) {
        throw new Error("Invalid response format");
      }
      
      const sortedAppointments = [...appointmentsData].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const dateDiff = dateB.getTime() - dateA.getTime();
        
        if (dateDiff !== 0) return dateDiff;
        
        return a.start_time.localeCompare(b.start_time);
      }) as Appointment[];
      
      setAppointments(sortedAppointments);
      
      if (sortedAppointments.length > 0) {
        toast({
          title: "Appointments Loaded",
          description: `Successfully loaded ${sortedAppointments.length} appointment(s).`,
        });
        
        if (!selectedAppointment && sortedAppointments.length > 0) {
          setSelectedAppointment(sortedAppointments[0]);
        }
      } else {
        toast({
          title: "No Appointments Found",
          description: "You don't have any appointments scheduled.",
        });
      }
      
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setFetchError(error instanceof Error ? error.message : "Failed to fetch appointments");
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
    console.log("Selected appointment:", appointment);
    setSelectedAppointment(appointment);
    
    setTimeout(() => {
      document.getElementById('appointment-qr-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleCopyAppointmentLink = (appointment: Appointment, event: React.MouseEvent) => {
    event.stopPropagation();
    const appointmentLink = `${window.location.origin}/customer/book-appointment?businessId=${appointment.business_id}&appointmentId=${appointment.id}`;
    navigator.clipboard.writeText(appointmentLink);
    toast({
      title: "Appointment Link Copied",
      description: "The appointment link has been copied to your clipboard.",
    });
  };

  const handleShowQRCode = (appointment: Appointment, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedAppointment(appointment);
    setShowQRDialog(true);
  };

  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Please sign in to view your appointments</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <h2 className="text-xl font-semibold">Authentication Required</h2>
              <p className="text-center text-muted-foreground">
                You need to be signed in to view and manage your appointments.
              </p>
              <Button onClick={() => navigate('/signin')}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowQrScanner(!showQrScanner)}
            variant="outline"
          >
            <ScanIcon className="mr-2 h-4 w-4" />
            {showQrScanner ? "Hide Scanner" : "Scan QR Code"}
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p className="font-medium">{fetchError}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {showQrScanner && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Appointment QR Code</CardTitle>
            <CardDescription>Scan a QR code to join or view an appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <QrCodeScanner mode="appointment" />
          </CardContent>
        </Card>
      )}

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Appointment QR Code</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentQRCode 
              appointment={selectedAppointment}
              onInvoiceGenerated={() => {
                toast({
                  title: "Invoice Generated",
                  description: "The invoice has been generated successfully"
                });
                fetchAppointments();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>
            Click on an appointment to view its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-32 text-muted-foreground">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <p>No appointments scheduled.</p>
              {!fetchError && (
                <Button variant="link" onClick={handleRefresh} className="mt-2">
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
                    <TableRow 
                      key={appointment.id} 
                      onClick={() => handleAppointmentClick(appointment)} 
                      className={`cursor-pointer hover:bg-accent ${selectedAppointment?.id === appointment.id ? 'bg-accent/50' : ''}`}
                    >
                      <TableCell className="font-medium">
                        {format(new Date(appointment.date), 'PPP')}
                      </TableCell>
                      <TableCell>{appointment.start_time}</TableCell>
                      <TableCell>{appointment.service?.name || 'N/A'}</TableCell>
                      <TableCell>{appointment.practitioner?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          appointment.status === 'scheduled' ? 'secondary' :
                          appointment.status === 'completed' ? 'default' :
                          appointment.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => handleCopyAppointmentLink(appointment, e)}
                            title="Copy appointment link to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => handleShowQRCode(appointment, e)}
                            title="Generate QR code for this appointment"
                            className="flex items-center"
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                        </div>
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
