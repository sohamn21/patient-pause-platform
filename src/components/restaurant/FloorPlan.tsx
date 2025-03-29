
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, Utensils, MapPin, Building, FileSpreadsheet } from "lucide-react";
import { FloorPlanTable } from "./FloorPlanTable";
import { FloorPlanControls } from "./FloorPlanControls";
import { FloorPlanGrid } from "./FloorPlanGrid";
import { FloorPlanToolbar } from "./FloorPlanToolbar";
import { useFloorPlan } from "@/hooks/use-floor-plan";

export function FloorPlan({ locationName }: { locationName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeTableType, setActiveTableType] = useState("rectangle4");
  const [showLabels, setShowLabels] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  
  const {
    items,
    selectedItem,
    setSelectedItem,
    isDraggingItem,
    setIsDraggingItem,
    tableTypes,
    saveFloorPlan,
    clearFloorPlan,
    addTable,
    addWall,
    addDoor,
    updateItem,
    deleteItem,
    rotateItem,
    duplicateItem
  } = useFloorPlan(locationName);
  
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Calculate position with zoom and centering
      let x = (e.clientX - rect.left) / zoom;
      let y = (e.clientY - rect.top) / zoom;
      
      // Snap to grid if enabled
      if (snapToGrid) {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }
      
      if (activeTool === "table") {
        addTable(x, y, activeTableType);
      } else if (activeTool === "wall") {
        addWall(x, y);
      } else if (activeTool === "door") {
        addDoor(x, y);
      }
      setActiveTool(null);
    } else if (!isDraggingItem) {
      // Deselect when clicking on empty space
      setSelectedItem(null);
    }
  };
  
  const handleItemClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(id);
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
          onDeleteItem={deleteItem}
          onRotateItem={rotateItem}
          onDuplicateItem={duplicateItem}
        />
        
        <div className="relative flex-1 border rounded-md bg-background/50 overflow-hidden">
          <FloorPlanControls 
            zoom={zoom} 
            setZoom={setZoom} 
            onSave={saveFloorPlan}
            onClear={clearFloorPlan}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            snapToGrid={snapToGrid}
            setSnapToGrid={setSnapToGrid}
          />
          
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
                  onChange={updateItem}
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
