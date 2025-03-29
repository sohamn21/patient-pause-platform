
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Eye, 
  SendHorizonal, 
  Phone, 
  Mail, 
  MoreVertical, 
  UserCheck, 
  X, 
  UserMinus 
} from "lucide-react";

type WaitlistEntryStatus = "waiting" | "notified" | "seated" | "cancelled";

interface WaitlistEntry {
  id: string;
  user_id: string;
  waitlist_id: string;
  position: number;
  status: WaitlistEntryStatus;
  estimated_wait_time?: number;
  notes?: string;
  created_at: string;
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  };
}

interface WaitlistActionsProps {
  entry: WaitlistEntry;
  onStatusChange: (id: string, status: WaitlistEntryStatus) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  refreshEntries: () => void;
}

export function WaitlistActions({ entry, onStatusChange, onRemove, refreshEntries }: WaitlistActionsProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const customerName = entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
  
  const phoneNumber = entry.profiles?.phone_number || "";
  const email = entry.profiles?.email || "";

  const handleViewDetails = () => {
    setIsViewDialogOpen(true);
  };

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
      // Call the edge function to send notification
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
      setIsNotifyDialogOpen(false);
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

  const handleCallCustomer = () => {
    if (!phoneNumber) {
      toast({
        title: "No Phone Number",
        description: "This customer doesn't have a phone number",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this might integrate with a calling API
    // For now, we'll just simulate it
    window.open(`tel:${phoneNumber}`);
    setIsCallDialogOpen(false);

    toast({
      title: "Calling Customer",
      description: `Initiating call to ${customerName} at ${phoneNumber}`,
    });
  };

  const handleEmailCustomer = async () => {
    if (!email) {
      toast({
        title: "No Email Address",
        description: "This customer doesn't have an email address",
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
      // In a real app, this would call an email API or service
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Email Sent",
        description: `Email sent to ${customerName} at ${email}`,
      });

      setEmailSubject("");
      setEmailMessage("");
      setIsEmailDialogOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => setIsNotifyDialogOpen(true)}
          disabled={entry.status === "seated" || entry.status === "cancelled"}
        >
          <SendHorizonal size={16} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <span className="sr-only">Actions</span>
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye size={14} className="mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsNotifyDialogOpen(true)}
              disabled={entry.status === "seated" || entry.status === "cancelled"}
            >
              <SendHorizonal size={14} className="mr-2" />
              Send Notification
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsCallDialogOpen(true)}
              disabled={!phoneNumber}
            >
              <Phone size={14} className="mr-2" />
              Call Customer
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsEmailDialogOpen(true)}
              disabled={!email}
            >
              <Mail size={14} className="mr-2" />
              Email Customer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onStatusChange(entry.id, "seated")}
              disabled={entry.status === "seated" || entry.status === "cancelled"}
            >
              <UserCheck size={14} className="mr-2" />
              Mark as Seated
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(entry.id, "cancelled")}
              disabled={entry.status === "cancelled"}
              className="text-red-500"
            >
              <X size={14} className="mr-2" />
              Cancel
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onRemove(entry.id)}
              className="text-red-500"
            >
              <UserMinus size={14} className="mr-2" />
              Remove from Waitlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendNotification} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Customer Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCallCustomer}>Call Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Customer Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Customer</DialogTitle>
            <DialogDescription>
              Send an email to {customerName} at {email}.
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
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEmailCustomer} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
