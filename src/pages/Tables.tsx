
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Utensils, Plus, Search, FilterX, Edit, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Define a sample table data structure
interface TableItem {
  id: string;
  tableNumber: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  area: string;
}

const TablesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Sample tables data
  const [tables, setTables] = useState<TableItem[]>([
    { id: "1", tableNumber: "A-1", capacity: 4, status: "available", area: "Main Floor" },
    { id: "2", tableNumber: "A-2", capacity: 2, status: "occupied", area: "Main Floor" },
    { id: "3", tableNumber: "A-3", capacity: 6, status: "reserved", area: "Main Floor" },
    { id: "4", tableNumber: "B-1", capacity: 4, status: "available", area: "Patio" },
    { id: "5", tableNumber: "B-2", capacity: 8, status: "cleaning", area: "Patio" },
    { id: "6", tableNumber: "C-1", capacity: 2, status: "occupied", area: "Basement" },
  ]);

  const filteredTables = tables.filter(table => 
    table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Available</Badge>;
      case "occupied":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Occupied</Badge>;
      case "reserved":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Reserved</Badge>;
      case "cleaning":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Cleaning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleTableStatusChange = (id: string, newStatus: "available" | "occupied" | "reserved" | "cleaning") => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, status: newStatus } : table
    ));
    
    toast({
      title: "Table Status Updated",
      description: `Table status has been changed to ${newStatus}`,
    });
  };

  const handleDeleteTable = (id: string) => {
    setTables(prev => prev.filter(table => table.id !== id));
    
    toast({
      title: "Table Removed",
      description: "Table has been removed from the system",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">
            Manage your restaurant tables and their current status.
          </p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Add New Table
        </Button>
      </div>

      <BlurCard>
        <BlurCardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <BlurCardTitle>Tables Management</BlurCardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search tables..."
                className="max-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="icon" title="Clear Filters" onClick={() => setSearchQuery("")}>
                <FilterX size={16} />
              </Button>
            </div>
          </div>
        </BlurCardHeader>
        <BlurCardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Number</TableHead>
                  <TableHead className="text-center">Capacity</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.length > 0 ? filteredTables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Utensils size={16} className="text-muted-foreground" />
                        {table.tableNumber}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{table.capacity}</TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(table.status)}
                    </TableCell>
                    <TableCell>{table.area}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <span className="sr-only">Actions</span>
                              <span className="h-4 w-4">⋯</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit size={14} className="mr-2" />
                              Edit Table
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleTableStatusChange(table.id, "available")}>
                              Mark as Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTableStatusChange(table.id, "occupied")}>
                              Mark as Occupied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTableStatusChange(table.id, "reserved")}>
                              Mark as Reserved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTableStatusChange(table.id, "cleaning")}>
                              Mark as Cleaning
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTable(table.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete Table
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No tables found. Try clearing filters or add a new table.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </BlurCardContent>
      </BlurCard>
    </div>
  );
};

export default TablesPage;
