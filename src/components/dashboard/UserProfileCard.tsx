
import React from "react";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CalendarDays, Phone, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";

interface Visit {
  id: string;
  date: Date;
  service: string;
  status: "completed" | "cancelled" | "no-show";
}

interface UserProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  preferredService?: string;
  preferredStaff?: string;
  visits: Visit[];
  onBookAppointment: () => void;
}

export function UserProfileCard({
  id,
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
  preferredService,
  preferredStaff,
  visits,
  onBookAppointment
}: UserProfileProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      case "no-show":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <BlurCard>
      <BlurCardHeader>
        <BlurCardTitle>Customer Profile</BlurCardTitle>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-lg">{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{fullName}</h3>
            <Button variant="outline" size="sm" className="w-full" onClick={onBookAppointment}>
              Book Appointment
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{phone}</span>
                </div>
              )}
              
              {email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{email}</span>
                </div>
              )}
              
              {preferredService && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>Prefers: {preferredService}</span>
                </div>
              )}
              
              {preferredStaff && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  <span>Preferred Staff: {preferredStaff}</span>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CalendarDays size={16} />
                Visit History
              </h4>
              
              {visits.length > 0 ? (
                <div className="space-y-3">
                  {visits.slice(0, 3).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between text-sm border-b pb-2">
                      <div>
                        <div className="font-medium">{visit.service}</div>
                        <div className="text-muted-foreground">{format(visit.date, "PPP")}</div>
                      </div>
                      <div>
                        {getStatusBadge(visit.status)}
                      </div>
                    </div>
                  ))}
                  
                  {visits.length > 3 && (
                    <Button variant="ghost" size="sm" className="mt-2 w-full">
                      View All History
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No previous visits recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </BlurCardContent>
    </BlurCard>
  );
}
