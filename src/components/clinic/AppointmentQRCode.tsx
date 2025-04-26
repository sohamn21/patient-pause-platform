
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Link, QrCode, ZoomIn, ZoomOut } from 'lucide-react';
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
  
  // Create a direct appointment URL that can be shared and joined
  const appointmentUrl = `${window.location.origin}/customer/book-appointment?businessId=${appointment.business_id}&appointmentId=${appointment.id}&join=true`;
  
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
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-primary" />
          Appointment QR Code
        </CardTitle>
        <CardDescription>
          Share this QR code to allow quick access to the appointment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center bg-white p-4 rounded-lg cursor-pointer" 
            onClick={() => setShowQrFull(!showQrFull)}>
            <div className={`transition-all duration-300 ease-in-out ${showQrFull ? 'w-full max-w-md' : 'w-[200px]'}`}>
              <QRCode
                id="appointment-qr-code"
                value={appointmentUrl}
                size={showQrFull ? 256 : 200}
                level="H"
                className="w-full h-full"
              />
            </div>
          </div>
          
          <p className="text-sm text-center text-muted-foreground flex items-center">
            {showQrFull ? (
              <>
                <ZoomOut className="mr-1 h-4 w-4" />
                Click to shrink QR code
              </>
            ) : (
              <>
                <ZoomIn className="mr-1 h-4 w-4" />
                Click to enlarge QR code
              </>
            )}
          </p>
          
          <div className="w-full text-sm space-y-2 text-muted-foreground">
            <p><span className="font-medium text-foreground">Date:</span> {format(new Date(appointment.date), 'PPP')}</p>
            <p><span className="font-medium text-foreground">Time:</span> {appointment.start_time} - {appointment.end_time}</p>
            {appointment.service?.name && (
              <p><span className="font-medium text-foreground">Service:</span> {appointment.service.name}</p>
            )}
            {appointment.practitioner?.name && (
              <p><span className="font-medium text-foreground">Provider:</span> {appointment.practitioner.name}</p>
            )}
            <p><span className="font-medium text-foreground">Status:</span> {appointment.status}</p>
            <p><span className="font-medium text-foreground">Scan to:</span> Join appointment or view details</p>
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
