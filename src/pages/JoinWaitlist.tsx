
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/glow-button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { addToWaitlist } from "@/lib/waitlistService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ClipboardCheck, ArrowLeft, QrCode } from "lucide-react";
import QrCodeScanner from "@/components/QrCodeScanner";

const JoinWaitlist = () => {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistName, setWaitlistName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [isJoining, setIsJoining] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWaitlistInfo = async () => {
      if (waitlistId) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/waitlists/${waitlistId}`);
          if (response.ok) {
            const data = await response.json();
            setWaitlistName(data.name);
            setBusinessName(data.business_name);
          } else {
            toast({
              title: "Error",
              description: "Failed to load waitlist information",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching waitlist info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (waitlistId) {
      fetchWaitlistInfo();
    }
  }, [waitlistId, toast]);

  const handleJoinWaitlist = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to join the waitlist",
      });
      navigate("/signin?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!waitlistId) {
      toast({
        title: "Invalid Waitlist",
        description: "Could not find waitlist information",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsJoining(true);
      const entryData = {
        waitlist_id: waitlistId,
        user_id: user.id,
        notes: "Joined via QR code",
      };
      
      await addToWaitlist(entryData);
      
      toast({
        title: "Success!",
        description: "You've been added to the waitlist",
      });
      
      navigate("/customer/waitlists");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast({
        title: "Failed to Join",
        description: "Could not join the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

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
        ) : waitlistId ? (
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>
                {isLoading ? "Loading..." : `Join ${waitlistName}`}
              </BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-center text-xl font-semibold">{businessName}</p>
                    <p className="text-center text-muted-foreground">
                      You're about to join the waitlist for {waitlistName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <GlowButton 
                      className="w-full" 
                      onClick={handleJoinWaitlist}
                      disabled={isJoining}
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          Join Waitlist
                        </>
                      )}
                    </GlowButton>
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
