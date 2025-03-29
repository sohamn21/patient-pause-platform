
import React, { useState } from "react";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Edit, Plus, Clock } from "lucide-react";

type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

interface TableData {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  occupiedSince?: Date;
  reservation?: {
    name: string;
    time: string;
    size: number;
  };
}

interface TableManagementProps {
  locationName?: string;
}

export function TableManagement({ locationName }: TableManagementProps) {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableData[]>([
    { id: "1", number: 1, capacity: 4, status: "available" },
    { id: "2", number: 2, capacity: 2, status: "occupied", occupiedSince: new Date(Date.now() - 45 * 60000) },
    { id: "3", number: 3, capacity: 6, status: "reserved", reservation: { name: "Johnson", time: "7:30 PM", size: 5 } },
    { id: "4", number: 4, capacity: 4, status: "cleaning" },
    { id: "5", number: 5, capacity: 8, status: "available" },
    { id: "6", number: 6, capacity: 2, status: "occupied", occupiedSince: new Date(Date.now() - 20 * 60000) },
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTable, setNewTable] = useState({
    number: "",
    capacity: "4",
    status: "available"
  });
  
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleAddTable = () => {
    const tableNumber = parseInt(newTable.number);
    if (isNaN(tableNumber)) {
      toast({
        title: "Invalid Table Number",
        description: "Please enter a valid table number",
        variant: "destructive"
      });
      return;
    }
    
    // Check if table number already exists
    if (tables.some(t => t.number === tableNumber)) {
      toast({
        title: "Table Number Exists",
        description: "A table with this number already exists",
        variant: "destructive"
      });
      return;
    }
    
    const newTableData: TableData = {
      id: `table-${Date.now()}`,
      number: tableNumber,
      capacity: parseInt(newTable.capacity),
      status: newTable.status as TableStatus
    };
    
    setTables([...tables, newTableData]);
    setNewTable({
      number: "",
      capacity: "4",
      status: "available"
    });
    setShowAddDialog(false);
    
    toast({
      title: "Table Added",
      description: `Table ${tableNumber} has been added successfully`
    });
  };
  
  const handleEditTable = () => {
    if (!editingTable) return;
    
    setTables(tables.map(table => 
      table.id === editingTable.id ? editingTable : table
    ));
    
    setShowEditDialog(false);
    setEditingTable(null);
    
    toast({
      title: "Table Updated",
      description: `Table ${editingTable.number} has been updated`
    });
  };
  
  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const updatedTable = { 
          ...table, 
          status: newStatus
        };
        
        // If table becomes occupied, set the occupiedSince time
        if (newStatus === "occupied") {
          updatedTable.occupiedSince = new Date();
        } else {
          // If table is no longer occupied, remove the occupiedSince time
          delete updatedTable.occupiedSince;
        }
        
        return updatedTable;
      }
      return table;
    }));
    
    const table = tables.find(t => t.id === tableId);
    if (table) {
      toast({
        title: "Status Updated",
        description: `Table ${table.number} is now ${newStatus}`
      });
    }
  };
  
  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case "occupied":
        return <Badge className="bg-red-500 hover:bg-red-600">Occupied</Badge>;
      case "reserved":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Reserved</Badge>;
      case "cleaning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Cleaning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTimeOccupied = (occupiedSince?: Date) => {
    if (!occupiedSince) return null;
    
    const minutesOccupied = Math.floor((Date.now() - occupiedSince.getTime()) / 60000);
    return `${minutesOccupied} min`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Table Management
          {locationName && <span className="text-sm font-normal ml-2 text-muted-foreground">({locationName})</span>}
        </h2>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>
                Add a new table to your restaurant layout.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-number" className="text-right">
                  Table #
                </Label>
                <Input
                  id="table-number"
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Select
                  value={newTable.capacity}
                  onValueChange={(value) => setNewTable({...newTable, capacity: value})}
                >
                  <SelectTrigger id="capacity" className="col-span-3">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 4, 6, 8, 10, 12].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} people
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newTable.status}
                  onValueChange={(value) => setNewTable({...newTable, status: value})}
                >
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddTable}>Add Table</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Table {editingTable?.number}</DialogTitle>
              <DialogDescription>
                Update table information.
              </DialogDescription>
            </DialogHeader>
            {editingTable && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-capacity" className="text-right">
                    Capacity
                  </Label>
                  <Select
                    value={editingTable.capacity.toString()}
                    onValueChange={(value) => setEditingTable({...editingTable, capacity: parseInt(value)})}
                  >
                    <SelectTrigger id="edit-capacity" className="col-span-3">
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 6, 8, 10, 12].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} people
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingTable.status}
                    onValueChange={(value) => setEditingTable({...editingTable, status: value as TableStatus})}
                  >
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleEditTable}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <BlurCard key={table.id} className={`
            ${table.status === 'available' ? 'border-green-500/30' : ''}
            ${table.status === 'occupied' ? 'border-red-500/30' : ''}
            ${table.status === 'reserved' ? 'border-blue-500/30' : ''}
            ${table.status === 'cleaning' ? 'border-yellow-500/30' : ''}
          `}>
            <BlurCardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <BlurCardTitle>Table {table.number}</BlurCardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditingTable(table);
                  setShowEditDialog(true);
                }}>
                  <Edit size={16} />
                </Button>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="text-sm">{table.capacity} people</span>
                  </div>
                  <div>
                    {getStatusBadge(table.status)}
                  </div>
                </div>
                
                {table.status === "occupied" && table.occupiedSince && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>Occupied for {getTimeOccupied(table.occupiedSince)}</span>
                  </div>
                )}
                
                {table.status === "reserved" && table.reservation && (
                  <div className="text-sm">
                    <div className="font-medium">{table.reservation.name}</div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>{table.reservation.time}</span>
                      <span>Party of {table.reservation.size}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {table.status !== "available" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(table.id, "available")}
                    >
                      Set Available
                    </Button>
                  )}
                  
                  {table.status !== "occupied" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(table.id, "occupied")}
                    >
                      Set Occupied
                    </Button>
                  )}
                  
                  {table.status !== "cleaning" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(table.id, "cleaning")}
                    >
                      Needs Cleaning
                    </Button>
                  )}
                </div>
              </div>
            </BlurCardContent>
          </BlurCard>
        ))}
      </div>
    </div>
  );
}
