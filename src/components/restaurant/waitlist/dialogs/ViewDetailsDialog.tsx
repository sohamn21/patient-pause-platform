
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WaitlistEntryType } from "@/components/restaurant/types";

interface ViewDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entry: WaitlistEntryType;
}

export function ViewDetailsDialog({ isOpen, onOpenChange, entry }: ViewDetailsDialogProps) {
  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  const phoneNumber = entry.profiles?.phone_number || "";
  const email = entry.profiles?.email || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Waitlist Entry Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Customer</Label>
            <p className="font-medium">{customerName}</p>
          </div>
          {phoneNumber && (
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">{phoneNumber}</p>
            </div>
          )}
          {email && (
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{email}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Position</Label>
            <p className="font-medium">{entry.position}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <p className="font-medium capitalize">{entry.status}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Est. Wait Time</Label>
            <p className="font-medium">{entry.estimated_wait_time || "--"} min</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Added</Label>
            <p className="font-medium">{new Date(entry.created_at).toLocaleString()}</p>
          </div>
          {entry.notes && (
            <div>
              <Label className="text-muted-foreground">Notes</Label>
              <p className="text-sm border rounded-md p-2 bg-muted/50">{entry.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
