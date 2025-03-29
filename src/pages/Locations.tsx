
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { MapPin, Plus, Search, Clock, Users, Utensils, Edit, Trash2, Info, CheckCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Define a location data structure
interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: "active" | "closed" | "opening-soon";
  capacity: number;
  tables: number;
  openingHours: string;
}

const LocationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  
  // Sample locations data
  const [locations, setLocations] = useState<Location[]>([
    { 
      id: "1", 
      name: "Downtown Restaurant", 
      address: "123 Main Street", 
      city: "New York", 
      state: "NY", 
      country: "USA", 
      status: "active", 
      capacity: 120, 
      tables: 30, 
      openingHours: "9:00 AM - 10:00 PM"
    },
    { 
      id: "2", 
      name: "Westside Café", 
      address: "456 Ocean Ave", 
      city: "Los Angeles", 
      state: "CA", 
      country: "USA", 
      status: "active", 
      capacity: 80, 
      tables: 20, 
      openingHours: "8:00 AM - 9:00 PM"
    },
    { 
      id: "3", 
      name: "Lakeside Bistro", 
      address: "789 Lake Street", 
      city: "Chicago", 
      state: "IL", 
      country: "USA", 
      status: "closed", 
      capacity: 60, 
      tables: 15, 
      openingHours: "11:00 AM - 10:00 PM"
    },
    { 
      id: "4", 
      name: "Southside Diner", 
      address: "101 South Blvd", 
      city: "Miami", 
      state: "FL", 
      country: "USA", 
      status: "opening-soon", 
      capacity: 100, 
      tables: 25, 
      openingHours: "7:00 AM - 11:00 PM"
    },
  ]);
  
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    capacity: "",
    tables: "",
    openingHours: ""
  });

  const filteredLocations = locations.filter(location => {
    const query = searchQuery.toLowerCase();
    
    return (
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.city.toLowerCase().includes(query) ||
      location.state.toLowerCase().includes(query) ||
      location.country.toLowerCase().includes(query) ||
      location.status.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Closed</Badge>;
      case "opening-soon":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Opening Soon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddLocation = () => {
    const id = (locations.length + 1).toString();
    
    const location: Location = {
      id,
      name: newLocation.name,
      address: newLocation.address,
      city: newLocation.city,
      state: newLocation.state,
      country: newLocation.country,
      status: "active",
      capacity: parseInt(newLocation.capacity) || 0,
      tables: parseInt(newLocation.tables) || 0,
      openingHours: newLocation.openingHours
    };
    
    setLocations([...locations, location]);
    setNewLocation({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      capacity: "",
      tables: "",
      openingHours: ""
    });
    setShowAddDialog(false);
    
    toast({
      title: "Location Added",
      description: `${location.name} has been added to your locations.`,
    });
  };

  const handleDeleteLocation = (id: string) => {
    const location = locations.find(l => l.id === id);
    setLocations(locations.filter(l => l.id !== id));
    
    toast({
      title: "Location Removed",
      description: `${location?.name} has been removed from your locations.`,
    });
  };

  const handleStatusChange = (id: string, status: "active" | "closed" | "opening-soon") => {
    setLocations(prev => prev.map(location => 
      location.id === id ? { ...location, status } : location
    ));
    
    toast({
      title: "Status Updated",
      description: `Location status has been updated to ${status}.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your restaurant locations and branches.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Enter the location details below to add a new restaurant branch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={e => setNewLocation({...newLocation, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input
                  id="city"
                  value={newLocation.city}
                  onChange={e => setNewLocation({...newLocation, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">State</Label>
                <Input
                  id="state"
                  value={newLocation.state}
                  onChange={e => setNewLocation({...newLocation, state: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">Country</Label>
                <Input
                  id="country"
                  value={newLocation.country}
                  onChange={e => setNewLocation({...newLocation, country: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newLocation.capacity}
                  onChange={e => setNewLocation({...newLocation, capacity: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tables" className="text-right">Tables</Label>
                <Input
                  id="tables"
                  type="number"
                  value={newLocation.tables}
                  onChange={e => setNewLocation({...newLocation, tables: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">Opening Hours</Label>
                <Input
                  id="hours"
                  value={newLocation.openingHours}
                  onChange={e => setNewLocation({...newLocation, openingHours: e.target.value})}
                  placeholder="e.g. 9:00 AM - 10:00 PM"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <BlurCard>
        <BlurCardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <BlurCardTitle>Restaurant Locations</BlurCardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search locations..."
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
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Capacity</TableHead>
                  <TableHead>Opening Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length > 0 ? filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="font-medium">{location.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{location.address}</span>
                        <span className="text-xs text-muted-foreground">{location.city}, {location.state}, {location.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(location.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-muted-foreground" />
                          <span>{location.capacity} seats</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Utensils size={14} className="text-muted-foreground" />
                          <span>{location.tables} tables</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-muted-foreground" />
                        {location.openingHours}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <span className="sr-only">Actions</span>
                              <span className="h-4 w-4">⋯</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Info size={14} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit size={14} className="mr-2" />
                              Edit Location
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusChange(location.id, "active")}>
                              <CheckCircle size={14} className="mr-2 text-green-500" />
                              Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(location.id, "closed")}>
                              Mark as Closed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(location.id, "opening-soon")}>
                              Mark as Opening Soon
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Remove Location
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No locations found. Try clearing your search or add a new location.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </BlurCardContent>
      </BlurCard>
    </div>
  );
};

export default LocationsPage;
