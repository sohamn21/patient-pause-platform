
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { GuestWaitlistForm } from "@/components/waitlist/GuestWaitlistForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, QrCode } from "lucide-react";
import QrCodeScanner from "@/components/QrCodeScanner";
import { supabase } from "@/integrations/supabase/client";

const JoinWaitlist = () => {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistName, setWaitlistName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWaitlistInfo = async () => {
      if (waitlistId) {
        try {
          setIsLoading(true);
          
          // Fetch waitlist data from Supabase
          const { data, error } = await supabase
            .from('waitlists')
            .select(`
              *,
              profiles:business_id (business_name)
            `)
            .eq('id', waitlistId)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setWaitlistName(data.name);
            setBusinessName(data.profiles?.business_name || "Unknown Business");
            setShowGuestForm(true); // Show the guest form directly
          } else {
            toast({
              title: "Error",
              description: "Waitlist not found",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching waitlist info:", error);
          toast({
            title: "Error",
            description: "Failed to load waitlist information",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (waitlistId) {
      fetchWaitlistInfo();
    }
  }, [waitlistId, toast]);

  const handleScanSuccess = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      const scannedWaitlistId = pathParts[pathParts.length - 1];
      
      if (scannedWaitlistId) {
        navigate(`/join-waitlist/${scannedWaitlistId}`);
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not a valid waitlist link",
        variant: "destructive",
      });
    }
    
    setShowScanner(false);
  };

  const handleJoinSuccess = () => {
    toast({
      title: "Success!",
      description: "You've been added to the waitlist. You'll be notified when your table is ready.",
    });
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/10">
      <div className="w-full max-w-md">
        {showScanner ? (
          <div className="space-y-4">
            <QrCodeScanner 
              onScanSuccess={handleScanSuccess}
              onScanError={() => {}}
            />
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowScanner(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        ) : waitlistId && showGuestForm ? (
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Join Waitlist</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <GuestWaitlistForm
                  waitlistId={waitlistId}
                  waitlistName={waitlistName}
                  businessName={businessName}
                  onSuccess={handleJoinSuccess}
                  onCancel={handleCancel}
                />
              )}
            </BlurCardContent>
          </BlurCard>
        ) : (
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Scan Waitlist QR Code</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Scan a QR code to join a business waitlist
                </p>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowScanner(true)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan QR Code
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
        )}
      </div>
    </div>
  );
};

export default JoinWaitlist;
