import { useState, useEffect } from "react";
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
  ListFilter
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
import { useAuth } from "@/context/AuthContext";
import { getWaitlistEntries, updateWaitlistEntry, removeFromWaitlist, addToWaitlist } from "@/lib/waitlistService";
import { createNotification } from "@/lib/notificationService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WaitlistEntry {
  id: string;
  user_id: string;
  waitlist_id: string;
  position: number;
  status: "waiting" | "notified" | "seated" | "cancelled";
  estimated_wait_time?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
}

const Waitlist = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    phone: "",
    email: "",
    partySize: 1,
    notes: ""
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchWaitlistEntries();
  }, []);

  const fetchWaitlistEntries = async () => {
    try {
      setIsLoading(true);
      // Assuming we're using the first waitlist for now
      // In a real app, you'd select the waitlist or pass it as a parameter
      const entries = await getWaitlistEntries("some-waitlist-id");
      
      // Ensure entries have the correct status type
      const typedEntries = entries.map(entry => ({
        ...entry,
        status: entry.status as "waiting" | "notified" | "seated" | "cancelled"
      }));
      
      setWaitlistEntries(typedEntries);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      toast({
        title: "Error",
        description: "Failed to load waitlist entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: "waiting" | "notified" | "seated" | "cancelled") => {
    try {
      await updateWaitlistEntry(id, { status });
      
      // Find the entry and the user to notify
      const entry = waitlistEntries.find(e => e.id === id);
      if (entry && entry.user_id) {
        // Create a notification for the user
        const notificationData = {
          user_id: entry.user_id,
          title: "Waitlist Status Update",
          message: `Your waitlist status has been updated to ${status}.`,
          type: "waitlist_update"
        };
        
        await createNotification(notificationData);
      }
      
      // Update the local state
      setWaitlistEntries(prev => 
        prev.map(entry => entry.id === id ? { ...entry, status } : entry)
      );
      
      toast({
        title: "Status Updated",
        description: `Entry status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWaitlist = async (id: string) => {
    try {
      await removeFromWaitlist(id);
      
      // Find the entry and the user to notify
      const entry = waitlistEntries.find(e => e.id === id);
      if (entry && entry.user_id) {
        // Create a notification for the user
        const notificationData = {
          user_id: entry.user_id,
          title: "Removed from Waitlist",
          message: "You have been removed from the waitlist.",
          type: "waitlist_removal"
        };
        
        await createNotification(notificationData);
      }
      
      // Update the local state
      setWaitlistEntries(prev => prev.filter(entry => entry.id !== id));
      
      toast({
        title: "Entry Removed",
        description: "Entry has been removed from the waitlist",
      });
    } catch (error) {
      console.error("Error removing entry:", error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove entry from waitlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToWaitlist = async () => {
    try {
      // In a real app, you would create a user or find existing user
      // Here we're simulating adding a guest to the waitlist
      const entryData = {
        waitlist_id: "some-waitlist-id",
        user_id: "guest-user-id", // This should be a real user ID in production
        notes: newEntry.notes,
        estimated_wait_time: 15, // Example estimated wait time
      };
      
      await addToWaitlist(entryData);
      setIsAddDialogOpen(false);
      setNewEntry({
        name: "",
        phone: "",
        email: "",
        partySize: 1,
        notes: ""
      });
      
      toast({
        title: "Added to Waitlist",
        description: `${newEntry.name} has been added to the waitlist`,
      });
      
      // Refresh the list
      fetchWaitlistEntries();
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Addition Failed",
        description: "Failed to add to waitlist",
        variant: "destructive",
      });
    }
  };

  // Filter by status and search query
  const filteredEntries = waitlistEntries.filter(entry => {
    // Filter by status
    if (statusFilter !== "all" && entry.status !== statusFilter) {
      return false;
    }

    // Search by name or phone
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${entry.profiles.first_name || ""} ${entry.profiles.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(query) ||
        (entry.profiles.phone_number || "").includes(query) ||
        (entry.profiles.username || "").toLowerCase().includes(query)
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

  const getWaitMetrics = () => {
    const waitingEntries = waitlistEntries.filter(entry => entry.status === "waiting");
    const avgWaitTime = waitingEntries.reduce((sum, entry) => sum + (entry.estimated_wait_time || 0), 0) / (waitingEntries.length || 1);
    
    return {
      currentlyWaiting: waitingEntries.length,
      avgWaitTime: Math.round(avgWaitTime),
      servedToday: waitlistEntries.filter(entry => entry.status === "seated").length
    };
  };

  const waitMetrics = getWaitMetrics();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-muted-foreground">
            Manage your current waitlist and customer queue.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <GlowButton>
              <UserPlus size={16} className="mr-2" />
              Add to Waitlist
            </GlowButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Waitlist</DialogTitle>
              <DialogDescription>
                Enter customer details to add them to the waitlist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({...newEntry, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newEntry.email}
                  onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="party-size" className="text-right">
                  Party Size
                </Label>
                <Select 
                  value={newEntry.partySize.toString()} 
                  onValueChange={(value) => setNewEntry({...newEntry, partySize: parseInt(value)})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Party Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddToWaitlist}>Add to Waitlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <BlurCard>
          <BlurCardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently Waiting</p>
              <h3 className="text-2xl font-bold">{waitMetrics.currentlyWaiting}</h3>
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
              <h3 className="text-2xl font-bold">{waitMetrics.avgWaitTime} min</h3>
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
              <h3 className="text-2xl font-bold">{waitMetrics.servedToday}</h3>
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
                    <Button variant="outline" size="icon">
                      <ListFilter size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Loading waitlist entries...</p>
                </div>
              ) : filteredEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Customer</TableHead>
                        <TableHead className="text-center">Position</TableHead>
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
                              <span className="font-medium">
                                {entry.profiles.first_name} {entry.profiles.last_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {entry.profiles.phone_number}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                {entry.position}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                <Clock size={12} className="mr-1" />
                                {entry.estimated_wait_time || "--"} min
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(entry.status)}
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleStatusChange(entry.id, "notified")}
                                disabled={entry.status !== "waiting"}
                              >
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
                                  <DropdownMenuItem onClick={() => handleStatusChange(entry.id, "notified")}>
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
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(entry.id, "seated")}
                                    disabled={entry.status === "seated" || entry.status === "cancelled"}
                                  >
                                    Mark as Seated
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(entry.id, "cancelled")}
                                    disabled={entry.status === "cancelled"}
                                    className="text-red-500"
                                  >
                                    Cancel
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleRemoveFromWaitlist(entry.id)}
                                    className="text-red-500"
                                  >
                                    Remove from Waitlist
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
              ) : (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      No waitlist entries found.
                    </p>
                  </div>
                </div>
              )}
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
