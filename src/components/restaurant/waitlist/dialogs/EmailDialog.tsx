
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WaitlistEntryType } from "@/components/restaurant/types";
import { Loader2 } from "lucide-react";

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
  refreshEntries?: () => void;
}

export function EmailDialog({ isOpen, onOpenChange, entry, refreshEntries }: EmailDialogProps) {
  const [emailSubject, setEmailSubject] = useState("Your Table is Ready");
  const [emailMessage, setEmailMessage] = useState("Your table is now ready. Please come to the host stand when you arrive.");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const { toast } = useToast();

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  // Get email from profiles or fetch it
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!entry.user_id || !isOpen) return;
      
      setIsLoadingEmail(true);
      
      try {
        // First check if email is already in the entry
        if (entry.profiles?.email) {
          console.log("Found email in profile:", entry.profiles.email);
          setUserEmail(entry.profiles.email);
          setIsLoadingEmail(false);
          return;
        }
        
        console.log("Email not found in profile, fetching from auth...");
        
        // Retrieve the email using the send-notification edge function
        const { data, error } = await supabase.functions.invoke("send-notification", {
          body: {
            action: "get-email",
            userId: entry.user_id
          }
        });
        
        console.log("Auth email lookup response:", data, error);
        
        if (error) throw error;
        if (data && data.email) {
          console.log("Fetched email from edge function:", data.email);
          setUserEmail(data.email);
        } else {
          console.log("No email found for user", entry.user_id);
          setUserEmail(null);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        setUserEmail(null);
      } finally {
        setIsLoadingEmail(false);
      }
    };

    if (isOpen) {
      fetchUserEmail();
    }
  }, [entry.user_id, entry.profiles?.email, isOpen]);

  const handleEmailCustomer = async () => {
    if (!userEmail) {
      toast({
        title: "No Email Address",
        description: "Could not find an email address for this customer",
        variant: "destructive",
      });
      return;
    }

    if (!emailSubject || !emailMessage) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending email to:", userEmail);
      
      // Call the send-notification edge function with email parameters
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: entry.user_id,
          email: userEmail,
          subject: emailSubject,
          message: emailMessage,
          waitlistId: entry.waitlist_id,
          entryId: entry.id,
          type: "email"
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      console.log("Email function response:", data);

      // Update the waitlist entry status to notified
      await supabase
        .from("waitlist_entries")
        .update({ status: "notified" })
        .eq("id", entry.id);

      toast({
        title: "Email Sent",
        description: `Email sent to ${customerName} at ${userEmail}`,
      });

      // If refreshEntries function exists, call it to refresh the list
      if (refreshEntries) {
        refreshEntries();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Customer</DialogTitle>
          <DialogDescription>
            {isLoadingEmail ? (
              "Loading customer email information..."
            ) : userEmail ? (
              `Send an email to ${customerName} at ${userEmail}.`
            ) : (
              "This customer does not have an email address on file."
            )}
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingEmail ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userEmail ? (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Your table is ready"
              />
            </div>
            <div>
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Your table is now ready. Please come to the host stand when you arrive."
                className="min-h-[150px]"
              />
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            You cannot send an email to this customer as they don't have an email address on file.
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {(userEmail && !isLoadingEmail) && (
            <Button 
              onClick={handleEmailCustomer} 
              disabled={isLoading || !userEmail}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
