
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FloorItem } from "./types";

interface TableReservationProps {
  tableItem: FloorItem;
  onReserve: (tableId: string, data: ReservationData) => void;
}

export interface ReservationData {
  tableId: string;
  customerName: string;
  date: Date;
  time: string;
  partySize: number;
  notes?: string;
}

export function TableReservation({ tableItem, onReserve }: TableReservationProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !customerName || partySize <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Check if party size exceeds table capacity
    if (tableItem.capacity && partySize > tableItem.capacity) {
      toast({
        title: "Party Too Large",
        description: `This table can only accommodate ${tableItem.capacity} guests`,
        variant: "destructive"
      });
      return;
    }
    
    onReserve(tableItem.id, {
      tableId: tableItem.id,
      customerName,
      date,
      time,
      partySize,
      notes
    });
    
    setOpen(false);
    
    toast({
      title: "Reservation Created",
      description: `Table ${tableItem.number} has been reserved for ${customerName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          Reserve Table {tableItem.number}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reserve Table {tableItem.number}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input 
                id="customerName" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size</Label>
              <Input 
                id="partySize" 
                type="number" 
                min={1} 
                max={tableItem.capacity || 10} 
                value={partySize} 
                onChange={(e) => setPartySize(Number(e.target.value))} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Input 
                  id="time" 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required 
                  className="pl-10" 
                />
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm Reservation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
