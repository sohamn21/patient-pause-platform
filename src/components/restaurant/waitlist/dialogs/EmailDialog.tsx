
import { useState } from "react";
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

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
}

export function EmailDialog({ isOpen, onOpenChange, entry }: EmailDialogProps) {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  // Get email from the profiles data if available, or fetch it
  const [email, setEmail] = useState<string | null>(null);

  // Fetch user email when dialog opens
  const fetchUserEmail = async () => {
    if (!entry.user_id) return;
    
    try {
      const { data, error } = await supabase
        .from('auth')
        .select('email')
        .eq('id', entry.user_id)
        .single();
      
      if (error) throw error;
      if (data && data.email) {
        setEmail(data.email);
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  // Ensure we have the user's email
  if (isOpen && !email && entry.user_id) {
    fetchUserEmail();
  }

  const handleEmailCustomer = async () => {
    if (!email) {
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
      // Call the send-notification edge function with email parameters
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: entry.user_id,
          email: email,
          subject: emailSubject,
          message: emailMessage,
          waitlistId: entry.waitlist_id,
          entryId: entry.id,
          type: "email"
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `Email sent to ${customerName} at ${email}`,
      });

      setEmailSubject("");
      setEmailMessage("");
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
            Send an email to {customerName} {email ? `at ${email}` : ""}.
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleEmailCustomer} disabled={isLoading || !email}>
            {isLoading ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
