
import { useState } from "react";
import { WaitlistEntryType } from "@/components/restaurant/types";
import { ViewDetailsDialog } from "./waitlist/dialogs/ViewDetailsDialog";
import { NotificationDialog } from "./waitlist/dialogs/NotificationDialog";
import { CallDialog } from "./waitlist/dialogs/CallDialog";
import { EmailDialog } from "./waitlist/dialogs/EmailDialog";
import { ActionMenu } from "./waitlist/ActionMenu";
import { useToast } from "@/hooks/use-toast";

interface WaitlistActionsProps {
  entry: WaitlistEntryType;
  onStatusChange: (id: string, status: "waiting" | "notified" | "seated" | "cancelled") => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  refreshEntries: () => void;
}

export function WaitlistActions({ entry, onStatusChange, onRemove, refreshEntries }: WaitlistActionsProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = () => {
    setIsViewDialogOpen(true);
  };

  // Email is now the default notification method
  const handleNotify = () => {
    // Check if email exists
    const email = entry.profiles?.email;
    const phoneNumber = entry.profiles?.phone_number;
    
    if (email) {
      setIsEmailDialogOpen(true);
    } else if (phoneNumber) {
      // Fallback to SMS if no email is available
      setIsNotifyDialogOpen(true);
    } else {
      // If neither email nor phone exists, show toast
      toast({
        title: "No Contact Method",
        description: "This customer has no email or phone number on file.",
        variant: "destructive"
      });
    }
  };

  const handleEmail = () => {
    // Always open the email dialog - the dialog itself will handle missing emails
    console.log("Opening email dialog for customer:", entry.id);
    setIsEmailDialogOpen(true);
  };

  console.log("WaitlistActions - Entry:", {
    id: entry.id, 
    hasEmail: !!entry.profiles?.email,
    email: entry.profiles?.email,
    status: entry.status
  });

  return (
    <>
      <ActionMenu 
        entry={entry}
        onViewDetails={handleViewDetails}
        onNotify={handleNotify}
        onCall={() => setIsCallDialogOpen(true)}
        onEmail={handleEmail}
        onStatusChange={onStatusChange}
        onRemove={onRemove}
      />

      <ViewDetailsDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        entry={entry}
      />

      <NotificationDialog
        isOpen={isNotifyDialogOpen}
        onOpenChange={setIsNotifyDialogOpen}
        entry={entry}
        refreshEntries={refreshEntries}
      />

      <CallDialog
        isOpen={isCallDialogOpen}
        onOpenChange={setIsCallDialogOpen}
        entry={entry}
      />

      <EmailDialog
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        entry={entry}
        refreshEntries={refreshEntries}
      />
    </>
  );
}
