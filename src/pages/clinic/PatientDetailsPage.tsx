
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPatient, getPatientAppointments } from '@/lib/clinicService';
import { Patient, Appointment } from '@/types/clinic';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PatientForm } from '@/components/clinic/PatientForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, FileText, ArrowLeft, Edit, User } from 'lucide-react';
import { InvoiceGenerator } from '@/components/clinic/InvoiceGenerator';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientData = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        console.log("Fetching patient details for ID:", patientId);
        const patientData = await getPatient(patientId);
        setPatient(patientData as Patient);

        console.log("Fetching patient appointments");
        const appointmentsData = await getPatientAppointments(patientId);
        setAppointments(appointmentsData as Appointment[]);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setHasError(true);
        toast({
          title: "Error",
          description: "Failed to load patient information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, toast]);

  const handleRefresh = async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    setHasError(false);
    try {
      const patientData = await getPatient(patientId);
      setPatient(patientData as Patient);
      
      const appointmentsData = await getPatientAppointments(patientId);
      setAppointments(appointmentsData as Appointment[]);
      
      toast({
        title: "Success",
        description: "Patient information refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing patient data:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to refresh patient information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/patients');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              patient ? `${patient.profile?.first_name || ''} ${patient.profile?.last_name || ''}` : 'Patient Details'
            )}
          </h1>
        </div>
        
        {!isLoading && patient && !showEditForm && (
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : hasError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Failed to load patient information</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : showEditForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Patient Information</CardTitle>
            <CardDescription>Update patient details and medical information</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm 
              patient={patient}
              onSuccess={() => {
                setShowEditForm(false);
                handleRefresh();
                toast({
                  title: "Success",
                  description: "Patient information updated successfully",
                });
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">
                <User className="mr-2 h-4 w-4" />
                Patient Details
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="invoice">
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 mt-6">
              {patient && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                              <dd>{patient.profile?.first_name} {patient.profile?.last_name}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                              <dd>{patient.profile?.phone_number || 'Not provided'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                              <dd>
                                {patient.date_of_birth 
                                  ? format(new Date(patient.date_of_birth), 'MMMM d, yyyy')
                                  : 'Not provided'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Emergency Contact</dt>
                              <dd>{patient.emergency_contact || 'Not provided'}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Medical History</dt>
                              <dd className="whitespace-pre-line">{patient.medical_history || 'No medical history recorded'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Allergies</dt>
                              <dd className="whitespace-pre-line">{patient.allergies || 'No allergies recorded'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Preferred Practitioner</dt>
                              <dd>{patient.preferred_practitioner_id || 'No preference'}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      
                      {patient.notes && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                          <p className="whitespace-pre-line">{patient.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                  <CardDescription>View past and upcoming appointments</CardDescription>
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map(appointment => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              {format(new Date(appointment.date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                {appointment.start_time} - {appointment.end_time}
                              </div>
                            </TableCell>
                            <TableCell>
                              {appointment.service?.name || 'Unknown Service'}
                            </TableCell>
                            <TableCell>
                              {appointment.practitioner?.name || 'Unknown Practitioner'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                appointment.status === 'no-show' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No appointments found for this patient</p>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/appointments?patientId=${patientId}`)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoice" className="space-y-6 mt-6">
              {patient && <InvoiceGenerator patient={patient} />}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PatientDetailsPage;
