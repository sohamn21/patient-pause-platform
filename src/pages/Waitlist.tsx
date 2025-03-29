
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/glow-button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  UserPlus, 
  Clock, 
  SendHorizonal, 
  User, 
  Phone, 
  Users, 
  Mail, 
  ListFilter, 
  Scissors, 
  Stethoscope, 
  UtensilsCrossed
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  service: string;
  waitTime: number;
  status: "waiting" | "notified" | "seated" | "cancelled";
  estimatedTime: string;
  timeAdded: string;
  notes?: string;
}

const Waitlist = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "(555) 123-4567",
      partySize: 3,
      service: "Haircut",
      waitTime: 15,
      status: "waiting",
      estimatedTime: "10:30 AM",
      timeAdded: "10:05 AM",
      notes: "First time customer"
    },
    {
      id: "2",
      name: "Emily Johnson",
      phone: "(555) 234-5678",
      partySize: 1,
      service: "Dental Checkup",
      waitTime: 20,
      status: "notified",
      estimatedTime: "10:45 AM",
      timeAdded: "10:10 AM"
    },
    {
      id: "3",
      name: "Michael Brown",
      phone: "(555) 345-6789",
      partySize: 4,
      service: "Dinner",
      waitTime: 30,
      status: "waiting",
      estimatedTime: "11:00 AM",
      timeAdded: "10:15 AM",
      notes: "Window table requested"
    },
    {
      id: "4",
      name: "Sofia Martinez",
      phone: "(555) 456-7890",
      partySize: 2,
      service: "Manicure",
      waitTime: 10,
      status: "seated",
      estimatedTime: "10:35 AM",
      timeAdded: "10:20 AM"
    },
    {
      id: "5",
      name: "David Wilson",
      phone: "(555) 567-8901",
      partySize: 2,
      service: "Dinner",
      waitTime: 35,
      status: "waiting",
      estimatedTime: "11:10 AM",
      timeAdded: "10:25 AM"
    }
  ]);

  // Filter by status
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredEntries = waitlistEntries.filter(entry => {
    // Filter by status
    if (statusFilter !== "all" && entry.status !== statusFilter) {
      return false;
    }

    // Filter by service
    if (serviceFilter !== "all" && entry.service !== serviceFilter) {
      return false;
    }

    // Search by name or phone
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.name.toLowerCase().includes(query) ||
        entry.phone.includes(query)
      );
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Waiting</Badge>;
      case "notified":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Notified</Badge>;
      case "seated":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Seated</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case "haircut":
        return <Scissors size={14} />;
      case "dental checkup":
        return <Stethoscope size={14} />;
      case "dinner":
      case "lunch":
        return <UtensilsCrossed size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-muted-foreground">
            Manage your current waitlist and customer queue.
          </p>
        </div>
        <GlowButton>
          <UserPlus size={16} className="mr-2" />
          Add to Waitlist
        </GlowButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently Waiting</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <div className="rounded-full bg-yellow-500/10 p-2 text-yellow-500">
              <Clock size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Wait Time</p>
              <h3 className="text-2xl font-bold">24 min</h3>
            </div>
            <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
              <Clock size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Served Today</p>
              <h3 className="text-2xl font-bold">45</h3>
            </div>
            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
              <Users size={18} />
            </div>
          </BlurCardContent>
        </BlurCard>
      </div>

      <Tabs defaultValue="waitlist" className="mb-6">
        <TabsList>
          <TabsTrigger value="waitlist">Current Waitlist</TabsTrigger>
          <TabsTrigger value="history">Today's History</TabsTrigger>
        </TabsList>
        <TabsContent value="waitlist" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <BlurCardTitle>Current Queue</BlurCardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Search by name or phone..."
                    className="max-w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="notified">Notified</SelectItem>
                        <SelectItem value="seated">Seated</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Filter Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="Haircut">Haircut</SelectItem>
                        <SelectItem value="Dental Checkup">Dental</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Manicure">Manicure</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <ListFilter size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-center">Size</TableHead>
                      <TableHead className="text-center">Wait Time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Time Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{entry.name}</span>
                            <span className="text-xs text-muted-foreground">{entry.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getServiceIcon(entry.service)}
                            <span>{entry.service}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Badge variant="outline" className="bg-background">
                              <Users size={12} className="mr-1" />
                              {entry.partySize}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Badge variant="outline" className="bg-background">
                              <Clock size={12} className="mr-1" />
                              {entry.waitTime} min
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(entry.status)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {entry.timeAdded}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="ghost">
                              <SendHorizonal size={16} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <span className="sr-only">Actions</span>
                                  <span className="h-4 w-4">⋯</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <User size={14} className="mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <SendHorizonal size={14} className="mr-2" />
                                  Send Notification
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone size={14} className="mr-2" />
                                  Call Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail size={14} className="mr-2" />
                                  Email Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Today's Waitlist History</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Waitlist history will show completed and cancelled entries for today.
                  </p>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Waitlist;
