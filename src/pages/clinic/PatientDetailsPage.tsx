import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPatient, getAppointments } from '@/lib/clinicService';
import { Patient, Appointment } from '@/types/clinic';
import { PatientForm } from '@/components/clinic/PatientForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { 
  File, 
  Calendar, 
  User, 
  Stethoscope, 
  PlusCircle, 
  FileText, 
  AlertCircle, 
  AlarmClock, 
  FilePlus,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

const PatientDetailsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [uploadingFile, setUploadingFile] = useState(false);

  const [prescriptions, setPrescriptions] = useState([
    { id: '1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', startDate: '2023-10-05', endDate: '2023-10-15', notes: 'Take with food', status: 'active' },
    { id: '2', name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours as needed', startDate: '2023-09-22', endDate: '2023-10-01', notes: 'For pain relief', status: 'completed' },
  ]);
  
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Blood Test Results.pdf', type: 'Lab Result', date: '2023-09-28', size: '1.2 MB' },
    { id: '2', name: 'X-Ray Report.pdf', type: 'Imaging', date: '2023-10-01', size: '3.5 MB' },
    { id: '3', name: 'Medical History.docx', type: 'Document', date: '2023-08-15', size: '245 KB' },
  ]);

  useEffect(() => {
    const loadPatientData = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      try {
        const [patientData, appointmentsData] = await Promise.all([
          getPatient(patientId),
          getAppointments(patientId)
        ]);
        
        setPatient(patientData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error loading patient data:", error);
        toast({
          title: "Error",
          description: "Could not load patient information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatientData();
  }, [patientId, toast]);
  
  const handleRefresh = () => {
    if (patientId) {
      getPatient(patientId)
        .then(data => setPatient(data))
        .catch(error => {
          console.error("Error refreshing patient data:", error);
          toast({
            title: "Error",
            description: "Could not refresh patient data",
            variant: "destructive",
          });
        });
    }
  };
  
  const handleUploadDocument = () => {
    setUploadingFile(true);
    // Simulate file upload
    setTimeout(() => {
      setUploadingFile(false);
      setDocuments(prev => [
        ...prev,
        { 
          id: String(prev.length + 1), 
          name: 'New Document.pdf', 
          type: 'Document', 
          date: format(new Date(), 'yyyy-MM-dd'), 
          size: '1.8 MB' 
        }
      ]);
      
      toast({
        title: "Document Uploaded",
        description: "The document has been added to the patient's records",
      });
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading patient data...</p>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The patient you're looking for doesn't exist or you don't have permission to view their details.
        </p>
        <Button onClick={() => navigate('/clinic/patients')}>
          Return to Patients
        </Button>
      </div>
    );
  }
  
  if (showEditForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Edit Patient</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Update patient details and medical information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm 
              patient={patient}
              userId={user?.id || ''}
              onSuccess={() => {
                setShowEditForm(false);
                handleRefresh();
                toast({
                  title: "Patient Updated",
                  description: "Patient information has been updated successfully",
                });
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Patient Details</h1>
        <Button onClick={() => setShowEditForm(true)}>
          Edit Patient
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">
            <User className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <Stethoscope className="mr-2 h-4 w-4" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                View patient details and medical history
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    First Name
                  </p>
                  <p className="text-lg">{patient.profile?.first_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </p>
                  <p className="text-lg">{patient.profile?.last_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-lg">
                    {patient.date_of_birth ? format(parseISO(patient.date_of_birth), 'PPP') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-lg">{patient.profile?.phone_number || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Medical History
                </p>
                <p className="text-lg">{patient.medical_history || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Allergies
                </p>
                <p className="text-lg">{patient.allergies || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Emergency Contact
                </p>
                <p className="text-lg">{patient.emergency_contact || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Additional Notes
                </p>
                <p className="text-lg">{patient.notes || 'N/A'}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Patient ID: {patient.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Updated: {patient.updated_at ? format(parseISO(patient.updated_at), 'PPP') : 'N/A'}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Appointments ({appointments.length})
            </h2>
            <Button onClick={() => navigate('/clinic/appointments/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
          
          {appointments.length > 0 ? (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle>
                      {appointment.service?.name} with {appointment.practitioner?.name}
                    </CardTitle>
                    <CardDescription>
                      {format(parseISO(appointment.date), 'PPP')} at {appointment.start_time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Practitioner
                        </p>
                        <p className="text-lg">{appointment.practitioner?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Service
                        </p>
                        <p className="text-lg">{appointment.service?.name}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Notes
                      </p>
                      <p className="text-lg">{appointment.notes || 'N/A'}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={() => navigate(`/clinic/appointments/${appointment.id}`)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 flex items-center justify-center">
                <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No appointments found for this patient.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Prescriptions ({prescriptions.length})
            </h2>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Prescription
            </Button>
          </div>
          
          {prescriptions.length > 0 ? (
            <div className="grid gap-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <CardTitle>{prescription.name}</CardTitle>
                    <CardDescription>
                      {prescription.dosage}, {prescription.frequency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Start Date
                        </p>
                        <p className="text-lg">{format(parseISO(prescription.startDate), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          End Date
                        </p>
                        <p className="text-lg">{format(parseISO(prescription.endDate), 'PPP')}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Notes
                      </p>
                      <p className="text-lg">{prescription.notes || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <p className="text-lg">{prescription.status}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 flex items-center justify-center">
                <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No prescriptions found for this patient.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Documents ({documents.length})
            </h2>
            <Button disabled={uploadingFile} onClick={handleUploadDocument}>
              {uploadingFile ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
          
          {documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((document) => (
                <Card key={document.id}>
                  <CardHeader>
                    <CardTitle>{document.name}</CardTitle>
                    <CardDescription>
                      {document.type} - {format(parseISO(document.date), 'PPP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          File Size
                        </p>
                        <p className="text-lg">{document.size}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Uploaded Date
                        </p>
                        <p className="text-lg">{format(parseISO(document.date), 'PPP')}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline">
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 flex items-center justify-center">
                <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No documents found for this patient.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailsPage;
