
import { useState } from "react";
import { Check, ChevronDown, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  address: string;
  isMain?: boolean;
}

interface LocationSelectorProps {
  locations: Location[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
  onAddLocation?: (location: Omit<Location, "id">) => void;
}

export function LocationSelector({ 
  locations, 
  selectedLocation, 
  onLocationChange, 
  onAddLocation 
}: LocationSelectorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    isMain: false
  });
  
  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);
  
  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and address for the new location",
        variant: "destructive"
      });
      return;
    }
    
    if (onAddLocation) {
      onAddLocation(newLocation);
    }
    
    setNewLocation({
      name: "",
      address: "",
      isMain: false
    });
    setShowAddDialog(false);
    
    toast({
      title: "Location Added",
      description: `${newLocation.name} has been added to your locations`
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-[200px] md:w-[260px]">
            <div className="flex items-center gap-2 truncate">
              <MapPin size={16} />
              <span className="truncate">{selectedLocationData?.name || "Select Location"}</span>
            </div>
            <ChevronDown size={16} className="opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] md:w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search locations..." />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              <CommandGroup>
                {locations.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.id}
                    onSelect={() => {
                      onLocationChange(location.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 truncate">
                      {location.isMain && <span className="font-bold">Main</span>}
                      <span className="truncate">{location.name}</span>
                    </div>
                    {location.id === selectedLocation && (
                      <Check size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {onAddLocation && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Add a new business location to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="location-name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Downtown Branch"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location-address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="location-address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="Full address including city and zip code"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location-main" className="text-right">
                  Main Location
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="location-main"
                    checked={newLocation.isMain}
                    onChange={(e) => setNewLocation({...newLocation, isMain: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="location-main" className="text-sm font-normal">
                    Set as main business location
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
