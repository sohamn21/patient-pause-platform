
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
  Eye, 
  Mail, 
  Phone, 
  SendHorizonal, 
  MoreVertical, 
  UserCheck, 
  X, 
  UserMinus 
} from "lucide-react";
import { WaitlistEntryType } from "@/components/restaurant/types";

interface ActionMenuProps {
  entry: WaitlistEntryType;
  onViewDetails: () => void;
  onNotify: () => void;
  onCall: () => void;
  onEmail: () => void;
  onStatusChange: (id: string, status: "waiting" | "notified" | "seated" | "cancelled") => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export function ActionMenu({
  entry,
  onViewDetails,
  onNotify,
  onCall,
  onEmail,
  onStatusChange,
  onRemove
}: ActionMenuProps) {
  const phoneNumber = entry.profiles?.phone_number || "";
  
  // Always enable email button regardless of email presence
  // The Email dialog will handle the case when email is not available
  const canEmail = entry.status !== "seated" && entry.status !== "cancelled";

  console.log("ActionMenu - Entry:", {
    id: entry.id,
    customerName: entry.profiles?.first_name,
    email: entry.profiles?.email,
    phoneNumber: phoneNumber,
    status: entry.status,
    canEmail: canEmail
  });

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        size="icon" 
        variant="ghost"
        onClick={onEmail}
        disabled={!canEmail}
        title={canEmail ? "Email customer" : "Customer already seated/cancelled"}
      >
        <Mail size={16} className={!canEmail ? "text-muted-foreground" : ""} />
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
          <DropdownMenuItem onClick={onViewDetails}>
            <Eye size={14} className="mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onEmail}
            disabled={!canEmail}
          >
            <Mail size={14} className="mr-2" />
            Email Customer
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onNotify}
            disabled={entry.status === "seated" || entry.status === "cancelled" || !phoneNumber}
          >
            <SendHorizonal size={14} className="mr-2" />
            Send SMS Notification
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onCall}
            disabled={!phoneNumber}
          >
            <Phone size={14} className="mr-2" />
            Call Customer
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
  );
}
