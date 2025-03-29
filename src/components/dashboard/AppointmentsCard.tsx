
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Calendar, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  time: string;
  name: string;
  service: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface AppointmentsCardProps {
  upcomingAppointments: Appointment[];
}

export function AppointmentsCard({ upcomingAppointments }: AppointmentsCardProps) {
  return (
    <BlurCard className="h-full">
      <BlurCardHeader className="flex flex-row items-start justify-between">
        <BlurCardTitle className="text-base sm:text-lg">Upcoming Appointments</BlurCardTitle>
        <div className="rounded-full bg-muted p-1.5 text-muted-foreground">
          <Calendar size={18} />
        </div>
      </BlurCardHeader>
      <BlurCardContent>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-sm font-medium">No appointments</h3>
              <p className="text-xs text-muted-foreground">
                Schedule a new appointment to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{appointment.name}</p>
                      <p className="text-xs text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{appointment.time}</p>
                    <p
                      className={cn("text-xs", {
                        "text-green-500": appointment.status === "confirmed",
                        "text-yellow-500": appointment.status === "pending",
                        "text-red-500": appointment.status === "cancelled",
                      })}
                    >
                      {appointment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
          <GlowButton 
            className="w-full" 
            glowColor="from-secondary/40 via-secondary/10 to-transparent"
            variant="secondary"
          >
            <CalendarPlus size={16} className="mr-2" />
            Schedule Appointment
          </GlowButton>
        </div>
      </BlurCardContent>
    </BlurCard>
  );
}
