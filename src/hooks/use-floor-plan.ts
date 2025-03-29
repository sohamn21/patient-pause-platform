
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FloorItem, TableType } from '@/components/restaurant/types';
import { useToast } from '@/hooks/use-toast';

export function useFloorPlan(locationName: string = 'default') {
  const { toast } = useToast();
  const [items, setItems] = useState<FloorItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [tableTypes] = useState<TableType[]>([
    { id: "rectangle2", name: "2-Person Rectangle", capacity: 2, width: 60, height: 40 },
    { id: "rectangle4", name: "4-Person Rectangle", capacity: 4, width: 80, height: 80 },
    { id: "round2", name: "2-Person Round", capacity: 2, width: 50, height: 50, shape: "circle" },
    { id: "round4", name: "4-Person Round", capacity: 4, width: 80, height: 80, shape: "circle" },
    { id: "round6", name: "6-Person Round", capacity: 6, width: 100, height: 100, shape: "circle" },
    { id: "round8", name: "8-Person Round", capacity: 8, width: 120, height: 120, shape: "circle" },
  ]);
  
  // Load floor plan data on mount
  useEffect(() => {
    const savedFloorPlan = localStorage.getItem(`floorPlan-${locationName}`);
    if (savedFloorPlan) {
      try {
        setItems(JSON.parse(savedFloorPlan));
      } catch (error) {
        console.error("Error loading saved floor plan:", error);
      }
    }
  }, [locationName]);
  
  // Save floor plan
  const saveFloorPlan = () => {
    localStorage.setItem(`floorPlan-${locationName}`, JSON.stringify(items));
    toast({
      title: "Floor plan saved",
      description: "Your layout has been saved successfully",
    });
  };
  
  // Clear floor plan
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
  
  // Add table
  const addTable = (x: number, y: number, tableTypeId: string) => {
    const tableType = tableTypes.find(t => t.id === tableTypeId);
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
      status: "available",
    };
    
    setItems([...items, newTable]);
    setSelectedItem(newTable.id);
    return newTable;
  };
  
  // Add wall
  const addWall = (x: number, y: number) => {
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
    return newWall;
  };
  
  // Add door
  const addDoor = (x: number, y: number) => {
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
    return newDoor;
  };
  
  // Update item
  const updateItem = (updatedItem: FloorItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };
  
  // Delete item
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
    toast({
      title: "Item deleted",
      description: "The selected item has been removed from the floor plan",
    });
  };
  
  // Rotate item
  const rotateItem = (id: string, direction: 'clockwise' | 'counterclockwise') => {
    setItems(items.map(item => {
      if (item.id === id) {
        const delta = direction === 'clockwise' ? 45 : -45;
        return { ...item, rotation: (item.rotation || 0) + delta };
      }
      return item;
    }));
  };
  
  // Duplicate item
  const duplicateItem = (id: string) => {
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
    
    return newItem;
  };

  return {
    items,
    setItems,
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
  };
}
