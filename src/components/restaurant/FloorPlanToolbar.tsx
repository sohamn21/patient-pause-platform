
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, Chair, Building, MapPin, RotateCw, RotateCcw, Trash, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorPlanToolbarProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  selectedItem: string | null;
  onDeleteItem: (id: string) => void;
  onRotateItem: (id: string, direction: 'clockwise' | 'counterclockwise') => void;
  onDuplicateItem: (id: string) => void;
}

export function FloorPlanToolbar({
  activeTool,
  setActiveTool,
  selectedItem,
  onDeleteItem,
  onRotateItem,
  onDuplicateItem,
}: FloorPlanToolbarProps) {
  return (
    <div className="flex flex-row md:flex-col gap-2 p-2 border rounded-md bg-background">
      <Button
        variant="ghost"
        size="icon"
        className={cn(activeTool === "table" && "bg-primary/20")}
        onClick={() => setActiveTool(activeTool === "table" ? null : "table")}
      >
        <Table size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(activeTool === "wall" && "bg-primary/20")}
        onClick={() => setActiveTool(activeTool === "wall" ? null : "wall")}
      >
        <Building size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(activeTool === "door" && "bg-primary/20")}
        onClick={() => setActiveTool(activeTool === "door" ? null : "door")}
      >
        <MapPin size={20} />
      </Button>
      
      <Separator className="my-2" />
      
      <Button
        variant="ghost"
        size="icon"
        disabled={!selectedItem}
        onClick={() => selectedItem && onRotateItem(selectedItem, 'clockwise')}
      >
        <RotateCw size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!selectedItem}
        onClick={() => selectedItem && onRotateItem(selectedItem, 'counterclockwise')}
      >
        <RotateCcw size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!selectedItem}
        onClick={() => selectedItem && onDuplicateItem(selectedItem)}
      >
        <Copy size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={!selectedItem}
        onClick={() => selectedItem && onDeleteItem(selectedItem)}
      >
        <Trash size={20} />
      </Button>
    </div>
  );
}
