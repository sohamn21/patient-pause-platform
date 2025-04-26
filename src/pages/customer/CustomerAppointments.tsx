import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPatientAppointments, checkPatientExists } from '@/lib/clinicService';
import { Appointment } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  ClipboardList, 
  PlusCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
  QrCode
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import QrCodeScanner from '@/components/QrCodeScanner';
import { AppointmentQRCode } from '@/components/clinic/AppointmentQRCode';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CustomerAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const patientExists = await checkPatientExists(user.id);
        setIsPatient(patientExists);
        
        if (patientExists) {
          const data = await getPatientAppointments(user.id);
          setAppointments(data as Appointment[]);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast({
          title: "Error",
          description: "Could not load your appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'no-show':
        return <Badge className="bg-amber-500">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'no-show':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const groupAppointmentsByDate = () => {
    const grouped: { [date: string]: Appointment[] } = {};
    
    const sorted = [...appointments].sort((a, b) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.start_time.localeCompare(b.start_time);
    });
    
    sorted.forEach(appointment => {
      const dateKey = appointment.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });
    
    return grouped;
  };
  
  const handleShowQRCode = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowQRDialog(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading your appointments...</p>
      </div>
    );
  }
  
  if (!isPatient) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Complete Your Patient Profile</h2>
          <p className="text-center text-muted-foreground mb-6">
            To book and manage appointments, you need to complete your patient profile first.
          </p>
          <Button onClick={() => navigate('/customer/book')}>
            Set Up Patient Profile
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const groupedAppointments = groupAppointmentsByDate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">View and manage your healthcare appointments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowScanner(!showScanner)} variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            {showScanner ? "Hide Scanner" : "Scan Appointment"}
          </Button>
          <Button onClick={() => navigate('/customer/book')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>
      
      {showScanner && (
        <Card>
          <CardContent className="pt-6">
            <QrCodeScanner mode="appointment" />
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-3xl">
          {selectedAppointment && (
            <AppointmentQRCode 
              appointment={selectedAppointment}
              onInvoiceGenerated={() => {
                toast({
                  title: "Invoice Generated",
                  description: "The invoice has been generated successfully"
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {Object.keys(groupedAppointments).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dateAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className={`h-2 ${
                      appointment.status === 'scheduled' ? 'bg-blue-500' :
                      appointment.status === 'completed' ? 'bg-green-500' :
                      appointment.status === 'cancelled' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appointment.service?.name || 'Appointment'}</CardTitle>
                          <CardDescription>
                            {appointment.practitioner?.name || 'Healthcare Provider'}
                          </CardDescription>
                        </div>
                        {getStatusIcon(appointment.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            {appointment.start_time} - {appointment.end_time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ClipboardList className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            {appointment.status === 'scheduled' ? 'Upcoming' : 
                             appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowQRCode(appointment)}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR Code
                      </Button>
                      {appointment.status === 'scheduled' && (
                        <Button variant="destructive" size="sm">
                          Cancel Appointment
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Appointments Found</h2>
            <p className="text-center text-muted-foreground mb-6">
              You don't have any appointments scheduled. Book your first appointment now.
            </p>
            <Button onClick={() => navigate('/customer/book')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Book an Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerAppointments;
