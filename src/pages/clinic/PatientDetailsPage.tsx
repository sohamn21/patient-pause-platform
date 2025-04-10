
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
import { Calendar, Clock, FileText, ArrowLeft, Edit, User, ClipboardList, PlusCircle, BarChart, Bell, FileUp, Pill } from 'lucide-react';
import { InvoiceGenerator } from '@/components/clinic/InvoiceGenerator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  const [uploadingFile, setUploadingFile] = useState(false);

  // Dummy data for new features
  const [prescriptions, setPrescriptions] = useState([
    { id: '1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', startDate: '2023-10-05', endDate: '2023-10-15', notes: 'Take with food', status: 'active' },
    { id: '2', name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours as needed', startDate: '2023-09-22', endDate: '2023-10-01', notes: 'For pain relief', status: 'completed' },
  ]);
  
  const [progressData, setProgressData] = useState([
    { date: '2023-08-01', measurement: 'Blood Pressure', value: '120/80', notes: 'Normal range' },
    { date: '2023-09-01', measurement: 'Blood Pressure', value: '118/75', notes: 'Improved' },
    { date: '2023-10-01', measurement: 'Blood Pressure', value: '115/75', notes: 'Stable' },
  ]);
  
  const [medicalRecords, setMedicalRecords] = useState([
    { id: '1', filename: 'blood_work_results.pdf', uploadDate: '2023-09-15', type: 'Lab Results', size: '1.2 MB' },
    { id: '2', filename: 'xray_scan.jpg', uploadDate: '2023-08-22', type: 'Imaging', size: '3.4 MB' },
  ]);

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

  const handleFileUpload = () => {
    setUploadingFile(true);
    // Simulate file upload
    setTimeout(() => {
      setMedicalRecords([
        ...medicalRecords,
        { 
          id: (medicalRecords.length + 1).toString(), 
          filename: 'new_medical_record.pdf', 
          uploadDate: format(new Date(), 'yyyy-MM-dd'), 
          type: 'Medical History', 
          size: '0.8 MB' 
        }
      ]);
      setUploadingFile(false);
      toast({
        title: "Success",
        description: "Medical record uploaded successfully.",
      });
    }, 1500);
  };

  const handleAddPrescription = () => {
    // In a real app, this would open a form to add a new prescription
    toast({
      title: "Feature Coming Soon",
      description: "Prescription management will be available in the next update.",
    });
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
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
              <TabsTrigger value="details">
                <User className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="medical-records">
                <FileUp className="mr-2 h-4 w-4" />
                Records
              </TabsTrigger>
              <TabsTrigger value="prescriptions">
                <Pill className="mr-2 h-4 w-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="progress">
                <BarChart className="mr-2 h-4 w-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="invoice">
                <FileText className="mr-2 h-4 w-4" />
                Invoice
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
            
            <TabsContent value="medical-records" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Upload and manage patient medical records</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleFileUpload} disabled={uploadingFile}>
                    {uploadingFile ? (
                      <>
                        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload Record
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {medicalRecords.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Filename</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicalRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                {record.filename}
                              </div>
                            </TableCell>
                            <TableCell>{record.type}</TableCell>
                            <TableCell>{record.uploadDate}</TableCell>
                            <TableCell>{record.size}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Download
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No medical records found for this patient</p>
                      <Button variant="outline" onClick={handleFileUpload}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload First Record
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prescriptions" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>Manage patient prescriptions</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddPrescription}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Prescription
                  </Button>
                </CardHeader>
                <CardContent>
                  {prescriptions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescriptions.map(prescription => (
                          <TableRow key={prescription.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                                {prescription.name}
                              </div>
                            </TableCell>
                            <TableCell>{prescription.dosage}</TableCell>
                            <TableCell>{prescription.frequency}</TableCell>
                            <TableCell>{prescription.startDate} to {prescription.endDate}</TableCell>
                            <TableCell>
                              <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{prescription.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No prescriptions found for this patient</p>
                      <Button variant="outline" onClick={handleAddPrescription}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add First Prescription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Progress</CardTitle>
                  <CardDescription>Track patient health metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressData.length > 0 ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium">Blood Pressure Trend</h3>
                          <span className="text-sm text-muted-foreground">Improving</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Measurement</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {progressData.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell>{entry.measurement}</TableCell>
                              <TableCell className="font-medium">{entry.value}</TableCell>
                              <TableCell>{entry.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="flex justify-end">
                        <Button variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add New Measurement
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No progress data found for this patient</p>
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add First Measurement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoice" className="space-y-6 mt-6">
              {patient && <InvoiceGenerator patientId={patient.id} />}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PatientDetailsPage;
