
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Define an appointment data structure
interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: Date;
  time: string;
  duration: number;
  status: "confirmed" | "cancelled" | "completed" | "no-show";
  notes?: string;
}

const AppointmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  
  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: "1", 
      customerName: "John Smith", 
      service: "Table Reservation", 
      date: new Date(), 
      time: "12:30 PM", 
      duration: 90, 
      status: "confirmed" 
    },
    { 
      id: "2", 
      customerName: "Emily Johnson", 
      service: "Lunch Reservation", 
      date: new Date(), 
      time: "1:15 PM", 
      duration: 60, 
      status: "confirmed" 
    },
    { 
      id: "3", 
      customerName: "Michael Brown", 
      service: "Dinner Reservation", 
      date: new Date(), 
      time: "7:30 PM", 
      duration: 120, 
      status: "confirmed",
      notes: "Window table requested" 
    },
    { 
      id: "4", 
      customerName: "Sarah Williams", 
      service: "Table Reservation", 
      date: new Date(new Date().setDate(new Date().getDate() + 1)), 
      time: "6:45 PM", 
      duration: 90, 
      status: "confirmed" 
    },
    { 
      id: "5", 
      customerName: "David Wilson", 
      service: "Private Dining", 
      date: new Date(new Date().setDate(new Date().getDate() - 1)), 
      time: "8:00 PM", 
      duration: 180, 
      status: "completed" 
    },
    { 
      id: "6", 
      customerName: "Jennifer Lee", 
      service: "Table Reservation", 
      date: new Date(new Date().setDate(new Date().getDate() - 1)), 
      time: "7:15 PM", 
      duration: 90, 
      status: "no-show" 
    },
  ]);
  
  const [newAppointment, setNewAppointment] = useState({
    customerName: "",
    service: "",
    date: new Date(),
    time: "",
    duration: "60",
    notes: ""
  });

  const filteredAppointments = appointments.filter(appointment => {
    // Filter by search
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date
    const matchesDate = isSameDay(appointment.date, selectedDate);
    
    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Completed</Badge>;
      case "no-show":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddAppointment = () => {
    const id = (appointments.length + 1).toString();
    
    const appointment: Appointment = {
      id,
      customerName: newAppointment.customerName,
      service: newAppointment.service,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: parseInt(newAppointment.duration),
      status: "confirmed",
      notes: newAppointment.notes || undefined
    };
    
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      customerName: "",
      service: "",
      date: new Date(),
      time: "",
      duration: "60",
      notes: ""
    });
    setShowAddDialog(false);
    
    toast({
      title: "Appointment Added",
      description: `Appointment for ${appointment.customerName} has been scheduled.`,
    });
  };

  const handleStatusChange = (id: string, status: "confirmed" | "cancelled" | "completed" | "no-show") => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    
    toast({
      title: "Status Updated",
      description: `Appointment status has been updated to ${status}.`,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = addDays(selectedDate, days);
    setSelectedDate(newDate);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your customer reservations and appointments.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Enter appointment details to schedule a new reservation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">Customer</Label>
                <Input
                  id="customerName"
                  value={newAppointment.customerName}
                  onChange={e => setNewAppointment({...newAppointment, customerName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">Service</Label>
                <Select 
                  value={newAppointment.service}
                  onValueChange={value => setNewAppointment({...newAppointment, service: value})}
                >
                  <SelectTrigger id="service" className="col-span-3">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table Reservation">Table Reservation</SelectItem>
                    <SelectItem value="Private Dining">Private Dining</SelectItem>
                    <SelectItem value="Lunch Reservation">Lunch Reservation</SelectItem>
                    <SelectItem value="Dinner Reservation">Dinner Reservation</SelectItem>
                    <SelectItem value="Special Event">Special Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="col-span-3 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAppointment.date ? format(newAppointment.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAppointment.date}
                      onSelect={(date) => date && setNewAppointment({...newAppointment, date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input
                  id="time"
                  value={newAppointment.time}
                  onChange={e => setNewAppointment({...newAppointment, time: e.target.value})}
                  placeholder="e.g. 7:30 PM"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration (min)</Label>
                <Select 
                  value={newAppointment.duration}
                  onValueChange={value => setNewAppointment({...newAppointment, duration: value})}
                >
                  <SelectTrigger id="duration" className="col-span-3">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Input
                  id="notes"
                  value={newAppointment.notes}
                  onChange={e => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddAppointment}>Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon size={16} />
            <span>Calendar View</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clock size={16} />
            <span>List View</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
                    <ArrowLeft size={16} />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="min-w-[240px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
                    <ArrowRight size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
                    Today
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search appointments..."
                    className="max-w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="text-center py-10 text-muted-foreground">
                Calendar view implementation would show a full day calendar here with appointment slots
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <BlurCardTitle>Appointments for {format(selectedDate, "MMMM d, yyyy")}</BlurCardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search appointments..."
                    className="max-w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-center">Duration</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length > 0 ? filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2 text-muted-foreground" />
                            {appointment.time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-muted-foreground" />
                            <span className="font-medium">{appointment.customerName}</span>
                          </div>
                          {appointment.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {appointment.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell className="text-center">{appointment.duration} min</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <span className="sr-only">Actions</span>
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                Edit Appointment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "confirmed")}>
                                <CheckCircle size={14} className="mr-2 text-green-500" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "completed")}>
                                <CheckCircle size={14} className="mr-2 text-blue-500" />
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "cancelled")}>
                                <XCircle size={14} className="mr-2 text-red-500" />
                                Cancel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "no-show")}>
                                <XCircle size={14} className="mr-2 text-orange-500" />
                                Mark as No-Show
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No appointments found for this date. Try another date or add a new appointment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
