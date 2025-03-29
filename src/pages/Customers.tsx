
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Users, UserPlus, Search, Mail, Phone, History, Star, UserMinus, User } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define a customer data structure
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  status: "active" | "inactive" | "vip";
  notes?: string;
}

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  
  // Sample customer data
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: "1", 
      firstName: "John", 
      lastName: "Smith", 
      email: "john.smith@example.com", 
      phone: "+1 (555) 123-4567", 
      visits: 12, 
      lastVisit: "2025-03-25", 
      status: "active" 
    },
    { 
      id: "2", 
      firstName: "Emily", 
      lastName: "Johnson", 
      email: "emily.j@example.com", 
      phone: "+1 (555) 987-6543", 
      visits: 8, 
      lastVisit: "2025-03-20", 
      status: "vip",
      notes: "Allergic to nuts" 
    },
    { 
      id: "3", 
      firstName: "Michael", 
      lastName: "Brown", 
      email: "michael.b@example.com", 
      phone: "+1 (555) 456-7890", 
      visits: 3, 
      lastVisit: "2025-02-15", 
      status: "active" 
    },
    { 
      id: "4", 
      firstName: "Sarah", 
      lastName: "Williams", 
      email: "sarah.w@example.com", 
      phone: "+1 (555) 789-0123", 
      visits: 1, 
      lastVisit: "2025-01-10", 
      status: "inactive" 
    },
  ]);
  
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      fullName.includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.status.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Inactive</Badge>;
      case "vip":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">VIP</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddCustomer = () => {
    const id = (customers.length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const customer: Customer = {
      id,
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      phone: newCustomer.phone,
      visits: 0,
      lastVisit: currentDate,
      status: "active",
      notes: newCustomer.notes || undefined
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: ""
    });
    setShowAddDialog(false);
    
    toast({
      title: "Customer Added",
      description: `${customer.firstName} ${customer.lastName} has been added to your customer database.`,
    });
  };

  const handleDeleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(customers.filter(c => c.id !== id));
    
    toast({
      title: "Customer Removed",
      description: `${customer?.firstName} ${customer?.lastName} has been removed from your customer database.`,
    });
  };

  const handleStatusChange = (id: string, status: "active" | "inactive" | "vip") => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, status } : customer
    ));
    
    toast({
      title: "Status Updated",
      description: `Customer status has been updated to ${status}.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database and view customer details.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus size={16} className="mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter the customer details below to add them to your database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name</Label>
                <Input
                  id="firstName"
                  value={newCustomer.firstName}
                  onChange={e => setNewCustomer({...newCustomer, firstName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name</Label>
                <Input
                  id="lastName"
                  value={newCustomer.lastName}
                  onChange={e => setNewCustomer({...newCustomer, lastName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Input
                  id="notes"
                  value={newCustomer.notes}
                  onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <BlurCardTitle>Customer Database</BlurCardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search customers..."
                    className="max-w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-center">Visits</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg`} />
                              <AvatarFallback>{getInitials(`${customer.firstName} ${customer.lastName}`)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                              {customer.notes && (
                                <div className="text-xs text-muted-foreground">{customer.notes}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="flex items-center">
                              <Mail size={12} className="mr-1 text-muted-foreground" /> {customer.email}
                            </span>
                            <span className="flex items-center mt-1">
                              <Phone size={12} className="mr-1 text-muted-foreground" /> {customer.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-background">
                            {customer.visits}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <History size={14} className="mr-1 text-muted-foreground" />
                            {new Date(customer.lastVisit).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(customer.status)}
                        </TableCell>
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
                                <DropdownMenuItem>
                                  <User size={14} className="mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail size={14} className="mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone size={14} className="mr-2" />
                                  Call Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "active")}>
                                  Mark as Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "inactive")}>
                                  Mark as Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(customer.id, "vip")}>
                                  <Star size={14} className="mr-2" />
                                  Mark as VIP
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="text-red-500"
                                >
                                  <UserMinus size={14} className="mr-2" />
                                  Remove Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No customers found. Try clearing your search or add a new customer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Active Customers</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter implemented in the All Customers tab. This tab would show only active customers.
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="vip" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>VIP Customers</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter implemented in the All Customers tab. This tab would show only VIP customers.
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Inactive Customers</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              <div className="text-center py-8 text-muted-foreground">
                Filter implemented in the All Customers tab. This tab would show only inactive customers.
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomersPage;
