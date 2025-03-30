
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, getPatientAppointments, updatePatient, deleteAppointment } from '@/lib/clinicService';
import { Patient, Appointment } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PatientForm } from '@/components/clinic/PatientForm';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  User,
  Phone,
  Mail,
  CalendarClock,
  Heart,
  AlertCircle,
  FileText,
  UserCog
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PatientDetailsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      const patientData = await getPatient(patientId);
      if (patientData) {
        setPatient(patientData);
        
        const appointmentsData = await getPatientAppointments(patientId);
        setAppointments(appointmentsData);
      }
      
      setIsLoading(false);
    };
    
    fetchPatientData();
  }, [patientId]);
  
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    
    const success = await deleteAppointment(appointmentToDelete);
    if (success) {
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been successfully deleted.",
      });
      
      // Update the appointments list
      setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
    }
    
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };
  
  const confirmDeleteAppointment = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };
  
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
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading patient details...</div>;
  }
  
  if (!patient) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The patient record you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/patients')}>Return to Patients</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Details</h1>
          <p className="text-muted-foreground">
            View and manage patient information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate(`/appointments?patientId=${patient.id}`)}
            variant="outline"
          >
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
          <Button 
            onClick={() => setIsEditing(true)}
            variant={isEditing ? "secondary" : "default"}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "Cancel Edit" : "Edit Patient"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Patient Details</TabsTrigger>
          <TabsTrigger value="appointments">Appointments History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Patient</CardTitle>
                <CardDescription>Update patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientForm 
                  patient={patient}
                  onSuccess={(updatedPatient) => {
                    setIsEditing(false);
                    setPatient({
                      ...patient,
                      ...updatedPatient,
                      profile: {
                        ...patient.profile,
                        first_name: updatedPatient.first_name,
                        last_name: updatedPatient.last_name,
                        phone_number: updatedPatient.phone_number || null,
                      }
                    });
                    toast({
                      title: "Patient Updated",
                      description: "Patient information has been updated successfully.",
                    });
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">
                          {patient.profile?.first_name} {patient.profile?.last_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-muted-foreground">
                          {patient.profile?.phone_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CalendarClock className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Date of Birth</p>
                        <p className="text-muted-foreground">
                          {patient.date_of_birth 
                            ? format(new Date(patient.date_of_birth), 'MMMM d, yyyy')
                            : 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <UserCog className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Preferred Practitioner</p>
                        <p className="text-muted-foreground">
                          {patient.preferred_practitioner_id || 'None specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Allergies</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {patient.allergies || 'None recorded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Medical History</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {patient.medical_history || 'None recorded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Emergency Contact</p>
                        <p className="text-muted-foreground">
                          {patient.emergency_contact || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {patient.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                      <p className="text-muted-foreground whitespace-pre-line">
                        {patient.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>
                View all past and upcoming appointments for this patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Practitioner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {format(new Date(appointment.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {appointment.start_time} - {appointment.end_time}
                        </TableCell>
                        <TableCell>
                          {appointment.service?.name || 'Unknown service'}
                        </TableCell>
                        <TableCell>
                          {appointment.practitioner?.name || 'Unknown practitioner'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/appointments?id=${appointment.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => confirmDeleteAppointment(appointment.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Appointments Found</h3>
                  <p className="text-muted-foreground mb-4">
                    This patient doesn't have any appointments yet.
                  </p>
                  <Button onClick={() => navigate(`/appointments?patientId=${patient.id}`)}>
                    Schedule New Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDetailsPage;
