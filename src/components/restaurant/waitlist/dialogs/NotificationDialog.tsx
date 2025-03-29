
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WaitlistEntryType } from "@/components/restaurant/types";

interface NotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
  refreshEntries: () => void;
}

export function NotificationDialog({ isOpen, onOpenChange, entry, refreshEntries }: NotificationDialogProps) {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  const phoneNumber = entry.profiles?.phone_number || "";

  const handleSendNotification = async () => {
    if (!notificationMessage) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: entry.user_id,
          phoneNumber: phoneNumber,
          message: notificationMessage,
          waitlistId: entry.waitlist_id,
          entryId: entry.id,
          type: "waitlist"
        }
      });

      if (error) throw error;

      toast({
        title: "Notification Sent",
        description: `Notification sent to ${customerName}`,
      });

      setNotificationMessage("");
      onOpenChange(false);
      refreshEntries();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
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
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to {customerName}.
            {phoneNumber && ` They will receive a SMS at ${phoneNumber}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="Your table is ready! Please come to the host stand."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSendNotification} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Notification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
