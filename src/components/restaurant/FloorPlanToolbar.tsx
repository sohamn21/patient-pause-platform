import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, Utensils, Building, FileSpreadsheet, Trash2, RotateCw, RotateCcw, Copy } from "lucide-react";

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
  const handleToolClick = (tool: string) => {
    setActiveTool(activeTool === tool ? null : tool);
  };
  
  const handleDeleteClick = () => {
    if (selectedItem && confirm("Are you sure you want to delete this item?")) {
      onDeleteItem(selectedItem);
    }
  };
  
  const handleRotateClick = (direction: 'clockwise' | 'counterclockwise') => {
    if (selectedItem) {
      onRotateItem(selectedItem, direction);
    }
  };
  
  const handleDuplicateClick = () => {
    if (selectedItem) {
      onDuplicateItem(selectedItem);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 w-48 border rounded-md bg-background/80 backdrop-blur-sm p-2">
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === "table" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => handleToolClick("table")}
              >
                <Table size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add Table
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === "wall" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => handleToolClick("wall")}
              >
                <Building size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add Wall
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === "door" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => handleToolClick("door")}
              >
                <FileSpreadsheet size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add Door
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === "decoration" ? "secondary" : "outline"} 
                size="icon"
                onClick={() => handleToolClick("decoration")}
              >
                <Utensils size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add Decoration
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      <div className="border-t pt-2">
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={!selectedItem}
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Delete
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={!selectedItem}
                  onClick={() => handleRotateClick('clockwise')}
                >
                  <RotateCw size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Rotate Clockwise
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={!selectedItem}
                  onClick={() => handleRotateClick('counterclockwise')}
                >
                  <RotateCcw size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Rotate Counterclockwise
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={!selectedItem}
                  onClick={handleDuplicateClick}
                >
                  <Copy size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Duplicate
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
