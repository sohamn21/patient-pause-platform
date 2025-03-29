
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, Chair, Utensils, MapPin, Building } from "lucide-react";
import { FloorPlanTable } from "./FloorPlanTable";
import { FloorPlanControls } from "./FloorPlanControls";
import { FloorPlanGrid } from "./FloorPlanGrid";
import { FloorPlanToolbar } from "./FloorPlanToolbar";
import { TableType, FloorItem } from "./types";
import { v4 as uuidv4 } from "uuid";

export function FloorPlan({ locationName }: { locationName?: string }) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<FloorItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [tableTypes] = useState<TableType[]>([
    { id: "rectangle2", name: "2-Person Rectangle", capacity: 2, width: 60, height: 40 },
    { id: "rectangle4", name: "4-Person Rectangle", capacity: 4, width: 80, height: 80 },
    { id: "round2", name: "2-Person Round", capacity: 2, width: 50, height: 50, shape: "circle" },
    { id: "round4", name: "4-Person Round", capacity: 4, width: 80, height: 80, shape: "circle" },
    { id: "round6", name: "6-Person Round", capacity: 6, width: 100, height: 100, shape: "circle" },
    { id: "round8", name: "8-Person Round", capacity: 8, width: 120, height: 120, shape: "circle" },
  ]);
  
  const [activeTableType, setActiveTableType] = useState(tableTypes[1].id);
  
  useEffect(() => {
    // Load the saved floor plan if available
    const savedFloorPlan = localStorage.getItem(`floorPlan-${locationName}`);
    if (savedFloorPlan) {
      try {
        setItems(JSON.parse(savedFloorPlan));
      } catch (error) {
        console.error("Error loading saved floor plan:", error);
      }
    }
  }, [locationName]);
  
  const saveFloorPlan = () => {
    localStorage.setItem(`floorPlan-${locationName}`, JSON.stringify(items));
    toast({
      title: "Floor plan saved",
      description: "Your layout has been saved successfully",
    });
  };
  
  const handleAddTable = (x: number, y: number) => {
    const tableType = tableTypes.find(t => t.id === activeTableType);
    if (!tableType) return;
    
    const newTable: FloorItem = {
      id: uuidv4(),
      type: "table",
      x,
      y,
      width: tableType.width,
      height: tableType.height,
      rotation: 0,
      tableType: tableType.id,
      capacity: tableType.capacity,
      number: items.filter(item => item.type === "table").length + 1,
      shape: tableType.shape || "rectangle",
    };
    
    setItems([...items, newTable]);
    setSelectedItem(newTable.id);
    setActiveTool(null);
  };
  
  const handleAddWall = (x: number, y: number) => {
    const newWall: FloorItem = {
      id: uuidv4(),
      type: "wall",
      x,
      y,
      width: 100,
      height: 10,
      rotation: 0,
    };
    
    setItems([...items, newWall]);
    setSelectedItem(newWall.id);
    setActiveTool(null);
  };
  
  const handleAddDoor = (x: number, y: number) => {
    const newDoor: FloorItem = {
      id: uuidv4(),
      type: "door",
      x,
      y,
      width: 60,
      height: 10,
      rotation: 0,
    };
    
    setItems([...items, newDoor]);
    setSelectedItem(newDoor.id);
    setActiveTool(null);
  };
  
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Calculate position with zoom and centering
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      if (activeTool === "table") {
        handleAddTable(x, y);
      } else if (activeTool === "wall") {
        handleAddWall(x, y);
      } else if (activeTool === "door") {
        handleAddDoor(x, y);
      }
    } else if (!isDraggingItem) {
      // Deselect when clicking on empty space
      setSelectedItem(null);
    }
  };
  
  const handleItemClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(id);
  };
  
  const handleUpdateItem = (updatedItem: FloorItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
    toast({
      title: "Item deleted",
      description: "The selected item has been removed from the floor plan",
    });
  };
  
  const handleRotateItem = (id: string, direction: 'clockwise' | 'counterclockwise') => {
    setItems(items.map(item => {
      if (item.id === id) {
        const delta = direction === 'clockwise' ? 45 : -45;
        return { ...item, rotation: (item.rotation || 0) + delta };
      }
      return item;
    }));
  };
  
  const handleDuplicateItem = (id: string) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (!itemToDuplicate) return;
    
    const newItem: FloorItem = {
      ...itemToDuplicate,
      id: uuidv4(),
      x: itemToDuplicate.x + 20,
      y: itemToDuplicate.y + 20,
    };
    
    // If duplicating a table, update its number
    if (newItem.type === 'table') {
      newItem.number = items.filter(item => item.type === "table").length + 1;
    }
    
    setItems([...items, newItem]);
    setSelectedItem(newItem.id);
    toast({
      title: "Item duplicated",
      description: `A copy of the selected item has been created`,
    });
  };
  
  const clearFloorPlan = () => {
    if (items.length === 0) return;
    
    if (confirm("Are you sure you want to clear the floor plan? This action cannot be undone.")) {
      setItems([]);
      setSelectedItem(null);
      localStorage.removeItem(`floorPlan-${locationName}`);
      toast({
        title: "Floor plan cleared",
        description: "All items have been removed from the floor plan",
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select value={activeTableType} onValueChange={setActiveTableType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select table type" />
            </SelectTrigger>
            <SelectContent>
              {tableTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.capacity} seats)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={saveFloorPlan} variant="default">
            Save Floor Plan
          </Button>
          <Button onClick={clearFloorPlan} variant="outline">
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <FloorPlanToolbar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool} 
          selectedItem={selectedItem}
          onDeleteItem={handleDeleteItem}
          onRotateItem={handleRotateItem}
          onDuplicateItem={handleDuplicateItem}
        />
        
        <div className="relative flex-1 border rounded-md bg-background/50 overflow-hidden">
          <FloorPlanControls zoom={zoom} setZoom={setZoom} />
          
          <div 
            ref={containerRef} 
            className="relative w-full h-[500px] overflow-auto"
            onClick={handleContainerClick}
          >
            <div 
              className="absolute w-[1000px] h-[800px] origin-top-left transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <FloorPlanGrid />
              
              {items.map(item => (
                <FloorPlanTable
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  tableTypes={tableTypes}
                  onClick={(e) => handleItemClick(item.id, e)}
                  onChange={handleUpdateItem}
                  onDragStart={() => setIsDraggingItem(true)}
                  onDragEnd={() => setIsDraggingItem(false)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
