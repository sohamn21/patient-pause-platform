
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface FloorPlanControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function FloorPlanControls({ zoom, setZoom }: FloorPlanControlsProps) {
  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };
  
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-md p-1">
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
  );
}
