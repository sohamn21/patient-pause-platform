
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from '@/components/ui/blur-card';
import { Camera, StopCircle, ScanIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QrCodeScannerProps {
  onScanSuccess?: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  mode?: 'appointment' | 'custom';
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  mode = 'custom'
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [scanner]);

  const handleScanSuccess = (decodedText: string) => {
    if (mode === 'appointment') {
      try {
        if (decodedText.startsWith('http')) {
          const url = new URL(decodedText);
          if (url.pathname.includes('book-appointment')) {
            const businessId = url.searchParams.get('businessId');
            const appointmentId = url.searchParams.get('appointmentId');
            
            if (businessId && appointmentId) {
              navigate(`/customer/book-appointment?businessId=${businessId}&appointmentId=${appointmentId}&join=true`);
              toast({
                title: "Appointment Found",
                description: "Redirecting to join appointment...",
              });
            } else {
              toast({
                title: "Invalid QR Code",
                description: "This QR code doesn't contain valid appointment information",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Invalid QR Code",
              description: "This QR code is not for an appointment",
              variant: "destructive",
            });
          }
        } else {
          navigate(`/customer/book-appointment?appointmentId=${decodedText}&join=true`);
          toast({
            title: "Appointment ID Found",
            description: "Attempting to join appointment...",
          });
        }
      } catch (error) {
        toast({
          title: "Invalid QR Code",
          description: "Unable to process the QR code",
          variant: "destructive",
        });
      }
    } else if (onScanSuccess) {
      onScanSuccess(decodedText);
    }
    
    if (scanner) {
      scanner.stop().catch(() => {});
      setIsScanning(false);
    }
  };

  const startScanner = async () => {
    try {
      setErrorMessage(null);
      const html5QrCode = new Html5Qrcode("reader");
      setScanner(html5QrCode);

      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        setHasCamera(true);
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            handleScanSuccess(decodedText);
            html5QrCode.stop().catch(() => {});
            setIsScanning(false);
            toast({
              title: "QR Code Detected",
              description: "Successfully scanned a QR code",
            });
          },
          (errorMessage) => {
            if (onScanError) {
              onScanError(errorMessage);
            }
          }
        );
        
        setIsScanning(true);
        toast({
          title: "Scanner Started",
          description: "Point your camera at a QR code",
        });
      } else {
        setHasCamera(false);
        setErrorMessage("No camera found on this device");
        toast({
          title: "Camera Error",
          description: "No camera found on this device",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      setErrorMessage("Failed to start camera. Please ensure you've granted camera permissions.");
      toast({
        title: "Camera Error",
        description: "Failed to start camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop().catch(() => {});
      setIsScanning(false);
      toast({
        title: "Scanner Stopped",
        description: "QR code scanner has been stopped",
      });
    }
  };

  return (
    <BlurCard>
      <BlurCardHeader>
        <BlurCardTitle className="flex items-center">
          <ScanIcon className="mr-2 h-5 w-5 text-primary" />
          {mode === 'appointment' ? 'Scan Appointment QR Code' : 'Scan QR Code'}
        </BlurCardTitle>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="flex flex-col items-center space-y-4">
          <div 
            id="reader" 
            className="w-full max-w-[300px] h-[300px] overflow-hidden border border-gray-200 rounded-lg"
          ></div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </div>
          )}
          
          {!hasCamera && (
            <div className="text-center text-sm text-muted-foreground">
              No camera detected. Try using a device with a camera.
            </div>
          )}
          
          <div className="flex space-x-4">
            {!isScanning ? (
              <Button onClick={startScanner} disabled={!hasCamera || isScanning} className="flex items-center">
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopScanner} className="flex items-center">
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Scanning
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Point your camera at an appointment QR code to join or view the appointment details.</p>
          </div>
        </div>
      </BlurCardContent>
    </BlurCard>
  );
};

export default QrCodeScanner;
