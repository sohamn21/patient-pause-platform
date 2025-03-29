
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/glow-button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  UserPlus, 
  Clock, 
  Users, 
  Plus,
  QrCode,
  Share,
  ListFilter,
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
import { useAuth } from "@/context/AuthContext";
import { createWaitlist, getBusinessWaitlists, getWaitlistEntries, updateWaitlistEntry, removeFromWaitlist, addToWaitlist } from "@/lib/waitlistService";
import { createNotification } from "@/lib/notificationService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WaitlistCard } from "@/components/dashboard/WaitlistCard";
import QRCode from "react-qr-code";
import { WaitlistActions } from "@/components/restaurant/WaitlistActions";
import { WaitlistEntryType } from "@/components/restaurant/types";

const WaitlistPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeWaitlist, setActiveWaitlist] = useState<string | null>(null);
  const [waitlists, setWaitlists] = useState<any[]>([]);
  const [entries, setEntries] = useState<WaitlistEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isCreateWaitlistOpen, setIsCreateWaitlistOpen] = useState(false);
  const [isShareQROpen, setIsShareQROpen] = useState(false);
  const [entryForm, setEntryForm] = useState({
    customer_name: "",
    party_size: "1",
    phone_number: "",
    notes: ""
  });
  const [waitlistForm, setWaitlistForm] = useState({
    name: "",
    description: "",
    max_capacity: "50"
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      loadWaitlists();
    }
  }, [user]);

  useEffect(() => {
    if (activeWaitlist) {
      loadWaitlistEntries();
    }
  }, [activeWaitlist, filter]);

  const loadWaitlists = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await getBusinessWaitlists(user.id);
      setWaitlists(data);
      
      if (data.length > 0 && !activeWaitlist) {
        setActiveWaitlist(data[0].id);
      }
    } catch (error) {
      console.error("Error loading waitlists:", error);
      toast({
        title: "Error",
        description: "Failed to load waitlists",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWaitlistEntries = async () => {
    if (!activeWaitlist) return;
    
    try {
      setIsLoading(true);
      const data = await getWaitlistEntries(activeWaitlist);
      
      // Apply filters
      let filteredData = data;
      if (filter === "waiting") {
        filteredData = data.filter(entry => entry.status === "waiting");
      } else if (filter === "notified") {
        filteredData = data.filter(entry => entry.status === "notified");
      } else if (filter === "seated") {
        filteredData = data.filter(entry => entry.status === "seated");
      }
      
      // Cast the status to ensure it matches our type definition
      const typedEntries: WaitlistEntryType[] = filteredData.map(entry => ({
        ...entry,
        status: entry.status as "waiting" | "notified" | "seated" | "cancelled"
      }));
      
      setEntries(typedEntries);
    } catch (error) {
      console.error("Error loading waitlist entries:", error);
      toast({
        title: "Error",
        description: "Failed to load waitlist entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWaitlist = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const newWaitlist = await createWaitlist({
        business_id: user.id,
        name: waitlistForm.name,
        description: waitlistForm.description,
        max_capacity: parseInt(waitlistForm.max_capacity),
        is_active: true
      });
      
      setWaitlists([newWaitlist, ...waitlists]);
      setActiveWaitlist(newWaitlist.id);
      setIsCreateWaitlistOpen(false);
      
      // Reset form
      setWaitlistForm({
        name: "",
        description: "",
        max_capacity: "50"
      });
      
      toast({
        title: "Success",
        description: "Waitlist created successfully"
      });
    } catch (error) {
      console.error("Error creating waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to create waitlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWaitlist = async () => {
    if (!activeWaitlist) return;
    
    try {
      setIsLoading(true);
      
      // This is a simplified version for demo purposes
      // In a real app, you'd create or look up the user first
      
      // Create a temporary user ID for demo purposes
      // In a real app, this would be a real user ID from your authentication system
      const tempUserId = `temp-${Date.now()}`;
      
      const newEntry = await addToWaitlist({
        waitlist_id: activeWaitlist,
        user_id: tempUserId,
        notes: entryForm.notes,
        status: "waiting"
      });
      
      // Reload entries to get the updated list with positions
      await loadWaitlistEntries();
      
      setIsAddEntryOpen(false);
      
      // Reset form
      setEntryForm({
        customer_name: "",
        party_size: "1",
        phone_number: "",
        notes: ""
      });
      
      toast({
        title: "Success",
        description: "Customer added to waitlist"
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to add to waitlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateWaitlistEntry(id, { status: status as "waiting" | "notified" | "seated" | "cancelled" });
      
      // Update local state
      setEntries(entries.map(entry => 
        entry.id === id ? { ...entry, status: status as "waiting" | "notified" | "seated" | "cancelled" } : entry
      ));
      
      toast({
        title: "Status Updated",
        description: `Customer marked as ${status}`
      });
      
      // If status is seated or cancelled, and filter is not showing these, refresh the list
      if ((status === "seated" || status === "cancelled") && filter !== "all") {
        loadWaitlistEntries();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromWaitlist = async (id: string) => {
    try {
      await removeFromWaitlist(id);
      
      // Update local state
      setEntries(entries.filter(entry => entry.id !== id));
      
      toast({
        title: "Removed",
        description: "Customer removed from waitlist"
      });
    } catch (error) {
      console.error("Error removing from waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove from waitlist",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Waiting</Badge>;
      case "notified":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Notified</Badge>;
      case "seated":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Seated</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWaitlistShareUrl = (waitlistId: string) => {
    return `${window.location.origin}/join-waitlist/${waitlistId}`;
  };

  const handleCopyShareLink = () => {
    if (!activeWaitlist) return;
    
    const shareUrl = getWaitlistShareUrl(activeWaitlist);
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Waitlist join link copied to clipboard"
    });
  };

  const getCurrentWaitlist = () => {
    return waitlists.find(w => w.id === activeWaitlist);
  };

  const getWaitingCount = () => {
    return entries.filter(entry => entry.status === "waiting" || entry.status === "notified").length;
  };

  const getAverageWaitTime = () => {
    // This would normally be calculated based on historical data
    // For demo purposes, we'll use a simple formula
    return Math.max(5, getWaitingCount() * 5); // 5 minutes minimum, 5 minutes per person
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Waitlist Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's waitlist and notify customers when their table is ready.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateWaitlistOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            New Waitlist
          </Button>
          
          <Button 
            onClick={() => setIsAddEntryOpen(true)}
            disabled={!activeWaitlist}
          >
            <UserPlus size={16} className="mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waitlist Stats Card */}
        <div className="lg:col-span-1">
          <WaitlistCard 
            count={getWaitingCount()}
            capacity={getCurrentWaitlist()?.max_capacity || 50}
            avgWaitTime={getAverageWaitTime()}
            location={getCurrentWaitlist()?.name}
            onAddClick={() => setIsAddEntryOpen(true)}
          />
          
          <BlurCard className="mt-6">
            <BlurCardHeader>
              <BlurCardTitle className="text-base sm:text-lg">
                Share Waitlist
              </BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Allow customers to join your waitlist by sharing the link or QR code.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleCopyShareLink}
                    disabled={!activeWaitlist}
                  >
                    <Share size={16} className="mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsShareQROpen(true)}
                    disabled={!activeWaitlist}
                  >
                    <QrCode size={16} className="mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
        </div>
        
        {/* Waitlist Table */}
        <div className="lg:col-span-2">
          <BlurCard>
            <BlurCardHeader className="flex flex-row items-center justify-between">
              <BlurCardTitle className="text-base sm:text-lg">
                Current Waitlist
                {waitlists.length > 0 && (
                  <Select
                    value={activeWaitlist || ""}
                    onValueChange={(value) => setActiveWaitlist(value)}
                  >
                    <SelectTrigger className="w-[180px] ml-4">
                      <SelectValue placeholder="Select Waitlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {waitlists.map((waitlist) => (
                        <SelectItem key={waitlist.id} value={waitlist.id}>
                          {waitlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </BlurCardTitle>
              
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <ListFilter size={14} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="notified">Notified</SelectItem>
                  <SelectItem value="seated">Seated</SelectItem>
                </SelectContent>
              </Select>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          {isLoading ? (
                            "Loading waitlist entries..."
                          ) : (
                            "No customers in the waitlist"
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.position}</TableCell>
                          <TableCell>
                            {entry.profiles?.first_name || entry.profiles?.username || "Customer"}
                          </TableCell>
                          <TableCell>{getStatusBadge(entry.status)}</TableCell>
                          <TableCell>
                            {entry.estimated_wait_time || Math.max(5, entry.position * 5)} min
                          </TableCell>
                          <TableCell>
                            {new Date(entry.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <WaitlistActions 
                              entry={entry}
                              onStatusChange={handleStatusChange}
                              onRemove={handleRemoveFromWaitlist}
                              refreshEntries={loadWaitlistEntries}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </div>
      </div>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Waitlist</DialogTitle>
            <DialogDescription>
              Add a new customer to the current waitlist.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={entryForm.customer_name}
                onChange={(e) => setEntryForm({ ...entryForm, customer_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="party-size">Party Size</Label>
              <Select
                value={entryForm.party_size}
                onValueChange={(value) => setEntryForm({ ...entryForm, party_size: value })}
              >
                <SelectTrigger id="party-size">
                  <SelectValue placeholder="Select Party Size" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} {size === 1 ? "person" : "people"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={entryForm.phone_number}
                onChange={(e) => setEntryForm({ ...entryForm, phone_number: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={entryForm.notes}
                onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                placeholder="Any special requests or notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddEntryOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToWaitlist}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Waitlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Waitlist Dialog */}
      <Dialog open={isCreateWaitlistOpen} onOpenChange={setIsCreateWaitlistOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Waitlist</DialogTitle>
            <DialogDescription>
              Create a new waitlist for your restaurant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="waitlist-name">Waitlist Name</Label>
              <Input
                id="waitlist-name"
                value={waitlistForm.name}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                placeholder="Main Dining Room"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="waitlist-description">Description (Optional)</Label>
              <Textarea
                id="waitlist-description"
                value={waitlistForm.description}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, description: e.target.value })}
                placeholder="Waitlist for main dining area"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="max-capacity">Maximum Capacity</Label>
              <Input
                id="max-capacity"
                type="number"
                value={waitlistForm.max_capacity}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, max_capacity: e.target.value })}
                min="1"
                max="500"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateWaitlistOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWaitlist}
              disabled={isLoading || !waitlistForm.name}
            >
              {isLoading ? "Creating..." : "Create Waitlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share QR Code Dialog */}
      <Dialog open={isShareQROpen} onOpenChange={setIsShareQROpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waitlist QR Code</DialogTitle>
            <DialogDescription>
              Customers can scan this QR code to join your waitlist.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            {activeWaitlist && (
              <div className="p-4 bg-white rounded-lg">
                <QRCode 
                  value={getWaitlistShareUrl(activeWaitlist)}
                  size={200}
                />
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Print this QR code and place it at your restaurant's entrance.
            </p>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsShareQROpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaitlistPage;
