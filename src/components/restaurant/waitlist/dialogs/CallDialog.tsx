
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WaitlistEntryType } from "@/components/restaurant/types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CallDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
}

export function CallDialog({ isOpen, onOpenChange, entry }: CallDialogProps) {
  const { toast } = useToast();
  const [calling, setCalling] = useState(false);

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  const phoneNumber = entry.profiles?.phone_number || "";

  const handleCallCustomer = async () => {
    if (!phoneNumber) {
      toast({
        title: "No Phone Number",
        description: "This customer doesn't have a phone number",
        variant: "destructive",
      });
      return;
    }

    setCalling(true);
    
    try {
      // Log the call in the database (in a real app, we would store this in a calls table)
      // For now, we'll just update the notes on the waitlist entry
      const currentNotes = entry.notes || "";
      const timestamp = new Date().toLocaleString();
      const callNote = `Called on ${timestamp}\n`;
      
      const updatedNotes = callNote + currentNotes;
      
      await supabase
        .from('waitlist_entries')
        .update({ notes: updatedNotes })
        .eq('id', entry.id);
      
      // Initiate the call
      window.open(`tel:${phoneNumber}`);
      
      // Close the dialog
      onOpenChange(false);

      toast({
        title: "Calling Customer",
        description: `Initiating call to ${customerName} at ${phoneNumber}`,
      });
    } catch (error) {
      console.error("Error logging call:", error);
      toast({
        title: "Error",
        description: "Failed to log the call",
        variant: "destructive",
      });
    } finally {
      setCalling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call Customer</DialogTitle>
          <DialogDescription>
            Call {customerName} at {phoneNumber}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center justify-center">
          <Phone size={48} className="mb-4 text-primary" />
          <p className="text-xl font-medium">{phoneNumber}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCallCustomer} disabled={calling}>
            {calling ? "Initiating..." : "Call Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
