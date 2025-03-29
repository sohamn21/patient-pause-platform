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
  ListFilter,
  Plus,
  QrCode,
  Share
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
import { createWaitlist, getBusinessWaitlists, getWaitlistEntries, updateWaitlistEntry, removeFromWaitlist, addToWaitlist } from "@/lib/waitlistService";
import { createNotification } from "@/lib/notificationService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WaitlistCard } from "@/components/dashboard/WaitlistCard";
import { Progress } from "@/components/ui/progress";
import QRCode from "react-qr-code";

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

interface WaitlistData {
  id: string;
  name: string;
  description?: string;
  max_capacity?: number;
  is_active: boolean;
  created_at: string;
}

const Waitlist = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [waitlists, setWaitlists] = useState<WaitlistData[]>([]);
  const [selectedWaitlist, setSelectedWaitlist] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCreateWaitlistOpen, setIsCreateWaitlistOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    phone: "",
    email: "",
    partySize: 1,
    notes: ""
  });
  const [newWaitlist, setNewWaitlist] = useState({
    name: "",
    description: "",
    max_capacity: 50,
    is_active: true
  });
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBusinessWaitlists();
  }, [user]);

  useEffect(() => {
    if (selectedWaitlist) {
      fetchWaitlistEntries(selectedWaitlist);
    }
  }, [selectedWaitlist]);

  const fetchBusinessWaitlists = async () => {
    try {
      setIsLoading(true);
      if (user) {
        const data = await getBusinessWaitlists(user.id);
        setWaitlists(data || []);
        
        if (data && data.length > 0) {
          setSelectedWaitlist(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching waitlists:", error);
      toast({
        title: "Error",
        description: "Failed to load waitlists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWaitlistEntries = async (waitlistId: string) => {
    try {
      setIsLoading(true);
      const entries = await getWaitlistEntries(waitlistId);
      
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
      
      const entry = waitlistEntries.find(e => e.id === id);
      if (entry && entry.user_id) {
        const notificationData = {
          user_id: entry.user_id,
          title: "Waitlist Status Update",
          message: `Your waitlist status has been updated to ${status}.`,
          type: "waitlist_update"
        };
        
        await createNotification(notificationData);
      }
      
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
      
      const entry = waitlistEntries.find(e => e.id === id);
      if (entry && entry.user_id) {
        const notificationData = {
          user_id: entry.user_id,
          title: "Removed from Waitlist",
          message: "You have been removed from the waitlist.",
          type: "waitlist_removal"
        };
        
        await createNotification(notificationData);
      }
      
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
      if (!selectedWaitlist) {
        toast({
          title: "No Waitlist Selected",
          description: "Please select a waitlist first",
          variant: "destructive",
        });
        return;
      }
      
      const entryData = {
        waitlist_id: selectedWaitlist,
        user_id: user?.id || "guest-user-id",
        notes: newEntry.notes,
        estimated_wait_time: 15,
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
      
      await fetchWaitlistEntries(selectedWaitlist);
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Addition Failed",
        description: "Failed to add to waitlist",
        variant: "destructive",
      });
    }
  };

  const handleCreateWaitlist = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create a waitlist",
          variant: "destructive",
        });
        return;
      }
      
      const waitlistData = {
        business_id: user.id,
        name: newWaitlist.name,
        description: newWaitlist.description,
        max_capacity: newWaitlist.max_capacity,
        is_active: newWaitlist.is_active
      };
      
      const createdWaitlist = await createWaitlist(waitlistData);
      setIsCreateWaitlistOpen(false);
      setNewWaitlist({
        name: "",
        description: "",
        max_capacity: 50,
        is_active: true
      });
      
      toast({
        title: "Waitlist Created",
        description: `${newWaitlist.name} waitlist has been created`,
      });
      
      await fetchBusinessWaitlists();
      setSelectedWaitlist(createdWaitlist.id);
    } catch (error) {
      console.error("Error creating waitlist:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create waitlist",
        variant: "destructive",
      });
    }
  };

  const generateWaitlistQRCode = (waitlistId: string) => {
    const url = `${window.location.origin}/join-waitlist/${waitlistId}`;
    setShareUrl(url);
    setIsQrDialogOpen(true);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join our waitlist',
          text: 'Scan this QR code to join our waitlist',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Waitlist join link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const filteredEntries = waitlistEntries.filter(entry => {
    if (statusFilter !== "all" && entry.status !== statusFilter) {
      return false;
    }

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
  const selectedWaitlistData = waitlists.find(w => w.id === selectedWaitlist);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist Management</h1>
          <p className="text-muted-foreground">
            Manage your waitlists and customer queue in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateWaitlistOpen} onOpenChange={setIsCreateWaitlistOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus size={16} className="mr-2" />
                New Waitlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Waitlist</DialogTitle>
                <DialogDescription>
                  Create a new waitlist for your business.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="waitlist-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="waitlist-name"
                    value={newWaitlist.name}
                    onChange={(e) => setNewWaitlist({...newWaitlist, name: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g. Dinner Service"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="waitlist-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="waitlist-description"
                    value={newWaitlist.description}
                    onChange={(e) => setNewWaitlist({...newWaitlist, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="waitlist-capacity" className="text-right">
                    Max Capacity
                  </Label>
                  <Input
                    id="waitlist-capacity"
                    type="number"
                    value={newWaitlist.max_capacity}
                    onChange={(e) => setNewWaitlist({...newWaitlist, max_capacity: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="waitlist-active" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={newWaitlist.is_active ? "active" : "inactive"} 
                    onValueChange={(value) => setNewWaitlist({...newWaitlist, is_active: value === "active"})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateWaitlistOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateWaitlist}>Create Waitlist</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
                  <Label htmlFor="waitlist-select" className="text-right">
                    Waitlist
                  </Label>
                  <Select 
                    value={selectedWaitlist} 
                    onValueChange={setSelectedWaitlist}
                    disabled={waitlists.length === 0}>
                    <SelectTrigger id="waitlist-select" className="col-span-3">
                      <SelectValue placeholder={waitlists.length === 0 ? "No waitlists available" : "Select waitlist"} />
                    </SelectTrigger>
                    <SelectContent>
                      {waitlists.map((waitlist) => (
                        <SelectItem key={waitlist.id} value={waitlist.id}>
                          {waitlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
          
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Waitlist QR Code</DialogTitle>
                <DialogDescription>
                  Share this QR code to let customers join your waitlist
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-6 py-4">
                <div className="p-3 bg-white rounded-lg">
                  <QRCode
                    value={shareUrl}
                    size={200}
                    level="H"
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  <p>Or share this link:</p>
                  <p className="font-mono text-xs mt-1 break-all">{shareUrl}</p>
                </div>
              </div>
              <DialogFooter className="flex sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsQrDialogOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {waitlists.length > 0 ? (
        <>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="active-waitlist" className="mb-2 block">Active Waitlist</Label>
                <Select value={selectedWaitlist} onValueChange={setSelectedWaitlist}>
                  <SelectTrigger id="active-waitlist" className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select waitlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {waitlists.map((waitlist) => (
                      <SelectItem key={waitlist.id} value={waitlist.id}>
                        {waitlist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedWaitlistData && (
                <div className="flex-shrink-0 text-sm">
                  <Badge variant={selectedWaitlistData.is_active ? "default" : "secondary"}>
                    {selectedWaitlistData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              )}
            </div>
            
            {selectedWaitlistData?.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedWaitlistData.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <WaitlistCard 
              count={waitMetrics.currentlyWaiting} 
              capacity={selectedWaitlistData?.max_capacity || 50} 
              avgWaitTime={waitMetrics.avgWaitTime} 
            />
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

          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => selectedWaitlist ? generateWaitlistQRCode(selectedWaitlist) : null}
              disabled={!selectedWaitlist}
              variant="outline"
            >
              <QrCode size={16} className="mr-2" />
              Generate QR Code
            </Button>
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
                        <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                          <UserPlus size={16} className="mr-2" />
                          Add Customer
                        </Button>
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
        </>
      ) : isLoading ? (
        <BlurCard>
          <BlurCardContent className="p-8">
            <div className="flex justify-center items-center">
              <p>Loading waitlists...</p>
            </div>
          </BlurCardContent>
        </BlurCard>
      ) : (
        <BlurCard>
          <BlurCardContent className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Waitlists Found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any waitlists yet. Create your first waitlist to get started.
              </p>
              <Button onClick={() => setIsCreateWaitlistOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Your First Waitlist
              </Button>
            </div>
          </BlurCardContent>
        </BlurCard>
      )}
    </div>
  );
};

export default Waitlist;
