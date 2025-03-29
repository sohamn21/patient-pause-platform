
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from '@/components/ui/blur-card';
import { Camera, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QrCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({
  onScanSuccess,
  onScanError
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up the scanner when component unmounts
    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [scanner]);

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
            onScanSuccess(decodedText);
            html5QrCode.stop().catch(() => {});
            setIsScanning(false);
            toast({
              title: "QR Code Detected",
              description: "Successfully scanned a QR code",
            });
          },
          (errorMessage) => {
            // This is called for each non-successful scan, so we don't want to show errors here
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
        <BlurCardTitle>Scan QR Code</BlurCardTitle>
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
              <Button onClick={startScanner} disabled={!hasCamera || isScanning}>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopScanner}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Scanning
              </Button>
            )}
          </div>
        </div>
      </BlurCardContent>
    </BlurCard>
  );
};

export default QrCodeScanner;
