
import React, { useState } from 'react';
import { Appointment } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceGenerator } from '@/components/clinic/InvoiceGenerator';
import PrescriptionUploader from '@/components/clinic/PrescriptionUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppointmentCompleteActionsProps {
  appointment: Appointment;
  onInvoiceGenerated?: () => void;
  onPrescriptionUploaded?: () => void;
}

export function AppointmentCompleteActions({
  appointment,
  onInvoiceGenerated,
  onPrescriptionUploaded,
}: AppointmentCompleteActionsProps) {
  const [activeTab, setActiveTab] = useState<string>("invoice");
  const { toast } = useToast();
  
  const handleInvoiceGenerated = () => {
    toast({
      title: "Invoice generated",
      description: "The invoice has been generated successfully",
    });
    
    if (onInvoiceGenerated) {
      onInvoiceGenerated();
    }
    
    // Switch to prescription tab after invoice generation
    setActiveTab("prescription");
  };
  
  const handlePrescriptionUploaded = (prescriptionUrl: string) => {
    toast({
      title: "Prescription uploaded",
      description: "The prescription has been uploaded successfully",
    });
    
    if (onPrescriptionUploaded) {
      onPrescriptionUploaded();
    }
  };

  // Only show this component if appointment is completed
  if (appointment.status !== 'completed') {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle>Appointment Completed</CardTitle>
        </div>
        <CardDescription>
          Generate an invoice and upload a prescription for this appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Invoice
            </TabsTrigger>
            <TabsTrigger value="prescription" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Prescription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoice">
            <InvoiceGenerator 
              patientId={appointment.patient_id} 
              onInvoiceGenerated={handleInvoiceGenerated}
            />
          </TabsContent>
          
          <TabsContent value="prescription">
            <PrescriptionUploader 
              appointmentId={appointment.id} 
              patientId={appointment.patient_id}
              onUploadComplete={handlePrescriptionUploaded}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AppointmentCompleteActions;
