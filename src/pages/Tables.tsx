
import { useState } from "react";
import { TableManagement } from "@/components/restaurant/TableManagement";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationSelector } from "@/components/dashboard/LocationSelector";

// Sample locations data
const locations = [
  { id: "loc1", name: "Main Restaurant", address: "123 Main St, Anytown", isMain: true },
  { id: "loc2", name: "Downtown Branch", address: "456 Central Ave, Anytown" },
  { id: "loc3", name: "Westside Location", address: "789 West Blvd, Anytown" },
];

const TablesPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [activeLocations, setActiveLocations] = useState(locations);
  
  const handleAddLocation = (location: Omit<typeof locations[0], "id">) => {
    const newLocation = {
      ...location,
      id: `loc${activeLocations.length + 1}`
    };
    
    setActiveLocations([...activeLocations, newLocation]);
    setSelectedLocation(newLocation.id);
  };
  
  const selectedLocationData = activeLocations.find(loc => loc.id === selectedLocation);
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">
            Manage table assignments and reservations.
          </p>
        </div>
        
        <LocationSelector 
          locations={activeLocations} 
          selectedLocation={selectedLocation} 
          onLocationChange={setSelectedLocation}
          onAddLocation={handleAddLocation}
        />
      </div>
      
      <Tabs defaultValue="management" className="space-y-6">
        <TabsList>
          <TabsTrigger value="management">Table Management</TabsTrigger>
          <TabsTrigger value="analytics">Table Analytics</TabsTrigger>
          <TabsTrigger value="layout">Restaurant Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management">
          <TableManagement locationName={selectedLocationData?.name} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Table Usage Analytics</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Table analytics will show performance metrics, turnover rates, and peak usage times.
              </p>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="layout">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Restaurant Floor Plan</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Interactive floor plan layout will be displayed here to visualize your restaurant setup.
              </p>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TablesPage;
