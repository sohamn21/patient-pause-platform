
import { useState } from "react";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, User, Calendar, Clock, Users } from "lucide-react";

// Sample customers data
const sampleCustomers = [
  {
    id: "cust1",
    firstName: "John",
    lastName: "Smith",
    email: "johnsmith@example.com",
    phone: "555-123-4567",
    preferredService: "Table Service",
    preferredStaff: "Maria",
    visits: [
      { id: "v1", date: new Date(2023, 2, 15), service: "Dinner Reservation", status: "completed" as const },
      { id: "v2", date: new Date(2023, 1, 10), service: "Lunch Reservation", status: "completed" as const },
      { id: "v3", date: new Date(2023, 0, 5), service: "Private Dining", status: "cancelled" as const },
    ]
  },
  {
    id: "cust2",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.j@example.com",
    phone: "555-987-6543",
    visits: [
      { id: "v4", date: new Date(2023, 3, 22), service: "Dinner Reservation", status: "completed" as const },
      { id: "v5", date: new Date(2023, 2, 17), service: "Table Reservation", status: "no-show" as const },
    ]
  },
  {
    id: "cust3",
    firstName: "Michael",
    lastName: "Brown",
    email: "mbrown@example.com",
    phone: "555-789-0123",
    preferredService: "Private Dining",
    visits: [
      { id: "v6", date: new Date(2023, 4, 5), service: "Private Event", status: "completed" as const },
    ]
  },
];

const CustomersPage = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState(sampleCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
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
    
    return fullName.includes(query) || 
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.includes(query));
  });
  
  const handleAddCustomer = () => {
    if (!newCustomer.firstName || !newCustomer.lastName) {
      toast({
        title: "Missing Information",
        description: "Please provide at least first and last name",
        variant: "destructive"
      });
      return;
    }
    
    const newCustomerData = {
      id: `cust${customers.length + 1}`,
      ...newCustomer,
      visits: []
    };
    
    setCustomers([...customers, newCustomerData]);
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
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added`
    });
  };
  
  const handleBookAppointment = () => {
    toast({
      title: "Appointment Booking",
      description: "Opening appointment booking form...",
    });
    // In a real app, this would navigate to the appointment booking page or open a booking modal
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer profiles and history.
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile with contact information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
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
      
      <div className="mb-6">
        <Input
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          prefix={<Search size={18} className="text-muted-foreground mr-2" />}
        />
      </div>
      
      <Tabs defaultValue={selectedCustomer ? "profile" : "list"}>
        <TabsList>
          <TabsTrigger 
            value="list" 
            onClick={() => setSelectedCustomer(null)}
          >
            <Users size={16} className="mr-2" />
            Customer List
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            disabled={!selectedCustomer}
          >
            <User size={16} className="mr-2" />
            Customer Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <BlurCard>
            <BlurCardHeader>
              <BlurCardTitle>Customer Directory</BlurCardTitle>
            </BlurCardHeader>
            <BlurCardContent>
              {filteredCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Total Visits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => {
                        const lastVisit = customer.visits.length > 0 
                          ? customer.visits.sort((a, b) => b.date.getTime() - a.date.getTime())[0] 
                          : null;
                          
                        return (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {customer.email && <div className="text-sm">{customer.email}</div>}
                                {customer.phone && <div className="text-sm text-muted-foreground">{customer.phone}</div>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lastVisit ? (
                                <div className="flex items-center gap-1">
                                  <Clock size={14} className="text-muted-foreground" />
                                  <span>
                                    {lastVisit.date.toLocaleDateString()} - {lastVisit.service}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No visits yet</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {customer.visits.length}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setSelectedCustomer(customer.id)}
                                >
                                  <User size={14} className="mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Calendar size={14} className="mr-1" />
                                  Book
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No customers found matching your search criteria.</p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus size={16} className="mr-2" />
                    Add New Customer
                  </Button>
                </div>
              )}
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          {selectedCustomer && (
            <UserProfileCard 
              {...customers.find(c => c.id === selectedCustomer)!}
              onBookAppointment={handleBookAppointment}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomersPage;
