
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useReservations } from "@/hooks/use-reservations";
import { CalendarClock, Users, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ReservationsList() {
  const { reservations, loading, fetchReservations, updateTableStatus } = useReservations();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleSeatGuests = (tableId: string) => {
    updateTableStatus(tableId, 'occupied');
  };

  const handleCancelReservation = (tableId: string) => {
    updateTableStatus(tableId, 'available');
  };

  const getUpcomingReservations = () => {
    const now = new Date();
    return reservations
      .filter(res => {
        const reservationDate = new Date(res.date);
        reservationDate.setHours(
          parseInt(res.time.split(':')[0]),
          parseInt(res.time.split(':')[1])
        );
        return reservationDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        dateA.setHours(parseInt(a.time.split(':')[0]), parseInt(a.time.split(':')[1]));
        dateB.setHours(parseInt(b.time.split(':')[0]), parseInt(b.time.split(':')[1]));
        return dateA.getTime() - dateB.getTime();
      });
  };

  const upcomingReservations = getUpcomingReservations();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading reservations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingReservations.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No upcoming reservations</p>
        ) : (
          <div className="space-y-4">
            {upcomingReservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between border rounded-md p-4">
                <div className="space-y-1">
                  <div className="font-medium">{reservation.customerName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(reservation.date), "MMM d")} at {reservation.time}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      Party of {reservation.partySize} • Table {reservation.tableId.slice(-2)}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSeatGuests(reservation.tableId)}>
                      Seat Guests
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCancelReservation(reservation.tableId)}>
                      Cancel Reservation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
