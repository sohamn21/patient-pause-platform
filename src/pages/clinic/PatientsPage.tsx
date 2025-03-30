
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
import { PlusCircle, Search, Calendar, Info, FileText, Trash } from 'lucide-react';
import { PatientForm } from '@/components/clinic/PatientForm';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const PatientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      const data = await getPatients();
      setPatients(data);
      setIsLoading(false);
    };

    fetchPatients();
  }, [user]);

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.profile?.first_name || ''} ${patient.profile?.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleViewDetails = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleNewAppointment = (patientId: string) => {
    navigate(`/appointments?patientId=${patientId}`);
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
        <Button onClick={() => setShowNewPatientForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
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
                getPatients().then(setPatients);
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
            <div className="text-center py-4">Loading patient records...</div>
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
