
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Save, Trash, Download, Upload } from "lucide-react";

interface FloorPlanControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  onSave?: () => void;
  onClear?: () => void;
  showLabels?: boolean;
  setShowLabels?: (show: boolean) => void;
  snapToGrid?: boolean;
  setSnapToGrid?: (snap: boolean) => void;
}

export function FloorPlanControls({ 
  zoom, 
  setZoom,
  onSave,
  onClear,
  showLabels = true,
  setShowLabels,
  snapToGrid = false,
  setSnapToGrid
}: FloorPlanControlsProps) {
  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };
  
  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-md p-1">
        <Button variant="ghost" size="icon" onClick={zoomOut}>
          <Minus size={16} />
        </Button>
        
        <span className="text-xs w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button variant="ghost" size="icon" onClick={zoomIn}>
          <Plus size={16} />
        </Button>
      </div>
      
      {(onSave || onClear) && (
        <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-md p-1">
          {onSave && (
            <Button variant="ghost" size="icon" onClick={onSave} title="Save Layout">
              <Save size={16} />
            </Button>
          )}
          
          {onClear && (
            <Button variant="ghost" size="icon" onClick={onClear} title="Clear Layout">
              <Trash size={16} />
            </Button>
          )}
        </div>
      )}
      
      {(setShowLabels || setSnapToGrid) && (
        <div className="flex flex-col gap-2 bg-background/80 backdrop-blur-sm border rounded-md p-2">
          {setShowLabels && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-labels" 
                checked={showLabels} 
                onCheckedChange={setShowLabels} 
              />
              <Label htmlFor="show-labels" className="text-xs">Show Labels</Label>
            </div>
          )}
          
          {setSnapToGrid && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="snap-grid" 
                checked={snapToGrid} 
                onCheckedChange={setSnapToGrid} 
              />
              <Label htmlFor="snap-grid" className="text-xs">Snap to Grid</Label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
