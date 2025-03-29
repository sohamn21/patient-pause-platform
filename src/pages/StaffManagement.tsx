
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BlurCard, 
  BlurCardContent, 
  BlurCardHeader, 
  BlurCardTitle 
} from "@/components/ui/blur-card";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";

// Staff member interface
interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: {
    manageWaitlist: boolean;
    manageAppointments: boolean;
    manageStaff: boolean;
    manageSettings: boolean;
    viewReports: boolean;
  };
  status: "active" | "inactive";
  joinedDate: string;
  avatar?: string;
}

const StaffManagementPage = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showEditPermissionsDialog, setShowEditPermissionsDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  // Sample staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+91 98765 43210",
      role: "Manager",
      permissions: {
        manageWaitlist: true,
        manageAppointments: true,
        manageStaff: true,
        manageSettings: true,
        viewReports: true
      },
      status: "active",
      joinedDate: "2023-05-15"
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 87654 32109",
      role: "Host",
      permissions: {
        manageWaitlist: true,
        manageAppointments: true,
        manageStaff: false,
        manageSettings: false,
        viewReports: true
      },
      status: "active",
      joinedDate: "2023-06-22"
    },
    {
      id: "3",
      name: "Raj Patel",
      email: "raj.patel@example.com",
      phone: "+91 76543 21098",
      role: "Waiter",
      permissions: {
        manageWaitlist: true,
        manageAppointments: false,
        manageStaff: false,
        manageSettings: false,
        viewReports: false
      },
      status: "active",
      joinedDate: "2023-08-10"
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "+91 65432 10987",
      role: "Cook",
      permissions: {
        manageWaitlist: false,
        manageAppointments: false,
        manageStaff: false,
        manageSettings: false,
        viewReports: false
      },
      status: "inactive",
      joinedDate: "2023-09-05"
    }
  ]);
  
  // New staff member form state
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id' | 'joinedDate' | 'status'>>({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: {
      manageWaitlist: false,
      manageAppointments: false,
      manageStaff: false,
      manageSettings: false,
      viewReports: false
    }
  });
  
  // Filter staff based on search query
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Role badge component
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Manager</Badge>;
      case "host":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Host</Badge>;
      case "waiter":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Waiter</Badge>;
      case "cook":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Cook</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle add new staff member
  const handleAddStaff = () => {
    const id = (staffMembers.length + 1).toString();
    
    const staffMember: StaffMember = {
      id,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      permissions: newStaff.permissions,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0]
    };
    
    setStaffMembers([...staffMembers, staffMember]);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "",
      permissions: {
        manageWaitlist: false,
        manageAppointments: false,
        manageStaff: false,
        manageSettings: false,
        viewReports: false
      }
    });
    setShowAddStaffDialog(false);
    
    toast({
      title: "Staff Member Added",
      description: `${staffMember.name} has been added to your staff.`,
    });
  };
  
  // Handle delete staff member
  const handleDeleteStaff = (id: string) => {
    const staffMember = staffMembers.find(staff => staff.id === id);
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    
    toast({
      title: "Staff Member Removed",
      description: `${staffMember?.name} has been removed from your staff.`,
    });
  };
  
  // Handle staff status toggle
  const handleToggleStatus = (id: string) => {
    setStaffMembers(staffMembers.map(staff => {
      if (staff.id === id) {
        const newStatus = staff.status === "active" ? "inactive" : "active";
        
        toast({
          title: "Staff Status Updated",
          description: `${staff.name}'s status has been set to ${newStatus}.`,
        });
        
        return {
          ...staff,
          status: newStatus
        };
      }
      return staff;
    }));
  };
  
  // Open permissions dialog
  const openPermissionsDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowEditPermissionsDialog(true);
  };
  
  // Save permissions changes
  const savePermissions = () => {
    if (!selectedStaff) return;
    
    setStaffMembers(staffMembers.map(staff => {
      if (staff.id === selectedStaff.id) {
        return selectedStaff;
      }
      return staff;
    }));
    
    setShowEditPermissionsDialog(false);
    
    toast({
      title: "Permissions Updated",
      description: `${selectedStaff.name}'s permissions have been updated.`,
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Add staff members and manage their permissions.
          </p>
        </div>
        <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>
                Enter staff member details and set their initial permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Full Name</Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newStaff.phone}
                  onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select 
                  value={newStaff.role}
                  onValueChange={value => setNewStaff({...newStaff, role: value})}
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Host">Host</SelectItem>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                    <SelectItem value="Cook">Cook</SelectItem>
                    <SelectItem value="Bartender">Bartender</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4 mt-2">
                <h4 className="text-sm font-medium mb-3">Initial Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-waitlist" className="cursor-pointer">Manage Waitlist</Label>
                    <Switch 
                      id="manage-waitlist" 
                      checked={newStaff.permissions.manageWaitlist}
                      onCheckedChange={checked => setNewStaff({
                        ...newStaff, 
                        permissions: {...newStaff.permissions, manageWaitlist: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-appointments" className="cursor-pointer">Manage Appointments</Label>
                    <Switch 
                      id="manage-appointments" 
                      checked={newStaff.permissions.manageAppointments}
                      onCheckedChange={checked => setNewStaff({
                        ...newStaff, 
                        permissions: {...newStaff.permissions, manageAppointments: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-staff" className="cursor-pointer">Manage Staff</Label>
                    <Switch 
                      id="manage-staff" 
                      checked={newStaff.permissions.manageStaff}
                      onCheckedChange={checked => setNewStaff({
                        ...newStaff, 
                        permissions: {...newStaff.permissions, manageStaff: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-settings" className="cursor-pointer">Manage Settings</Label>
                    <Switch 
                      id="manage-settings" 
                      checked={newStaff.permissions.manageSettings}
                      onCheckedChange={checked => setNewStaff({
                        ...newStaff, 
                        permissions: {...newStaff.permissions, manageSettings: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="view-reports" className="cursor-pointer">View Reports</Label>
                    <Switch 
                      id="view-reports" 
                      checked={newStaff.permissions.viewReports}
                      onCheckedChange={checked => setNewStaff({
                        ...newStaff, 
                        permissions: {...newStaff.permissions, viewReports: checked}
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>Cancel</Button>
              <Button onClick={handleAddStaff}>Add Staff Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center my-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredStaff.length} staff members
          </div>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="max-w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      
        <TabsContent value="all">
          <BlurCard>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={staff.avatar} alt={staff.name} />
                              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-xs text-muted-foreground">{staff.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(staff.role)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail size={12} className="mr-1" />
                              {staff.email}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Phone size={12} className="mr-1" />
                              {staff.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(staff.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar size={12} className="mr-1" />
                            {staff.joinedDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <span className="sr-only">Actions</span>
                                <Edit size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openPermissionsDialog(staff)}>
                                <Shield size={14} className="mr-2 text-blue-500" />
                                Edit Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(staff.id)}>
                                <UserCircle size={14} className="mr-2 text-green-500" />
                                {staff.status === "active" ? "Set as Inactive" : "Set as Active"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteStaff(staff.id)}>
                                <Trash2 size={14} className="mr-2 text-destructive" />
                                Remove Staff Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No staff members found. Add your first staff member to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="active">
          <BlurCard>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.filter(staff => staff.status === "active").length > 0 ? 
                      filteredStaff
                        .filter(staff => staff.status === "active")
                        .map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={staff.avatar} alt={staff.name} />
                                  <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-xs text-muted-foreground">{staff.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(staff.role)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Mail size={12} className="mr-1" />
                                  {staff.email}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Phone size={12} className="mr-1" />
                                  {staff.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(staff.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar size={12} className="mr-1" />
                                {staff.joinedDate}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <span className="sr-only">Actions</span>
                                    <Edit size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openPermissionsDialog(staff)}>
                                    <Shield size={14} className="mr-2 text-blue-500" />
                                    Edit Permissions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(staff.id)}>
                                    <UserCircle size={14} className="mr-2 text-orange-500" />
                                    Set as Inactive
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteStaff(staff.id)}>
                                    <Trash2 size={14} className="mr-2 text-destructive" />
                                    Remove Staff Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No active staff members found.
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="inactive">
          <BlurCard>
            <BlurCardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.filter(staff => staff.status === "inactive").length > 0 ? 
                      filteredStaff
                        .filter(staff => staff.status === "inactive")
                        .map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={staff.avatar} alt={staff.name} />
                                  <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-xs text-muted-foreground">{staff.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(staff.role)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Mail size={12} className="mr-1" />
                                  {staff.email}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Phone size={12} className="mr-1" />
                                  {staff.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(staff.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar size={12} className="mr-1" />
                                {staff.joinedDate}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <span className="sr-only">Actions</span>
                                    <Edit size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openPermissionsDialog(staff)}>
                                    <Shield size={14} className="mr-2 text-blue-500" />
                                    Edit Permissions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(staff.id)}>
                                    <UserCircle size={14} className="mr-2 text-green-500" />
                                    Set as Active
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteStaff(staff.id)}>
                                    <Trash2 size={14} className="mr-2 text-destructive" />
                                    Remove Staff Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No inactive staff members found.
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </div>
            </BlurCardContent>
          </BlurCard>
        </TabsContent>
      </Tabs>
      
      {/* Permissions Edit Dialog */}
      <Dialog open={showEditPermissionsDialog} onOpenChange={setShowEditPermissionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Permissions</DialogTitle>
            <DialogDescription>
              Update permissions for {selectedStaff?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                  <AvatarFallback>{getInitials(selectedStaff.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-base">{selectedStaff.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStaff.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perm-waitlist" className="cursor-pointer">Manage Waitlist</Label>
                      <p className="text-xs text-muted-foreground">Can view and edit waitlists</p>
                    </div>
                    <Switch 
                      id="perm-waitlist" 
                      checked={selectedStaff.permissions.manageWaitlist}
                      onCheckedChange={(checked) => 
                        setSelectedStaff({
                          ...selectedStaff, 
                          permissions: {...selectedStaff.permissions, manageWaitlist: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perm-appointments" className="cursor-pointer">Manage Appointments</Label>
                      <p className="text-xs text-muted-foreground">Can schedule and edit appointments</p>
                    </div>
                    <Switch 
                      id="perm-appointments" 
                      checked={selectedStaff.permissions.manageAppointments}
                      onCheckedChange={(checked) => 
                        setSelectedStaff({
                          ...selectedStaff, 
                          permissions: {...selectedStaff.permissions, manageAppointments: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perm-staff" className="cursor-pointer">Manage Staff</Label>
                      <p className="text-xs text-muted-foreground">Can add, edit and remove staff members</p>
                    </div>
                    <Switch 
                      id="perm-staff" 
                      checked={selectedStaff.permissions.manageStaff}
                      onCheckedChange={(checked) => 
                        setSelectedStaff({
                          ...selectedStaff, 
                          permissions: {...selectedStaff.permissions, manageStaff: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perm-settings" className="cursor-pointer">Manage Settings</Label>
                      <p className="text-xs text-muted-foreground">Can modify system settings</p>
                    </div>
                    <Switch 
                      id="perm-settings" 
                      checked={selectedStaff.permissions.manageSettings}
                      onCheckedChange={(checked) => 
                        setSelectedStaff({
                          ...selectedStaff, 
                          permissions: {...selectedStaff.permissions, manageSettings: checked}
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perm-reports" className="cursor-pointer">View Reports</Label>
                      <p className="text-xs text-muted-foreground">Can access analytics and reports</p>
                    </div>
                    <Switch 
                      id="perm-reports" 
                      checked={selectedStaff.permissions.viewReports}
                      onCheckedChange={(checked) => 
                        setSelectedStaff({
                          ...selectedStaff, 
                          permissions: {...selectedStaff.permissions, viewReports: checked}
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPermissionsDialog(false)}>Cancel</Button>
            <Button onClick={savePermissions}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagementPage;
