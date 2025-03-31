
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPatients } from '@/lib/clinicService';
import { Patient } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PlusCircle, Search, Calendar, Info } from 'lucide-react';
import { PatientForm } from '@/components/clinic/PatientForm';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const PatientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        console.log("Fetching patients...");
        // Get businessId from user
        const businessId = user?.id || '';
        console.log("Using business ID:", businessId);
        
        const fetchedPatients = await getPatients(businessId);
        
        // Cast the data to ensure TypeScript compatibility
        setPatients(fetchedPatients as Patient[]);
        
        console.log("Patients set in state:", fetchedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setHasError(true);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user, toast]);

  const filteredPatients = patients.filter(patient => {
    if (!patient.profile) return false;
    const firstName = patient.profile.first_name || '';
    const lastName = patient.profile.last_name || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleViewDetails = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleNewAppointment = (patientId: string) => {
    navigate(`/appointments?patientId=${patientId}`);
  };

  const refreshPatients = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Get businessId from user
      const businessId = user?.id || '';
      const fetchedPatients = await getPatients(businessId);
      
      // Cast the data to ensure TypeScript compatibility
      setPatients(fetchedPatients as Patient[]);
    } catch (error) {
      console.error("Error refreshing patients:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to refresh patients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view your patient records
          </p>
        </div>
        <div className="flex gap-2">
          {hasError && (
            <Button onClick={refreshPatients} variant="outline">
              Retry
            </Button>
          )}
          <Button onClick={() => setShowNewPatientForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>
      </div>

      {showNewPatientForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Patient</CardTitle>
            <CardDescription>Create a new patient record</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm 
              onSuccess={() => {
                setShowNewPatientForm(false);
                // Refresh the patients list
                refreshPatients();
                toast({
                  title: "Success",
                  description: "Patient added successfully",
                });
              }} 
              onCancel={() => setShowNewPatientForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="w-full h-12" />
              ))}
            </div>
          ) : hasError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Failed to load patients</p>
              <Button onClick={refreshPatients} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Preferred Practitioner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.profile?.first_name} {patient.profile?.last_name}
                    </TableCell>
                    <TableCell>{patient.profile?.phone_number || 'N/A'}</TableCell>
                    <TableCell>
                      {patient.date_of_birth 
                        ? format(new Date(patient.date_of_birth), 'MMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {patient.preferred_practitioner_id || 'None'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(patient.id)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAppointment(patient.id)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Appointment
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              {searchQuery 
                ? 'No patients found matching your search.' 
                : 'No patient records found. Add your first patient using the button above.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
