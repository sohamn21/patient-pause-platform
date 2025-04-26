
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Link } from 'lucide-react';
import { Appointment } from '@/types/clinic';
import { format } from 'date-fns';
import { InvoiceGenerator } from './InvoiceGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AppointmentQRCodeProps {
  appointment: Appointment;
  onInvoiceGenerated?: () => void;
}

export const AppointmentQRCode = ({ appointment, onInvoiceGenerated }: AppointmentQRCodeProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQrFull, setShowQrFull] = useState(false);
  const { toast } = useToast();
  
  // Create a direct appointment URL that can be shared
  const appointmentUrl = `${window.location.origin}/customer/book-appointment?businessId=${appointment.business_id}`;
  
  const downloadQRCode = () => {
    setIsDownloading(true);
    try {
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
          
          toast({
            title: "QR Code Downloaded",
            description: "The QR code has been saved to your device"
          });
          
          setIsDownloading(false);
        };
        img.onerror = () => {
          console.error("Error loading QR code image");
          toast({
            title: "Download Failed",
            description: "Could not generate QR code image",
            variant: "destructive"
          });
          setIsDownloading(false);
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
      } else {
        console.error("QR code element not found");
        toast({
          title: "Download Failed",
          description: "QR code element not found",
          variant: "destructive"
        });
        setIsDownloading(false);
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        title: "Download Error",
        description: "Failed to download QR code",
        variant: "destructive"
      });
      setIsDownloading(false);
    }
  };

  const copyAppointmentLink = () => {
    navigator.clipboard.writeText(appointmentUrl);
    toast({
      title: "Link Copied",
      description: "Appointment link copied to clipboard"
    });
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
          <div 
            className={`bg-white p-4 rounded-lg ${showQrFull ? 'w-full max-w-md' : 'w-[200px] h-[200px]'}`}
            onClick={() => setShowQrFull(!showQrFull)}
          >
            <QRCode
              id="appointment-qr-code"
              value={appointmentUrl}
              size={showQrFull ? 300 : 200}
              level="H"
              className="cursor-pointer w-full h-full"
            />
          </div>
          
          {showQrFull && (
            <p className="text-sm text-center text-muted-foreground">
              Click on the QR code to resize
            </p>
          )}
          
          <div className="w-full text-sm space-y-2 text-muted-foreground">
            <p>Date: {format(new Date(appointment.date), 'PPP')}</p>
            <p>Time: {appointment.start_time}</p>
            {appointment.service?.name && (
              <p>Service: {appointment.service.name}</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadQRCode}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyAppointmentLink}
            >
              <Link className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
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
