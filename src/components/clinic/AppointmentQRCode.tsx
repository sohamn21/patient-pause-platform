
import React from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileInvoice, Download } from 'lucide-react';
import { Appointment } from '@/types/clinic';
import { format } from 'date-fns';
import { InvoiceGenerator } from './InvoiceGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AppointmentQRCodeProps {
  appointment: Appointment;
  onInvoiceGenerated?: () => void;
}

export const AppointmentQRCode = ({ appointment, onInvoiceGenerated }: AppointmentQRCodeProps) => {
  const appointmentUrl = `${window.location.origin}/customer/book-appointment?businessId=${appointment.business_id}`;
  
  const downloadQRCode = () => {
    const svg = document.getElementById("appointment-qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `appointment-${appointment.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment QR Code</CardTitle>
        <CardDescription>
          Share this QR code with the patient to let them access their appointment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              id="appointment-qr-code"
              value={appointmentUrl}
              size={200}
              level="H"
            />
          </div>
          
          <div className="w-full text-sm space-y-2 text-muted-foreground">
            <p>Date: {format(new Date(appointment.date), 'PPP')}</p>
            <p>Time: {appointment.start_time}</p>
            {appointment.service?.name && (
              <p>Service: {appointment.service.name}</p>
            )}
          </div>
          
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadQRCode}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <FileInvoice className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Generate Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceGenerator
                  patientId={appointment.patient_id}
                  onInvoiceGenerated={onInvoiceGenerated}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
