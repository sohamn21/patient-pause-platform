
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

interface CallDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
}

export function CallDialog({ isOpen, onOpenChange, entry }: CallDialogProps) {
  const { toast } = useToast();

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  const phoneNumber = entry.profiles?.phone_number || "";

  const handleCallCustomer = () => {
    if (!phoneNumber) {
      toast({
        title: "No Phone Number",
        description: "This customer doesn't have a phone number",
        variant: "destructive",
      });
      return;
    }

    window.open(`tel:${phoneNumber}`);
    onOpenChange(false);

    toast({
      title: "Calling Customer",
      description: `Initiating call to ${customerName} at ${phoneNumber}`,
    });
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
          <Button onClick={handleCallCustomer}>Call Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
